import Link from "next/link";
import { getCompletedTasks } from "@/lib/tasks";
import TaskRow from "@/components/TaskRow";

export default function CompletedPage() {
  const tasks = getCompletedTasks();

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-sm p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Completed</h1>
          <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Back to Tasks
          </Link>
        </div>

        {tasks.length === 0 ? (
          <p className="text-gray-400 py-6 text-center">No completed tasks yet.</p>
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
