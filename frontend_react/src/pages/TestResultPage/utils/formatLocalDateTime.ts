import { LocalDateTimeArray } from "../types";

export function formatLocalDateTime(value?: LocalDateTimeArray): string {
  if (!value || value.length < 7) return "";

  const [year, month, day, hour, minute, second, nanosecond] = value;

  const date = new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    second,
    Math.floor(nanosecond / 1_000_000),
  );

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return `${formattedDate} at ${formattedTime}`;
}
