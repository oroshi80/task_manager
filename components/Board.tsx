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
  TouchSensor,
} from "@dnd-kit/core";
import Column from "./Column";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import EditTask from "@/components/EditTaskModal";
import Task from "./Task";

interface BoardProps {
  tasks: Task[];
  fetchTasks: () => void;
}

// const databaseType = process.env.NEXT_PUBLIC_DATABASE; // Make sure it's accessible in the client

export default function Board({ tasks, fetchTasks }: BoardProps) {
  const [taskToDelete, setTaskToDelete] = useState<string | number | null>(
    null
  );
  const [taskToDeleteTitle, setTaskToDeleteTitle] = useState<string>("");
  const [taskToEditID, setTaskToEditID] = useState<string | number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setEditIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [localTasks, setLocalTasks] = useState<Task[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150, // Short delay before dragging (prevents accidental taps)
        tolerance: 5, // Ignore tiny movements
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Normalize task IDs for compatibility
  const normalizeTasks = (tasks: Task[]) => {
    return tasks.map((task) => ({
      id: task._id ? String(task._id) : String(task.id ?? ""), // Ensure _id is converted properly
      title: task.title,
      description: task.description,
      status: task.status,
    }));
  };

  // Sync local state with `tasks` prop
  useEffect(() => {
    const normalized = normalizeTasks(tasks);
    setLocalTasks(normalized);
    console.log(
      "✅ Really Fixed Normalized Tasks:",
      JSON.stringify(normalized, null, 2)
    ); // Logs correct IDs
  }, [tasks]);

  // Handle task deletion
  const handleDeleteClick = (id: number | string, title: string) => {
    return new Promise<void>((resolve) => {
      // Your existing logic for handling delete...
      setTaskToDelete(id);
      setTaskToDeleteTitle(title);
      setIsModalOpen(true);
      resolve(); // Ensure it returns a Promise<void>
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
          if (!response.ok) throw new Error("Failed to delete task.");
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
      toast.error(
        `❌ ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
      setTaskToDelete(null);
    }
  };

  // Handle edit click
  const handleEditClick = (id: number | string): Promise<void> => {
    return new Promise<void>((resolve) => {
      setTaskToEditID(id);
      setEditIsModalOpen(true);
      resolve(); // Ensure it returns a Promise<void>
    });
  };

  const handleEditSubmit = async (data: {
    id: number | string;
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
      toast.error(`Error updating task. Error: ${error}`);
    } finally {
      setIsEditLoading(false);
      setEditIsModalOpen(false);
    }
  };

  // Handle task movement via drag-and-drop
  const handleTaskMove = async (taskId: string, newStatus: Task["status"]) => {
    try {
      setIsLoading(true);
      // const task = localTasks.find((t) => t.id === taskId);
      const task = localTasks.find((t) => String(t.id || t._id) === taskId);
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

      fetchTasks();
    } catch (error) {
      toast.error(`❌ Failed to update task. Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    // Remove 'task-' prefix from event.active.id if present
    const taskId = String(event.active.id).replace(/^task-/, ""); // Strip the 'task-' prefix

    // Normalize comparison with string IDs for MongoDB and MySQL
    const task = tasks.find((t) => String(t._id || t.id) === taskId);
    console.log("start drag triggered: ", task);

    setActiveTask(task || null);
  };

  // Handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;

    console.log("Drag End - Active Task:", active);
    console.log("Drag End - Over Element:", over);

    if (!over) return;

    // Remove 'task-' prefix from active.id if present
    const taskId = String(active.id).replace(/^task-/, "");
    const newStatus = over.id as "to-do" | "in-progress" | "done";

    console.log("Task ID:", taskId);
    console.log("New Status:", newStatus);

    // Ensure valid status before continuing
    if (!["to-do", "in-progress", "done"].includes(newStatus)) return;

    // Debugging Task ID and available tasks
    console.log("Current Tasks:", tasks);

    // Find the task using the appropriate ID
    const task = tasks.find((t) => {
      const taskIdMatch = String(t._id || t.id) === taskId;
      console.log(
        `Checking task with ID ${t._id || t.id} against ${taskId}:`,
        taskIdMatch
      );
      return taskIdMatch;
    });

    // If task is not found or status is the same, exit early
    if (!task) {
      console.log("Task not found!");
      return;
    }
    if (task.status === newStatus) {
      console.log("Task status is the same. No update needed.");
      return;
    }

    console.log("Task found:", task);

    // Optimistically update UI
    const updatedTasks = localTasks.map((t) =>
      String(t.id || t._id) === taskId ? { ...t, status: newStatus } : t
    );
    console.log("Updated Tasks: ", updatedTasks);
    setLocalTasks(updatedTasks); // Update local state immediately

    try {
      console.log("Init try statement");

      // Call your API to persist the task status change
      await handleTaskMove(taskId, newStatus);
      console.log("await passed through with data: ", taskId, newStatus);

      // If the API call is successful, update the localTasks with the final status
      setLocalTasks((prevTasks) =>
        prevTasks.map((t) =>
          String(t.id || t._id) === taskId ? { ...t, status: newStatus } : t
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error(`❌ Failed to update task. Reverting... Error: ${error}`);

      // Revert task status to previous value in case of failure
      setLocalTasks((prevTasks) =>
        prevTasks.map((t) =>
          String(t.id || t._id) === taskId ? { ...t, status: task.status } : t
        )
      );
    }
  };

  return (
    <>
      <div className="gap-4 p-4">
        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-x-4 p-4">
            {["to-do", "in-progress", "done"].map((status) => (
              <Column
                key={status}
                id={status}
                title={status.replace("-", " ").toUpperCase()}
                tasks={localTasks.filter((t) => t.status === status)}
                onDelete={handleDeleteClick}
                onEdit={handleEditClick}
              />
            ))}
          </div>

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
        task={localTasks.find((task) => task.id === taskToEditID) || null}
        isLoading={isEditLoading}
      />
    </>
  );
}
