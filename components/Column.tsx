import React from "react";
import Task from "./Task";

interface ColumnProps {
  title: string;
  tasks: { id: string; title: string; description: string }[];
  onDelete: (id: string, title: string) => Promise<void>;
}

export default function Column({ title, tasks, onDelete }: ColumnProps) {
  return (
    <div className="bg-gray-200 dark:bg-gray-600 p-4 rounded-md w-64">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      {tasks.map((task) => (
        <Task
          key={task.id}
          id={task.id}
          title={task.title}
          description={task.description}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
