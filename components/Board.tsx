"use client";

import React, { useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import Column from "./Column";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "to-do" | "in-progress" | "done";
}

interface BoardProps {
  tasks: Task[]; // Accept tasks as a prop
  fetchTasks: () => void; // Accept fetchTasks as a prop
}

export default function Board({ tasks, fetchTasks }: BoardProps) {
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [taskToDeleteTitle, setTaskToDeleteTitle] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle deleting task logic
  const handleDeleteClick = (id: string, title: string): Promise<void> => {
    return new Promise((resolve) => {
      setTaskToDelete(id);
      setTaskToDeleteTitle(title);
      setIsModalOpen(true);
      resolve();
    });
  };

  // Confirm and delete the task from the database
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;

    setIsLoading(true);

    try {
      await toast.promise(
        fetch(`/api/tasks/delete/${taskToDelete}`, {
          method: "DELETE",
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete task.");
          }
          return response.json();
        }),
        {
          pending: "Deleting task...",
          success: "✅ Task deleted!",
          error: "❌ Error deleting task. Please try again.",
        }
      );

      fetchTasks(); // Refresh task list after deletion
    } catch (error) {
      toast.error(`❌ ${error.message}`);
    } finally {
      setIsLoading(false);
    }

    setIsModalOpen(false);
    setTaskToDelete(null);
  };

  // Drag and drop functionality
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over) {
      const targetColumn = over.id as "to-do" | "in-progress" | "done";
      handleTaskMove(active.id as string, targetColumn); // Move task to the target column
    }
  };

  return (
    <>
      <div className="flex gap-4 p-4">
        <DndContext onDragEnd={handleDragEnd}>
          <Column
            title="To Do"
            tasks={tasks.filter((task) => task.status === "to-do")}
            onDelete={handleDeleteClick}
          />
          <Column
            title="In Progress"
            tasks={tasks.filter((task) => task.status === "in-progress")}
            onDelete={handleDeleteClick}
          />
          <Column
            title="Done"
            tasks={tasks.filter((task) => task.status === "done")}
            onDelete={handleDeleteClick}
          />
        </DndContext>
      </div>

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={taskToDeleteTitle}
        isLoading={isLoading}
      />
    </>
  );
}
