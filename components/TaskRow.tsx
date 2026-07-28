import { Task } from "@/lib/types";

const PRIORITY_DOT_COLOR: Record<Task["priority"], string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-gray-300",
};

export default function TaskRow({ task }: { task: Task }) {
  return (
    <li className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0">
      <span
        className={`h-2.5 w-2.5 rounded-full shrink-0 ${PRIORITY_DOT_COLOR[task.priority]}`}
        title={`Priority: ${task.priority}`}
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{task.title}</p>
        <p className="text-sm text-gray-500 truncate">
          {task.topic} &middot; {task.dueDate}
        </p>
      </div>
    </li>
  );
}
