"use client";
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import Task from "./Task";
import { Card, CardBody, CardHeader } from "@heroui/react";

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
      <Card
        ref={setNodeRef}
        className="bg-black/5 dark:bg-white/5 p-4 rounded-md w-full sm:w-96 min-h-fit drop-shadow-md"
      >
        <CardHeader>
          <h2 className="text-xl font-bold mb-2">{title}</h2>
        </CardHeader>
        <CardBody>
          {tasks.map((task) => (
            <Task key={task.id} onDelete={onDelete} onEdit={onEdit} {...task} />
          ))}
        </CardBody>
      </Card>
    </>
  );
}
