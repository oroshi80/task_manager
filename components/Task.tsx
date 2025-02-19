import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Divider, Tooltip, Button } from "@heroui/react";
import { FaTimes } from "react-icons/fa";

interface TaskProps {
  id: string;
  title: string;
  description: string;
  onDelete: (id: string, title: string) => void; // Pass delete function
}

const Task: React.FC<TaskProps> = ({ id, title, description, onDelete }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="relative bg-white dark:bg-neutral-300 text-black p-2 mb-2 rounded shadow group"
    >
      {/* ✅ Delete button - Shows on hover */}
      <div className="absolute top-1 right-2 hidden group-hover:flex">
        <Tooltip content="Delete">
          <Button
            color="danger"
            className="rounded-full opacity-20"
            size="sm"
            isIconOnly
            onPress={() => onDelete(id, title)}
          >
            <FaTimes />
          </Button>
        </Tooltip>
      </div>

      {/* ✅ Task Content */}
      <span className="font-bold text-xl">{title}</span>
      <Divider className="bg-gray-400 dark:bg-gray-500 my-1" />
      <div className="text-sm text-gray-600 dark:text-gray-800">
        {description}
      </div>
    </div>
  );
};

export default Task;
