export const formatToISO = (displayDate: string) => {
  if (!displayDate) return "";
  const [day, month, year] = displayDate.split("/");
  return `${year}-${month}-${day}`;
};
