export function mapTask(task?: string): string {
  switch (task) {
    case "ALL":
      return "All Tasks";
    case "TASK_1":
      return "Task 1";
    case "TASK_2":
      return "Task 2";
    case "TASK_3":
      return "Task 3";
    case "TASK_4":
      return "Task 4";
    default:
      return "Task 1";
  }
}
