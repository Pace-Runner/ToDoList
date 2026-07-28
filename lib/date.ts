import { Task } from "./types";

/** Today's date as an ISO YYYY-MM-DD string, in local time. */
export function todayISODate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Overdue is derived at read time from the due date, never stored: a task
 * is overdue if its due date has passed and it isn't complete or archived.
 * It is a visual flag, not a fourth status.
 */
export function isOverdue(task: Task): boolean {
  return (
    task.archivedAt === null &&
    task.status !== "complete" &&
    task.dueDate < todayISODate()
  );
}
