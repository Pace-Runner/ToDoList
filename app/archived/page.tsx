import Link from "next/link";
import { getArchivedTasks } from "@/lib/tasks";
import TaskRow from "@/components/TaskRow";

// Always read the current database — this page has no static content to cache.
export const dynamic = "force-dynamic";

export default function ArchivedPage() {
  const tasks = getArchivedTasks();

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-sm p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Archived</h1>
          <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Back to Tasks
          </Link>
        </div>

        {tasks.length === 0 ? (
          <p className="text-gray-400 py-6 text-center">No archived tasks.</p>
        ) : (
          <ul className="flex flex-col">
            {tasks.map((task) => (
              <TaskRow key={task.id} task={task} readOnly />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
