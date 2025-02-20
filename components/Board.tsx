"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
} from "@dnd-kit/core";
import Column from "./Column";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import EditTask from "@/components/EditTaskModal";
import Task from "./Task";

// interface Task {
//   id: number;
//   title: string;
//   description: string;
//   status: "to-do" | "in-progress" | "done";
// }

interface BoardProps {
  tasks: Task[]; // Accept tasks as a prop
  fetchTasks: () => void; // Accept fetchTasks as a prop
}

export default function Board({ tasks, fetchTasks }: BoardProps) {
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [taskToDeleteTitle, setTaskToDeleteTitle] = useState<string>("");
  const [taskToID, setTaskToID] = useState<number | null>(null);
  const [taskToDescription, setTaskToDescription] = useState<string>("");
  const [taskToTitle, setTaskToTitle] = useState<string>("");
  const [taskToStatus, setTaskToStatus] = useState<
    "to-do" | "in-progress" | "done"
  >();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setEditIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    setLocalTasks(tasks); // Sync state when `tasks` update
  }, [tasks]);

  const handleDeleteClick = (id: number, title: string): Promise<void> => {
    return new Promise((resolve) => {
      setTaskToDelete(id);
      setTaskToDeleteTitle(title);
      setIsModalOpen(true);
      resolve();
    });
  };

  const handleEditClick = (
    id: number,
    title: string,
    description: string,
    status: "to-do" | "in-progress" | "done"
  ): Promise<void> => {
    return new Promise((resolve) => {
      setTaskToID(id);
      setTaskToTitle(title);
      setTaskToDescription(description);
      setTaskToStatus(status);
      setEditIsModalOpen(true);
      resolve();
    });
  };

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
      fetchTasks();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`❌ ${error.message}`);
      } else {
        toast.error("❌ An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
    setIsModalOpen(false);
    setTaskToDelete(null);
  };

  const handleEditSubmit = async (data: {
    id: number;
    title: string;
    description: string;
    status: "to-do" | "in-progress" | "done";
  }) => {
    try {
      setIsEditLoading(true);
      const response = await fetch(`/api/tasks/update/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          status: data.status,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        fetchTasks();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error updating task");
    } finally {
      setIsEditLoading(false);
      setEditIsModalOpen(false);
    }
  };

  // Update Task from Dragging (by the status)
  const handleTaskMove = async (taskId: number, newStatus: Task["status"]) => {
    try {
      setIsLoading(true);
      const task = tasks.find((t) => t.id === taskId);
      if (!task) {
        toast.error("❌ Task not found.");
        return;
      }

      await fetch(`/api/tasks/update/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          status: newStatus,
        }),
      });

      // toast.success("✅ Task updated successfully!");
      fetchTasks();
    } catch (error) {
      toast.error("❌ Failed to update task.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = Number((active.id as string).split("-")[1]);
    const task = tasks.find((t) => t.id === taskId);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return; // If dropped outside, do nothing

    const taskId = Number((active.id as string).split("-")[1]);

    // Type over.id as "to-do" | "in-progress" | "done"
    const newStatus: "to-do" | "in-progress" | "done" = over.id as
      | "to-do"
      | "in-progress"
      | "done";

    if (!["to-do", "in-progress", "done"].includes(newStatus)) return;

    // 🔹 Get the original task before moving
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return; // No need to update

    const prevStatus = task.status; // Save original status in case of failure

    // 🔹 Step 1: Optimistically update the UI (task stays in new column)
    setLocalTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      // 🔹 Step 2: Call API to update task status
      await handleTaskMove(taskId, newStatus);
    } catch (error) {
      toast.error("❌ Failed to update task. Reverting...");

      // 🔹 Step 3: Revert task to original column if API fails
      setLocalTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? { ...t, status: prevStatus } : t
        )
      );
    }
  };

  return (
    <>
      <div className="flex gap-4 p-4">
        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 p-4">
            {/* ✅ Columns are Droppable */}
            <Column
              id="to-do"
              title="To Do"
              tasks={localTasks.filter((t) => t.status === "to-do")}
              onDelete={handleDeleteClick}
              onEdit={handleEditClick}
            />
            <Column
              id="in-progress"
              title="In Progress"
              tasks={localTasks.filter((t) => t.status === "in-progress")}
              onDelete={handleDeleteClick}
              onEdit={handleEditClick}
            />
            <Column
              id="done"
              title="Done"
              tasks={localTasks.filter((t) => t.status === "done")}
              onDelete={handleDeleteClick}
              onEdit={handleEditClick}
            />
          </div>
          {/* ✅ DragOverlay for smooth dragging */}
          <DragOverlay>
            {activeTask ? <Task {...activeTask} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={taskToDeleteTitle}
        isLoading={isLoading}
      />
      <EditTask
        isOpen={isEditModalOpen}
        onClose={() => setEditIsModalOpen(false)}
        onSubmit={handleEditSubmit}
        task={tasks.find((task) => task.id === Number(taskToID)) || null}
        isLoading={isEditLoading}
      />
    </>
  );
}
