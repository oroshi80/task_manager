"use client";
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import Task from "./Task";

interface ColumnProps {
  id: number | string;
  title: string;
  tasks: {
    id: number | string;
    title: string;
    description: string;
    status: "to-do" | "in-progress" | "done";
  }[];
  onDelete?: (id: number | string, title: string) => Promise<void>;
  onEdit?: (
    id: number | string,
    title: string,
    description: string,
    status: "to-do" | "in-progress" | "done"
  ) => Promise<void>;
}

export default function Column({
  id,
  title,
  tasks,
  onDelete,
  onEdit,
}: ColumnProps) {
  const { setNodeRef } = useDroppable({ id }); // ✅ Make column droppable

  return (
    <>
      {/* ✅ SortableContext only wraps tasks */}
      <div
        ref={setNodeRef}
        className="bg-gray-200 dark:bg-gray-600 p-4 rounded-md w-64 min-h-[300px] drop-shadow-md"
      >
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        {tasks.map((task) => (
          <Task key={task.id} onDelete={onDelete} onEdit={onEdit} {...task} />
        ))}
      </div>
    </>
  );
}
