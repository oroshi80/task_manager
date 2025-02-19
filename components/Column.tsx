import Task from "./Task";

interface ColumnProps {
  title: string;
  tasks: { id: string; title: string }[];
}

export default function Column({ title, tasks }: ColumnProps) {
  return (
    <div className="bg-gray-200 dark:bg-gray-600 p-4 rounded-md w-64">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      {tasks.map((task) => (
        <Task key={task.id} title={task.title} />
      ))}
    </div>
  );
}
