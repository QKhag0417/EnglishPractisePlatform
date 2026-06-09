import { UserRole } from "../types";

export function mapRole(raw: unknown): UserRole | null {
  if (!raw) return null;
  const r = String(raw).toLowerCase();

  if (r === "guest") return null;
  if (r === "administrator" || r === "admin") return "administrator";
  if (r === "tutor") return "tutor";
  if (r === "learner" || r === "user" || r === "student") return "learner";

  return null;
}
