import { STATUS_LABELS, Task } from "@/lib/types";

export default function TaskRow({ task }: { task: Task }) {
  return (
    <tr className="border-b last:border-b-0">
      <td className="py-2 pr-4 font-medium">{task.title}</td>
      <td className="py-2 pr-4">{task.topic}</td>
      <td className="py-2 pr-4">{task.dueDate}</td>
      <td className="py-2 pr-4">{STATUS_LABELS[task.status]}</td>
    </tr>
  );
}
