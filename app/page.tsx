"use client";
import React, { useState } from "react";
import { Button } from "@heroui/react";
import { FaPlus } from "react-icons/fa"; // Assuming you're using react-icons
import AddTask from "@/components/AddTaskModal";
import Board from "@/components/Board";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTask = async (data: {
    title: string;
    description: string;
  }) => {
    try {
      // Show loading toast
      toast
        .promise(
          fetch("/api/tasks/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: Date.now().toString(), // Unique ID generation
              title: data.title,
              description: data.description,
              status: "To Do", // Default status
            }),
          }).then((response) => {
            if (!response.ok) {
              throw new Error("Failed to create task");
            }
            return response.json();
          }),
          {
            pending: "Creating task...", // Message while waiting for the API
            success: "Task added successfully! 🎉", // Message on success
            error: "Error adding task. Please try again. ❌", // Message on error
          }
        )
        .then((newTask) => {
          // Update the tasks state if the task creation was successful
          setTasks([...tasks, newTask]);
        });
    } catch (error) {
      // If something goes wrong outside of fetch (unlikely but safe to catch)
      toast.error(
        `❌ Something went wrong. Please try again. error:  ${error}`
      );
    }
  };

  return (
    <>
      <div className="flex justify-center items-center">
        <Button
          endContent={<FaPlus />}
          onPress={() => setIsModalOpen(true)}
          color="primary"
        >
          Add Task
        </Button>
      </div>

      <main className="flex justify-center items-center">
        <Board tasks={tasks} />
      </main>

      <AddTask
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTask}
      />
    </>
  );
}
