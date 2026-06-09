import { LocalDateTimeArray } from "../types";

export function formatRelativeLocalDateTime(
  value?: LocalDateTimeArray,
): string {
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

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (diffMs < 0) return "just now";

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;

  return `${years} year${years === 1 ? "" : "s"} ago`;
}
