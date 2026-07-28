export type TaskStatus = "todo" | "in-progress" | "complete";

export const TASK_STATUSES: TaskStatus[] = ["todo", "in-progress", "complete"];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "Todo",
  "in-progress": "In Progress",
  complete: "Complete",
};

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string; // ISO date, e.g. 2026-08-04
  topic: string;
  status: TaskStatus;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NewTaskInput {
  title: string;
  description: string;
  dueDate: string;
  topic: string;
}

export type TaskSortField = "topic" | "status" | "dueDate";
