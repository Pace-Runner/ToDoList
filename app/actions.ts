"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createTask } from "@/lib/tasks";

export async function createTaskAction(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const dueDate = String(formData.get("dueDate") ?? "").trim();
  const topic = String(formData.get("topic") ?? "").trim();

  if (!title || !dueDate || !topic) {
    throw new Error("Title, due date and topic are required.");
  }

  createTask({ title, description, dueDate, topic });

  revalidatePath("/");
  redirect("/");
}
