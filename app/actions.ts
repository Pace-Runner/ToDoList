"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createTask } from "@/lib/tasks";
import { TASK_PRIORITIES, TaskPriority } from "@/lib/types";

function parsePriority(value: FormDataEntryValue | null): TaskPriority {
  return TASK_PRIORITIES.includes(value as TaskPriority)
    ? (value as TaskPriority)
    : "medium";
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
