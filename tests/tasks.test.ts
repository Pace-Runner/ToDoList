import { beforeEach, describe, expect, it } from "vitest";
import db from "@/lib/db";
import {
  archiveTask,
  createTask,
  getArchivedTasks,
  getCompletedTasks,
  getTasks,
  updateTask,
} from "@/lib/tasks";
import { isOverdue } from "@/lib/date";
import { NewTaskInput } from "@/lib/types";

beforeEach(() => {
  db.exec("DELETE FROM tasks");
});

function makeTask(overrides: Partial<NewTaskInput> = {}) {
  return createTask({
    title: "Sample task",
    description: "",
    dueDate: "2026-08-01",
    topic: "General",
    priority: "medium",
    ...overrides,
  });
}

describe("createTask", () => {
  it("appears in the active task list", () => {
    const task = makeTask({ title: "Write tests" });

    const tasks = getTasks();

    expect(tasks.find((t) => t.id === task.id)?.title).toBe("Write tests");
  });
});

describe("updateTask", () => {
  it("persists field changes", () => {
    const task = makeTask({ title: "Original title" });

    updateTask(task.id, { ...task, title: "Updated title" });

    expect(getTasks().find((t) => t.id === task.id)?.title).toBe(
      "Updated title",
    );
  });

  it("moves a task to the completed list once its status becomes complete", () => {
    const task = makeTask();

    updateTask(task.id, { ...task, status: "complete" });

    expect(getTasks().map((t) => t.id)).not.toContain(task.id);
    expect(getCompletedTasks().map((t) => t.id)).toContain(task.id);
  });
});

describe("archiveTask", () => {
  it("removes the task from the active list but keeps it viewable", () => {
    const task = makeTask({ title: "Archive me" });

    archiveTask(task.id);

    expect(getTasks().map((t) => t.id)).not.toContain(task.id);
    const archived = getArchivedTasks();
    expect(archived.find((t) => t.id === task.id)?.title).toBe("Archive me");
  });
});

describe("isOverdue", () => {
  it("flags a past-due, active task as overdue", () => {
    const task = makeTask({ dueDate: "2000-01-01" });

    expect(isOverdue(task)).toBe(true);
  });

  it("does not flag a task due in the future", () => {
    const task = makeTask({ dueDate: "2999-01-01" });

    expect(isOverdue(task)).toBe(false);
  });

  it("does not flag a completed task, even with a past due date", () => {
    const task = makeTask({ dueDate: "2000-01-01" });

    const completed = updateTask(task.id, { ...task, status: "complete" });

    expect(isOverdue(completed)).toBe(false);
  });

  it("does not flag an archived task, even with a past due date", () => {
    const task = makeTask({ dueDate: "2000-01-01" });

    const archived = archiveTask(task.id);

    expect(isOverdue(archived)).toBe(false);
  });
});

describe("getTasks sorting", () => {
  it("orders by topic when asked", () => {
    makeTask({ title: "Z", topic: "Zebra" });
    makeTask({ title: "A", topic: "Alpha" });
    makeTask({ title: "M", topic: "Mango" });

    expect(getTasks("topic").map((t) => t.topic)).toEqual([
      "Alpha",
      "Mango",
      "Zebra",
    ]);
  });

  it("orders by due date when asked", () => {
    makeTask({ title: "Later", dueDate: "2026-12-01" });
    makeTask({ title: "Sooner", dueDate: "2026-01-01" });

    expect(getTasks("dueDate").map((t) => t.dueDate)).toEqual([
      "2026-01-01",
      "2026-12-01",
    ]);
  });
});
