"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { archiveTask, createTask, getTask, updateTask } from "@/lib/tasks";
import {
  DEFAULT_PRIORITY,
  DEFAULT_STATUS,
  NewTaskInput,
  TASK_PRIORITIES,
  TASK_STATUSES,
  TaskPriority,
  TaskStatus,
} from "@/lib/types";

/**
 * Validates a submitted priority against the fixed set of allowed
 * values, falling back to DEFAULT_PRIORITY for anything else (e.g. a
 * missing or tampered field).
 *
 * @param value - the raw "priority" form field.
 * @returns a valid TaskPriority.
 */
function parsePriority(value: FormDataEntryValue | null): TaskPriority {
  return TASK_PRIORITIES.includes(value as TaskPriority)
    ? (value as TaskPriority)
    : DEFAULT_PRIORITY;
}

/**
 * Validates a submitted status against the fixed set of allowed values,
 * falling back to DEFAULT_STATUS for anything else.
 *
 * @param value - the raw "status" form field.
 * @returns a valid TaskStatus.
 */
function parseStatus(value: FormDataEntryValue | null): TaskStatus {
  return TASK_STATUSES.includes(value as TaskStatus)
    ? (value as TaskStatus)
    : DEFAULT_STATUS;
}

/**
 * Extracts and validates the fields shared by the create and edit forms
 * (title, description, due date, topic, priority) — status is parsed
 * separately since only the edit form submits it.
 *
 * @param formData - the submitted create/edit form data.
 * @returns the parsed, trimmed fields.
 * @throws if title, due date or topic is blank.
 */
function parseTaskFormFields(formData: FormData): NewTaskInput {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const dueDate = String(formData.get("dueDate") ?? "").trim();
  const topic = String(formData.get("topic") ?? "").trim();
  const priority = parsePriority(formData.get("priority"));

  if (!title || !dueDate || !topic) {
    throw new Error("Title, due date and topic are required.");
  }

  return { title, description, dueDate, topic, priority };
}

/**
 * Server Action behind the "New Task" form: creates the task, then
 * refreshes and redirects to the task list.
 *
 * @param formData - the submitted create-task form data.
 */
export async function createTaskAction(formData: FormData) {
  const fields = parseTaskFormFields(formData);

  createTask(fields);

  revalidatePath("/");
  redirect("/");
}

/**
 * Server Action behind the "Edit Task" form: overwrites the task's
 * fields (including status), then refreshes and redirects to the task
 * list.
 *
 * @param id - the task being edited (bound into the form action).
 * @param formData - the submitted edit-task form data.
 */
export async function updateTaskAction(id: number, formData: FormData) {
  const fields = parseTaskFormFields(formData);
  const status = parseStatus(formData.get("status"));

  updateTask(id, { ...fields, status });

  revalidatePath("/");
  revalidatePath("/completed");
  redirect("/");
}

/**
 * Server Action behind the one-click checkbox on a task row: flips the
 * task between complete and todo without a full edit round-trip, then
 * refreshes the list and completed pages in place (no redirect, since
 * this is invoked from a row's own inline form, not a separate page).
 * No-ops silently if the task no longer exists.
 *
 * @param id - the task to toggle (bound into the form action).
 */
export async function toggleTaskCompleteAction(id: number) {
  const task = getTask(id);
  if (!task) return;

  const status: TaskStatus = task.status === "complete" ? "todo" : "complete";
  updateTask(id, { ...task, status });

  revalidatePath("/");
  revalidatePath("/completed");
}

/**
 * Server Action behind a task row's Archive button: flags the task as
 * archived and refreshes every page that could be showing it.
 *
 * @param id - the task to archive (bound into the form action).
 */
export async function archiveTaskAction(id: number) {
  archiveTask(id);

  revalidatePath("/");
  revalidatePath("/completed");
  revalidatePath("/archived");
}
