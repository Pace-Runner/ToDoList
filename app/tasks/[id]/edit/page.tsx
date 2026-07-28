import Link from "next/link";
import { notFound } from "next/navigation";
import TaskForm from "@/components/TaskForm";
import { updateTaskAction } from "@/app/actions";
import { getTask } from "@/lib/tasks";

export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const task = getTask(Number(id));

  if (!task) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-sm p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Edit Task</h1>
          <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Cancel
          </Link>
        </div>
        <TaskForm
          action={updateTaskAction.bind(null, task.id)}
          submitLabel="Save Changes"
          defaultValues={task}
          showStatus
        />
      </div>
    </main>
  );
}
