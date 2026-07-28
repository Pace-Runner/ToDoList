import db from "./db";
import { NewTaskInput, Task, TaskPriority, TaskStatus } from "./types";

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

/** Active, not-yet-complete tasks in default (priority, then soonest due date) order. */
export function getTasks(): Task[] {
  const rows = db
    .prepare(
      `SELECT * FROM tasks
       WHERE archived_at IS NULL AND status != 'complete'
       ORDER BY ${PRIORITY_ORDER_SQL}, due_date ASC`,
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
