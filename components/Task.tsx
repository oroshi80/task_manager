import React from "react";
import { useDraggable } from "@dnd-kit/core";

interface TaskProps {
  id: string;
  task: { title: string; description: string };
}

const Task: React.FC<TaskProps> = ({ id, task }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`task ${isDragging ? "dragging" : ""}`}
    >
      <h4>{task.title}</h4>
      <p>{task.description}</p>
    </div>
  );
};

export default Task;
