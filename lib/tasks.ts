import db from "./db";
import {
  DEFAULT_STATUS,
  NewTaskInput,
  Task,
  TaskPriority,
  TaskSortField,
  TaskStatus,
} from "./types";

/**
 * Shape of a raw row as SQLite returns it (snake_case columns). Distinct
 * from the `TaskRow` UI component — this is the persistence-layer type,
 * never rendered directly.
 */
interface TaskRecord {
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

/**
 * Converts a raw database row into the camelCase Task shape the rest of
 * the app works with.
 *
 * @param record - a raw row as returned by a `tasks` table query.
 * @returns the equivalent Task.
 */
function recordToTask(record: TaskRecord): Task {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
    dueDate: record.due_date,
    topic: record.topic,
    status: record.status,
    priority: record.priority,
    archivedAt: record.archived_at,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
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
 * Reads the active, not-yet-complete tasks — the app's main list.
 *
 * @param sort - which field to order by (topic, status or due date). If
 *   omitted, tasks are ordered by priority (highest first), then by
 *   soonest due date.
 * @returns matching tasks in the requested order.
 */
export function getTasks(sort?: TaskSortField): Task[] {
  const orderBy = sort ? SORT_ORDER_SQL[sort] : `${PRIORITY_ORDER_SQL}, due_date ASC`;
  const records = db
    .prepare(
      `SELECT * FROM tasks
       WHERE archived_at IS NULL AND status != 'complete'
       ORDER BY ${orderBy}`,
    )
    .all() as unknown as TaskRecord[];
  return records.map(recordToTask);
}

/**
 * Reads active tasks whose status is complete, most recently completed
 * first.
 *
 * @returns matching tasks.
 */
export function getCompletedTasks(): Task[] {
  const records = db
    .prepare(
      `SELECT * FROM tasks
       WHERE archived_at IS NULL AND status = 'complete'
       ORDER BY updated_at DESC`,
    )
    .all() as unknown as TaskRecord[];
  return records.map(recordToTask);
}

/**
 * Reads archived tasks, most recently archived first. Archived tasks are
 * excluded from getTasks and getCompletedTasks but are never deleted, so
 * they remain readable here.
 *
 * @returns matching tasks.
 */
export function getArchivedTasks(): Task[] {
  const records = db
    .prepare(
      `SELECT * FROM tasks WHERE archived_at IS NOT NULL ORDER BY archived_at DESC`,
    )
    .all() as unknown as TaskRecord[];
  return records.map(recordToTask);
}

/**
 * Reads a single task by id, regardless of its status or archived state.
 *
 * @param id - the task's id.
 * @returns the task, or undefined if no task has that id.
 */
export function getTask(id: number): Task | undefined {
  const record = db
    .prepare(`SELECT * FROM tasks WHERE id = ?`)
    .get(id) as unknown as TaskRecord | undefined;
  return record ? recordToTask(record) : undefined;
}

/**
 * Creates a new task. Status always starts at DEFAULT_STATUS ("todo") —
 * new tasks are never created already in progress, complete or archived.
 *
 * @param input - the task fields supplied by the create-task form.
 * @returns the newly created task, including its generated id and
 *   timestamps.
 */
export function createTask(input: NewTaskInput): Task {
  const now = new Date().toISOString();
  const result = db
    .prepare(
      `INSERT INTO tasks (title, description, due_date, topic, status, priority, archived_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?)`,
    )
    .run(
      input.title,
      input.description,
      input.dueDate,
      input.topic,
      DEFAULT_STATUS,
      input.priority,
      now,
      now,
    );

  return getTask(Number(result.lastInsertRowid))!;
}

/**
 * Overwrites a task's editable fields, including status. Used both for a
 * full edit-form save and, with only `status` changed, for the one-click
 * complete/todo toggle.
 *
 * @param id - the task to update.
 * @param input - the full set of editable fields to write.
 * @returns the task as it now stands after the update.
 */
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

/**
 * Flags a task as archived rather than deleting it: sets archived_at to
 * the current time. The row is never removed or copied, so it stays
 * readable via getArchivedTasks.
 *
 * @param id - the task to archive.
 * @returns the task as it now stands after archiving.
 */
export function archiveTask(id: number): Task {
  const now = new Date().toISOString();
  db.prepare(`UPDATE tasks SET archived_at = ?, updated_at = ? WHERE id = ?`).run(
    now,
    now,
    id,
  );
  return getTask(id)!;
}
