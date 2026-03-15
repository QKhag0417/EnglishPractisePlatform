export function formatTaskLabel(task: string): string {
  if (task === "TASK_1") return "Task 1";
  if (task === "TASK_2") return "Task 2";
  if (task === "TASK_3") return "Task 3";
  if (task === "TASK_4") return "Task 4";

  return task;
}
