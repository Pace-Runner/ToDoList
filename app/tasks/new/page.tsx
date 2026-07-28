import Link from "next/link";
import TaskForm from "@/components/TaskForm";
import { createTaskAction } from "@/app/actions";
import { todayISODate } from "@/lib/date";

export default function NewTaskPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-sm p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">New Task</h1>
          <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Cancel
          </Link>
        </div>
        <TaskForm
          action={createTaskAction}
          submitLabel="Create Task"
          defaultValues={{
            title: "",
            description: "",
            dueDate: todayISODate(),
            topic: "",
          }}
        />
      </div>
    </main>
  );
}
