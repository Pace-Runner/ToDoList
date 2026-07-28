import Link from "next/link";
import { getTasks } from "@/lib/tasks";
import TaskRow from "@/components/TaskRow";

export default function HomePage() {
  const tasks = getTasks();

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-sm p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link
              href="/archived"
              className="text-gray-500 hover:text-gray-700"
            >
              Archived
            </Link>
            <Link
              href="/completed"
              className="text-gray-500 hover:text-gray-700"
            >
              Completed
            </Link>
            <Link href="/tasks/new" className="text-blue-600 hover:text-blue-700">
              + New
            </Link>
          </div>
        </div>

        {tasks.length === 0 ? (
          <p className="text-gray-400 py-6 text-center">No tasks yet.</p>
        ) : (
          <ul className="flex flex-col">
            {tasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
