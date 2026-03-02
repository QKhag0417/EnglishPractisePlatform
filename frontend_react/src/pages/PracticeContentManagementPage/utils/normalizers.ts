import { PracticeContentMetadata } from "../types";

export const normalizeSkill = (
  s: unknown,
): PracticeContentMetadata["skill"] => {
  switch (String(s ?? "").toUpperCase()) {
    case "LISTENING":
      return "Listening";
    case "READING":
      return "Reading";
    case "WRITING":
      return "Writing";
    case "SPEAKING":
      return "Speaking";
    default:
      return "Reading";
  }
};

export const normalizeStatus = (
  s: unknown,
): PracticeContentMetadata["status"] => {
  switch (String(s ?? "").toUpperCase()) {
    case "PUBLISHED":
      return "Published";
    case "DRAFT":
      return "Draft";
    default:
      return "Draft";
  }
};

export const normalizeUpdatedOn = (v: unknown): string => {
  if (typeof v === "string") return v;

  if (Array.isArray(v)) {
    const [y, m, d, hh = 0, mm = 0, ss = 0, nano = 0] = v as number[];
    const ms = Math.floor((nano ?? 0) / 1_000_000);
    const date = new Date(y, (m ?? 1) - 1, d ?? 1, hh, mm, ss, ms);
    return date.toISOString();
  }

  return "";
};