import Link from "next/link";
import { getTasks } from "@/lib/tasks";
import TaskRow from "@/components/TaskRow";

export default function HomePage() {
  const tasks = getTasks();

  return (
    <main className="max-w-3xl mx-auto p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <Link
          href="/tasks/new"
          className="bg-black text-white rounded px-4 py-2 text-sm"
        >
          New Task
        </Link>
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks yet.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b font-medium">
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Topic</th>
              <th className="py-2 pr-4">Due Date</th>
              <th className="py-2 pr-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
