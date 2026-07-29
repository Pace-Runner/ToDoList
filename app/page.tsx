import Link from "next/link";
import { getTasks } from "@/lib/tasks";
import { TASK_SORT_FIELDS, TaskSortField } from "@/lib/types";
import TaskRow from "@/components/TaskRow";
import SortControls from "@/components/SortControls";

/**
 * Validates the raw `?sort=` query value against the fixed set of sort
 * fields, so an invalid or missing value safely falls back to no sort
 * (the default priority order) rather than reaching the database layer.
 *
 * @param value - the raw `sort` search param.
 * @returns a valid TaskSortField, or undefined for the default order.
 */
function parseSort(value: string | string[] | undefined): TaskSortField | undefined {
  return TASK_SORT_FIELDS.includes(value as TaskSortField)
    ? (value as TaskSortField)
    : undefined;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string | string[] }>;
}) {
  const { sort } = await searchParams;
  const activeSort = parseSort(sort);
  const tasks = getTasks(activeSort);

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

        <SortControls activeSort={activeSort} />

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
