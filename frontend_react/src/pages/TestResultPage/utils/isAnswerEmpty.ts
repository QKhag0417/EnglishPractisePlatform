export function isAnswerEmpty(v?: string | string[] | null): boolean {
  if (v == null) return true;
  if (Array.isArray(v)) {
    return v.length === 0 || v.every((x) => (x ?? "").toString().trim() === "");
  }
  return v.toString().trim() === "";
}
