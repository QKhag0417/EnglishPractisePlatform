export const localDateTimeArrayToDate = (
  dateTime: [number, number, number, number, number, number, number],
) => {
  const [year, month, day, hour, minute, second, nanosecond] = dateTime;

  return new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    second,
    Math.floor(nanosecond / 1_000_000),
  );
};
