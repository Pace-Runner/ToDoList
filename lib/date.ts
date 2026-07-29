import { Task } from "./types";

/**
 * Returns today's date as an ISO YYYY-MM-DD string, in local time.
 * Used both to default a new task's due date and, via isOverdue, to
 * decide whether an existing task's due date has passed.
 */
export function getTodayISODate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Reports whether a task is overdue. Overdue is derived here at read
 * time from the due date rather than stored on the task, so it can
 * never go stale: a task is overdue if its due date has passed and it
 * is neither complete nor archived. This is a visual flag only — it is
 * not, and must never become, a fourth task status.
 *
 * @param task - the task to check.
 * @returns true if the task's due date is in the past and it is still
 *   active (not complete, not archived); false otherwise.
 */
export function isOverdue(task: Task): boolean {
  return (
    task.archivedAt === null &&
    task.status !== "complete" &&
    task.dueDate < getTodayISODate()
  );
}
