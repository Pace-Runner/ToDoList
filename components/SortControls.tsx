import Link from "next/link";
import { SORT_LABELS, TASK_SORT_FIELDS, TaskSortField } from "@/lib/types";

export default function SortControls({ activeSort }: { activeSort?: TaskSortField }) {
  const pillClass = (active: boolean) =>
    `px-2.5 py-1 rounded-full ${
      active ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"
    }`;

  return (
    <div className="flex items-center gap-2 text-xs font-medium flex-wrap">
      <span className="text-gray-400">Sort by</span>
      <Link href="/" className={pillClass(!activeSort)}>
        Priority
      </Link>
      {TASK_SORT_FIELDS.map((field) => (
        <Link key={field} href={`/?sort=${field}`} className={pillClass(activeSort === field)}>
          {SORT_LABELS[field]}
        </Link>
      ))}
    </div>
  );
}
