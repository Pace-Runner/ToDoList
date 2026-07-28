import {
  TASK_STATUSES,
  STATUS_LABELS,
  TASK_PRIORITIES,
  PRIORITY_LABELS,
  TaskStatus,
  TaskPriority,
} from "@/lib/types";

interface TaskFormProps {
  action: (formData: FormData) => void;
  submitLabel: string;
  defaultValues?: {
    title: string;
    description: string;
    dueDate: string;
    topic: string;
    priority?: TaskPriority;
    status?: TaskStatus;
  };
  showStatus?: boolean;
}

export default function TaskForm({
  action,
  submitLabel,
  defaultValues,
  showStatus = false,
}: TaskFormProps) {
  return (
    <form action={action} className="flex flex-col gap-4 max-w-md">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Title</span>
        <input
          type="text"
          name="title"
          required
          defaultValue={defaultValues?.title}
          className="border rounded px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Description</span>
        <textarea
          name="description"
          rows={3}
          defaultValue={defaultValues?.description}
          className="border rounded px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Due Date</span>
        <input
          type="date"
          name="dueDate"
          required
          defaultValue={defaultValues?.dueDate}
          className="border rounded px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Topic</span>
        <input
          type="text"
          name="topic"
          required
          defaultValue={defaultValues?.topic}
          className="border rounded px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Priority</span>
        <select
          name="priority"
          defaultValue={defaultValues?.priority ?? "medium"}
          className="border rounded px-3 py-2"
        >
          {TASK_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {PRIORITY_LABELS[priority]}
            </option>
          ))}
        </select>
      </label>

      {showStatus && (
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Status</span>
          <select
            name="status"
            defaultValue={defaultValues?.status}
            className="border rounded px-3 py-2"
          >
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </label>
      )}

      <button
        type="submit"
        className="bg-black text-white rounded px-4 py-2 self-start"
      >
        {submitLabel}
      </button>
    </form>
  );
}
