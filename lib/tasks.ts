import db from "./db";
import { NewTaskInput, Task, TaskPriority, TaskSortField, TaskStatus } from "./types";

interface TaskRow {
  id: number;
  title: string;
  description: string;
  due_date: string;
  topic: string;
  status: TaskStatus;
  priority: TaskPriority;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    dueDate: row.due_date,
    topic: row.topic,
    status: row.status,
    priority: row.priority,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const PRIORITY_ORDER_SQL = `
  CASE priority
    WHEN 'high' THEN 3
    WHEN 'medium' THEN 2
    WHEN 'low' THEN 1
  END DESC
`;

const STATUS_ORDER_SQL = `
  CASE status
    WHEN 'todo' THEN 1
    WHEN 'in-progress' THEN 2
    WHEN 'complete' THEN 3
  END ASC
`;

// Fixed lookup, not string interpolation of caller input — sort must be a
// valid TaskSortField (validated at the URL-parsing boundary) to reach here.
const SORT_ORDER_SQL: Record<TaskSortField, string> = {
  topic: "topic ASC, due_date ASC",
  status: `${STATUS_ORDER_SQL}, due_date ASC`,
  dueDate: "due_date ASC, topic ASC",
};

/**
 * Active, not-yet-complete tasks. Defaults to priority (then soonest due
 * date) order; pass a sort field to order by topic, status or due date
 * instead.
 */
export function getTasks(sort?: TaskSortField): Task[] {
  const orderBy = sort ? SORT_ORDER_SQL[sort] : `${PRIORITY_ORDER_SQL}, due_date ASC`;
  const rows = db
    .prepare(
      `SELECT * FROM tasks
       WHERE archived_at IS NULL AND status != 'complete'
       ORDER BY ${orderBy}`,
    )
    .all() as unknown as TaskRow[];
  return rows.map(rowToTask);
}

/** Active tasks marked complete, most recently completed first. */
export function getCompletedTasks(): Task[] {
  const rows = db
    .prepare(
      `SELECT * FROM tasks
       WHERE archived_at IS NULL AND status = 'complete'
       ORDER BY updated_at DESC`,
    )
    .all() as unknown as TaskRow[];
  return rows.map(rowToTask);
}

export function getArchivedTasks(): Task[] {
  const rows = db
    .prepare(
      `SELECT * FROM tasks WHERE archived_at IS NOT NULL ORDER BY archived_at DESC`,
    )
    .all() as unknown as TaskRow[];
  return rows.map(rowToTask);
}

export function getTask(id: number): Task | undefined {
  const row = db
    .prepare(`SELECT * FROM tasks WHERE id = ?`)
    .get(id) as unknown as TaskRow | undefined;
  return row ? rowToTask(row) : undefined;
}

export function createTask(input: NewTaskInput): Task {
  const now = new Date().toISOString();
  const result = db
    .prepare(
      `INSERT INTO tasks (title, description, due_date, topic, status, priority, archived_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'todo', ?, NULL, ?, ?)`,
    )
    .run(
      input.title,
      input.description,
      input.dueDate,
      input.topic,
      input.priority,
      now,
      now,
    );

  return getTask(Number(result.lastInsertRowid))!;
}

export function updateTask(
  id: number,
  input: NewTaskInput & { status: TaskStatus },
): Task {
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE tasks
     SET title = ?, description = ?, due_date = ?, topic = ?, priority = ?, status = ?, updated_at = ?
     WHERE id = ?`,
  ).run(
    input.title,
    input.description,
    input.dueDate,
    input.topic,
    input.priority,
    input.status,
    now,
    id,
  );
  return getTask(id)!;
}

/** Flags a task as archived rather than deleting it — it stays in the table, viewable via getArchivedTasks. */
export function archiveTask(id: number): Task {
  const now = new Date().toISOString();
  db.prepare(`UPDATE tasks SET archived_at = ?, updated_at = ? WHERE id = ?`).run(
    now,
    now,
    id,
  );
  return getTask(id)!;
}
