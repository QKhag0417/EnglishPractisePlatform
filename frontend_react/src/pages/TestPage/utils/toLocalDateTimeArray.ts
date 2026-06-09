import { LocalDateTimeArray } from "../types";

export function toLocalDateTimeArray(date: Date): LocalDateTimeArray {
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds() * 1_000_000,
  ];
}
