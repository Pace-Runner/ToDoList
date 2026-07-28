import Link from "next/link";
import { toggleTaskCompleteAction } from "@/app/actions";
import { Task } from "@/lib/types";

const PRIORITY_DOT_COLOR: Record<Task["priority"], string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-gray-300",
};

export default function TaskRow({ task }: { task: Task }) {
  const isComplete = task.status === "complete";

  return (
    <li className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0">
      <form action={toggleTaskCompleteAction.bind(null, task.id)}>
        <button
          type="submit"
          aria-label={isComplete ? "Mark as not complete" : "Mark as complete"}
          title={`Priority: ${task.priority}`}
          className={`h-5 w-5 rounded-full shrink-0 flex items-center justify-center transition-colors ${
            isComplete
              ? "bg-green-500"
              : `${PRIORITY_DOT_COLOR[task.priority]} hover:opacity-75`
          }`}
        >
          {isComplete && (
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-3 w-3 text-white"
              aria-hidden="true"
            >
              <path d="M16.7 5.3a1 1 0 010 1.4l-7 7a1 1 0 01-1.4 0l-3-3a1 1 0 111.4-1.4L9 11.6l6.3-6.3a1 1 0 011.4 0z" />
            </svg>
          )}
        </button>
      </form>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{task.title}</p>
        <p className="text-sm text-gray-500 truncate">
          {task.topic} &middot; {task.dueDate}
        </p>
      </div>
      <Link
        href={`/tasks/${task.id}/edit`}
        className="text-sm font-medium text-blue-600 hover:text-blue-700 shrink-0"
      >
        Edit
      </Link>
    </li>
  );
}
