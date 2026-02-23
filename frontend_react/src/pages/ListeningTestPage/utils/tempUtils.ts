export const taskTypeToNumber = (task?: string): number => {
  switch (task) {
    case "TASK_1":
      return 1;
    case "TASK_2":
      return 2;
    case "TASK_3":
      return 3;
    case "TASK_4":
      return 4;
    default:
      return 0;
  }
};

export const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";

  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

export const buildAudioUrl = (apiBase: string, path?: string) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${apiBase}${path.startsWith("/") ? "" : "/"}${path}`;
};
