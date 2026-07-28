import TaskForm from "@/components/TaskForm";
import { createTaskAction } from "@/app/actions";

export default function NewTaskPage() {
  return (
    <main className="max-w-3xl mx-auto p-8 flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">New Task</h1>
      <TaskForm action={createTaskAction} submitLabel="Create Task" />
    </main>
  );
}
