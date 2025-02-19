"use client";

import React, { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  useDragOver,
  useDraggable,
} from "@dnd-kit/core";
import Column from "./Column";
import { toast } from "react-toastify";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
}

export default function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Fetch tasks from the API
  useEffect(() => {
    fetch("/api/tasks/get/")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  // Handle task movement between columns
  const handleTaskMove = async (
    taskId: string,
    targetStatus: "todo" | "in-progress" | "done"
  ) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: targetStatus } : task
    );

    // Update local state
    setTasks(updatedTasks);

    // Persist the changes to the API
    const task = updatedTasks.find((task) => task.id === taskId);
    if (task) {
      try {
        const response = await fetch(`/api/tasks/update/${taskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        });
        if (!response.ok) {
          throw new Error("Failed to update task status.");
        }
      } catch (error) {
        toast.error(`❌ ${error.message}`);
      }
    }
  };

  // Handle drag and drop end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over) {
      // Identify the target column and move the task
      const targetColumn = over.id as "todo" | "in-progress" | "done";
      handleTaskMove(active.id as string, targetColumn);
    }
  };

  return (
    <div className="flex gap-4 p-4">
      <DndContext onDragEnd={handleDragEnd}>
        <Column
          id="todo"
          title="To Do"
          tasks={tasks.filter((task) => task.status === "todo")}
          onTaskMove={handleTaskMove}
        />
        <Column
          id="in-progress"
          title="In Progress"
          tasks={tasks.filter((task) => task.status === "in-progress")}
          onTaskMove={handleTaskMove}
        />
        <Column
          id="done"
          title="Done"
          tasks={tasks.filter((task) => task.status === "done")}
          onTaskMove={handleTaskMove}
        />
      </DndContext>
    </div>
  );
}
