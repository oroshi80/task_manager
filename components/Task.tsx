"use client";
import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Divider, Tooltip, Button } from "@heroui/react";
import { FaTimes, FaPen } from "react-icons/fa";

interface TaskProps {
  id: number;
  title: string;
  description: string;
  status: "to-do" | "in-progress" | "done";
  isOverlay?: boolean; // Add this line
  onDelete?: (id: number, title: string) => void;
  onEdit?: (
    id: number,
    title: string,
    description: string,
    status: "to-do" | "in-progress" | "done"
  ) => void;
}

const Task: React.FC<TaskProps> = ({
  id,
  title,
  description,
  status,
  isOverlay,
  onDelete,
  onEdit,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `task-${id}`,
  });

  const style = {
    transform: isOverlay ? "scale(1.05)" : undefined,
    boxShadow: isOverlay ? "0px 5px 15px rgba(0,0,0,0.2)" : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`relative bg-white dark:bg-neutral-300 text-black p-2 mb-2 rounded shadow group `}
    >
      <div className="absolute top-1 right-2 hidden group-hover:flex gap-1">
        <Tooltip content="Edit">
          <Button
            color="default"
            className="rounded-full opacity-20"
            size="sm"
            isIconOnly
            onPress={() => onEdit?.(id, title, description, status)}
          >
            <FaPen />
          </Button>
        </Tooltip>
        <Tooltip content="Delete">
          <Button
            color="danger"
            className="rounded-full opacity-20"
            size="sm"
            isIconOnly
            onPress={() => onDelete?.(id, title)}
          >
            <FaTimes />
          </Button>
        </Tooltip>
      </div>

      <span className="font-bold text-xl">{title}</span>
      <Divider className="bg-gray-400 dark:bg-gray-500 my-1" />
      <div className="text-sm text-gray-600 dark:text-gray-800">
        {description}
      </div>
    </div>
  );
};

export default Task;
