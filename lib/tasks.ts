import { NewTaskInput, Task, PRIORITY_WEIGHT } from "./types";

/**
 * In-memory placeholder store. Swapped for SQLite in the next slice — kept
 * behind this same function surface so the UI/actions built against it don't
 * need to change.
 */
const tasks: Task[] = [
  {
    id: 1,
    title: "Set up the project repo",
    description: "Scaffold the Next.js app and push the first commit.",
    dueDate: "2026-07-25",
    topic: "SDP",
    status: "complete",
    priority: "low",
    archivedAt: null,
    createdAt: "2026-07-20T09:00:00.000Z",
    updatedAt: "2026-07-25T09:00:00.000Z",
  },
  {
    id: 2,
    title: "Design the database schema",
    description: "Decide on columns and constraints for the tasks table.",
    dueDate: "2026-07-30",
    topic: "SDP",
    status: "in-progress",
    priority: "high",
    archivedAt: null,
    createdAt: "2026-07-21T09:00:00.000Z",
    updatedAt: "2026-07-21T09:00:00.000Z",
  },
  {
    id: 3,
    title: "Write the README",
    description: "Third-party code, database design and running instructions.",
    dueDate: "2026-08-03",
    topic: "SDP",
    status: "todo",
    priority: "medium",
    archivedAt: null,
    createdAt: "2026-07-22T09:00:00.000Z",
    updatedAt: "2026-07-22T09:00:00.000Z",
  },
];

let nextId = tasks.length + 1;

/** Active, not-yet-complete tasks in default (priority, then soonest due date) order. */
export function getTasks(): Task[] {
  return tasks
    .filter((t) => t.archivedAt === null && t.status !== "complete")
    .sort((a, b) => {
      const byPriority = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
      if (byPriority !== 0) return byPriority;
      return a.dueDate.localeCompare(b.dueDate);
    });
}

/** Active tasks marked complete, most recently completed first. */
export function getCompletedTasks(): Task[] {
  return tasks
    .filter((t) => t.archivedAt === null && t.status === "complete")
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getArchivedTasks(): Task[] {
  return tasks.filter((t) => t.archivedAt !== null);
}

export function getTask(id: number): Task | undefined {
  return tasks.find((t) => t.id === id);
}

export function createTask(input: NewTaskInput): Task {
  const now = new Date().toISOString();
  const task: Task = {
    id: nextId++,
    title: input.title,
    description: input.description,
    dueDate: input.dueDate,
    topic: input.topic,
    status: "todo",
    priority: input.priority,
    archivedAt: null,
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(task);
  return task;
}
