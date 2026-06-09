export function formatTaskLabel(task: number): string {
  switch (task) {
    case 0:
      return "All Tasks";
    case 1:
      return "Task 1";
    case 2:
      return "Task 2";
    case 3:
      return "Task 3";
    case 4:
      return "Task 4";
    default:
      return `Task ${task}`;
  }
}
