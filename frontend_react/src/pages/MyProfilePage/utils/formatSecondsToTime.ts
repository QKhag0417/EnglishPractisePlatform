export const formatSecondsToTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return `${hours > 0 ? String(hours).padStart(2, "0") + ":" : ""}${String(
    minutes,
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};
