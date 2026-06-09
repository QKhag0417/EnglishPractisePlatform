export function buildFullName(firstname?: string, lastname?: string): string {
  const safeFirstname = firstname ?? "";
  const safeLastname = lastname ?? "";

  return `${safeFirstname} ${safeLastname}`.trim();
}
