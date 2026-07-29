import Link from "next/link";
import { SORT_LABELS, TASK_SORT_FIELDS, TaskSortField } from "@/lib/types";

/**
 * Builds the Tailwind classes for a sort pill, styling it as selected
 * when it matches the currently active sort.
 *
 * @param active - whether this pill represents the current sort.
 * @returns the pill's class string.
 */
function getPillClass(active: boolean): string {
  return `px-2.5 py-1 rounded-full ${
    active ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"
  }`;
}

/**
 * The row of "Sort by" pills on the task list — Priority (the default,
 * no sort param) plus one pill per TaskSortField. Each pill is a plain
 * link to `/?sort=<field>`, so sorting works without client-side JS.
 *
 * @param activeSort - the currently applied sort field, if any.
 */
export default function SortControls({ activeSort }: { activeSort?: TaskSortField }) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium flex-wrap">
      <span className="text-gray-400">Sort by</span>
      <Link href="/" className={getPillClass(!activeSort)}>
        Priority
      </Link>
      {TASK_SORT_FIELDS.map((field) => (
        <Link key={field} href={`/?sort=${field}`} className={getPillClass(activeSort === field)}>
          {SORT_LABELS[field]}
        </Link>
      ))}
    </div>
  );
}
