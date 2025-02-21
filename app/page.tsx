"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@heroui/react";
import { FaPlus } from "react-icons/fa";
import AddTask from "@/components/AddTaskModal";
import Board from "@/components/Board";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Tasks {
  id: number;
  title: string;
  description: string;
  status: "to-do" | "in-progress" | "done";
}

export default function Home() {
  // Consts
  const [tasks, setTasks] = useState<Tasks[]>([]); // Task state initialized properly
  const [isModalOpen, setIsModalOpen] = useState(false);
  const circleRadius = 500;
  const backgroundRef = useRef<HTMLDivElement | null>(null);
  const mousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Fetch tasks when the component mounts or when a new task is added
  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks/get");
      const data = await response.json();
      setTasks(data); // Update state with the new list of tasks
      console.log("Tasks Data: ", data);
    } catch (error) {
      toast.error(`❌ Error fetching tasks. Please try again. Error: ${error}`);
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []); // Fetch tasks once on component mount

  // hover effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.pageX, y: e.pageY };
      if (backgroundRef.current) {
        backgroundRef.current.style.background = `radial-gradient(circle ${circleRadius}px at ${mousePositionRef.current.x}px ${mousePositionRef.current.y}px, rgba(255,255,255,0.1) , transparent)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleAddTask = async (data: {
    title: string;
    description: string;
  }) => {
    try {
      toast
        .promise(
          fetch("/api/tasks/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: data.title,
              description: data.description,
              status: "to-do",
            }),
          }).then((response) => {
            if (!response.ok) {
              throw new Error("Failed to create task");
            }
            return response.json();
          }),
          {
            pending: "Creating task...",
            success: "Task added successfully! 🎉",
            error: "Error adding task. Please try again. ❌",
          }
        )
        .then(() => {
          fetchTasks(); // Fetch tasks after adding a new one to update state
        });
    } catch (error) {
      toast.error(`❌ Something went wrong. ${error}`);
    }
  };

  return (
    <main
      ref={backgroundRef}
      className="h-screen"
      style={{ maxHeight: "calc(100vh - 70px)" }}
    >
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
        <Board tasks={tasks} fetchTasks={fetchTasks} />{" "}
        {/* Pass fetchTasks to Board */}
      </main>

      <AddTask
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTask}
      />
    </main>
  );
}
