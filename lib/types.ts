export type TaskStatus = "todo" | "in-progress" | "complete";

export const TASK_STATUSES: TaskStatus[] = ["todo", "in-progress", "complete"];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "Todo",
  "in-progress": "In Progress",
  complete: "Complete",
};

export type TaskPriority = "low" | "medium" | "high";

export const TASK_PRIORITIES: TaskPriority[] = ["low", "medium", "high"];

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

// Higher weight sorts first in the default (priority) ordering.
export const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

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
