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

const inputClass =
  "border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

export default function TaskForm({
  action,
  submitLabel,
  defaultValues,
  showStatus = false,
}: TaskFormProps) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Title</span>
        <input
          type="text"
          name="title"
          required
          defaultValue={defaultValues?.title}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Description</span>
        <textarea
          name="description"
          rows={3}
          defaultValue={defaultValues?.description}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Due Date</span>
        <input
          type="date"
          name="dueDate"
          required
          defaultValue={defaultValues?.dueDate}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Topic</span>
        <input
          type="text"
          name="topic"
          required
          defaultValue={defaultValues?.topic}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Priority</span>
        <select
          name="priority"
          defaultValue={defaultValues?.priority ?? "medium"}
          className={inputClass}
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
          <span className="text-sm font-medium text-gray-700">Status</span>
          <select
            name="status"
            defaultValue={defaultValues?.status}
            className={inputClass}
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
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl px-4 py-2 self-start transition-colors"
      >
        {submitLabel}
      </button>
    </form>
  );
}
