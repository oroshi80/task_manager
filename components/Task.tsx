"use client";
import React from "react";
import { useDraggable } from "@dnd-kit/core";
import {
  Divider,
  Tooltip,
  Button,
  Card,
  CardHeader,
  CardBody,
} from "@heroui/react";
import { FaTimes, FaPen } from "react-icons/fa";

interface TaskProps {
  id: number | string;
  title: string;
  description: string;
  status: "to-do" | "in-progress" | "done";
  isOverlay?: boolean; // Add this line
  onDelete?: (id: number | string, title: string) => void;
  onEdit?: (
    id: number | string,
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

  // Log the isDragging value to the console
  // console.log("isDragging: ", isDragging);

  const style = {
    transform: isOverlay ? "scale(1.05)" : undefined,
    boxShadow: isOverlay ? "0px 5px 15px rgba(0,0,0,0.2)" : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      tabIndex={0} // Make task focusable for keyboard users
      style={style}
      className={`relative bg-white dark:bg-black text:black dark:text-white p-2 mb-2 rounded shadow group 
  ${
    status === "to-do"
      ? "border-l-4 transition-all border-red-500"
      : status === "in-progress"
      ? "border-l-4 transition-all border-yellow-500"
      : status === "done"
      ? "border-l-4 transition-all border-green-500"
      : ""
  }`}
    >
      <CardHeader className="text-lg ">
        {title}
        <div className="absolute top-1 right-2 hidden group-hover:flex gap-1">
          <Tooltip content="Edit" isDisabled={isOverlay}>
            <Button
              color="default"
              className="rounded-full opacity-75"
              size="sm"
              isIconOnly={true}
              onPress={() => onEdit?.(id, title, description, status)}
            >
              <FaPen />
            </Button>
          </Tooltip>
          <Tooltip content="Delete" isDisabled={isOverlay}>
            <Button
              color="danger"
              className="rounded-full opacity-75"
              size="sm"
              isIconOnly={true}
              onPress={() => onDelete?.(id, title)}
            >
              <FaTimes />
            </Button>
          </Tooltip>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="text-sm text-gray-600 dark:text-neutral-300 ">
        {description}
      </CardBody>
    </Card>
    //   <div
    //     ref={setNodeRef}
    //     {...attributes}
    //     {...listeners}
    //     tabIndex={0} // Make task focusable for keyboard users
    //     style={style}
    //     className={`relative bg-white dark:bg-black text:black dark:text-white p-2 mb-2 rounded shadow group
    // ${
    //   status === "to-do"
    //     ? "border-l-4 border-red-500"
    //     : status === "in-progress"
    //     ? "border-l-4 border-yellow-500"
    //     : status === "done"
    //     ? "border-l-4 border-green-500"
    //     : ""
    // }`}
    //   >
    //     <div className="absolute top-1 right-2 hidden group-hover:flex gap-1">
    //       <Tooltip content="Edit" isDisabled={isOverlay}>
    //         <Button
    //           color="default"
    //           className="rounded-full opacity-75"
    //           size="sm"
    //           isIconOnly={true}
    //           onPress={() => onEdit?.(id, title, description, status)}
    //         >
    //           <FaPen />
    //         </Button>
    //       </Tooltip>
    //       <Tooltip content="Delete" isDisabled={isOverlay}>
    //         <Button
    //           color="danger"
    //           className="rounded-full opacity-75"
    //           size="sm"
    //           isIconOnly={true}
    //           onPress={() => onDelete?.(id, title)}
    //         >
    //           <FaTimes />
    //         </Button>
    //       </Tooltip>
    //     </div>

    //     <div className="flex flex-col gap-2">
    //       <span className="text-lg">{title}</span> {/* text-nowrap truncate */}
    //       <Divider className="bg-gray-300 dark:bg-neutral-800" />
    //       <div className="text-sm text-gray-600 dark:text-neutral-400 ">
    //         {description}
    //       </div>
    //     </div>
    //   </div>
  );
};

export default Task;
