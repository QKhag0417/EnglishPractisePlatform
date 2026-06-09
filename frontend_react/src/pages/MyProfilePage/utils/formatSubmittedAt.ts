import { LocalDateTimeArray } from "../types";

export const formatSubmittedAt = (dateTime?: LocalDateTimeArray) => {
  if (!dateTime) return "";

  const [year, month, day] = dateTime;

  const dd = String(day).padStart(2, "0");
  const mm = String(month).padStart(2, "0");

  return `${dd}/${mm}/${year}`;
};
