export const formatLocalDateTimeArray = (
  dateTime: [number, number, number, number, number, number, number],
) => {
  const [year, month, day, hour, minute, second] = dateTime;

  const dd = String(day).padStart(2, "0");
  const mm = String(month).padStart(2, "0");
  const yyyy = String(year);
  const hh = String(hour).padStart(2, "0");
  const min = String(minute).padStart(2, "0");
  const ss = String(second).padStart(2, "0");

  return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
};
