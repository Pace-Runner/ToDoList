"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { archiveTask, createTask, getTask, updateTask } from "@/lib/tasks";
import { TASK_PRIORITIES, TASK_STATUSES, TaskPriority, TaskStatus } from "@/lib/types";

function parsePriority(value: FormDataEntryValue | null): TaskPriority {
  return TASK_PRIORITIES.includes(value as TaskPriority)
    ? (value as TaskPriority)
    : "medium";
}

function parseStatus(value: FormDataEntryValue | null): TaskStatus {
  return TASK_STATUSES.includes(value as TaskStatus)
    ? (value as TaskStatus)
    : "todo";
}

export async function createTaskAction(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const dueDate = String(formData.get("dueDate") ?? "").trim();
  const topic = String(formData.get("topic") ?? "").trim();
  const priority = parsePriority(formData.get("priority"));

  if (!title || !dueDate || !topic) {
    throw new Error("Title, due date and topic are required.");
  }

  createTask({ title, description, dueDate, topic, priority });

  revalidatePath("/");
  redirect("/");
}

export async function updateTaskAction(id: number, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const dueDate = String(formData.get("dueDate") ?? "").trim();
  const topic = String(formData.get("topic") ?? "").trim();
  const priority = parsePriority(formData.get("priority"));
  const status = parseStatus(formData.get("status"));

  if (!title || !dueDate || !topic) {
    throw new Error("Title, due date and topic are required.");
  }

  updateTask(id, { title, description, dueDate, topic, priority, status });

  revalidatePath("/");
  revalidatePath("/completed");
  redirect("/");
}

/** Toggles between complete and todo — the one-click checkbox on a task row. */
export async function toggleTaskCompleteAction(id: number) {
  const task = getTask(id);
  if (!task) return;

  const status: TaskStatus = task.status === "complete" ? "todo" : "complete";
  updateTask(id, { ...task, status });

  revalidatePath("/");
  revalidatePath("/completed");
}

export async function archiveTaskAction(id: number) {
  archiveTask(id);

  revalidatePath("/");
  revalidatePath("/completed");
  revalidatePath("/archived");
}
