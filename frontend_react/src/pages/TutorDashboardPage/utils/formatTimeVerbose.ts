export const formatTimeVerbose = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];

  if (hrs > 0) {
    parts.push(`${hrs} hour${hrs !== 1 ? "s" : ""}`);
  }

  if (mins > 0 || hrs > 0) {
    parts.push(`${mins} minute${mins !== 1 ? "s" : ""}`);
  }

  parts.push(`${secs} second${secs !== 1 ? "s" : ""}`);

  return parts.join(" ");
};
