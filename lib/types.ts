export type TaskStatus = "todo" | "in-progress" | "complete";

export const TASK_STATUSES: TaskStatus[] = ["todo", "in-progress", "complete"];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "Todo",
  "in-progress": "In Progress",
  complete: "Complete",
};

// Every new task starts here; also the fallback when a form omits status.
export const DEFAULT_STATUS: TaskStatus = "todo";

export type TaskPriority = "low" | "medium" | "high";

export const TASK_PRIORITIES: TaskPriority[] = ["low", "medium", "high"];

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

// Fallback when a form omits priority.
export const DEFAULT_PRIORITY: TaskPriority = "medium";

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string; // ISO date, e.g. 2026-08-04
  topic: string;
  status: TaskStatus;
  priority: TaskPriority;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NewTaskInput {
  title: string;
  description: string;
  dueDate: string;
  topic: string;
  priority: TaskPriority;
}

export type TaskSortField = "topic" | "status" | "dueDate";

export const TASK_SORT_FIELDS: TaskSortField[] = ["topic", "status", "dueDate"];

export const SORT_LABELS: Record<TaskSortField, string> = {
  topic: "Topic",
  status: "Status",
  dueDate: "Due Date",
};
