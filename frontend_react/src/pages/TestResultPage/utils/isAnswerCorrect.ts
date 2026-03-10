import { isAnswerEmpty } from "./isAnswerEmpty";

export function isAnswerCorrect(
  userAnswer?: string | string[] | null,
  correctAnswer?: string | string[] | null,
): boolean {
  if (isAnswerEmpty(userAnswer) || isAnswerEmpty(correctAnswer)) return false;

  const norm = (s: string) => s.trim().toLowerCase();

  const toList = (v: string | string[]) =>
    (Array.isArray(v) ? v : [v])
      .map((x) => norm(String(x)))
      .filter((x) => x.length > 0);

  const u = toList(userAnswer as any);
  const c = toList(correctAnswer as any);

  if (u.length === 0 || c.length === 0) return false;

  // single vs single
  if (u.length === 1 && c.length === 1) return u[0] === c[0];

  // set compare (order-insensitive)
  const uSet = new Set(u);
  const cSet = new Set(c);

  if (uSet.size !== cSet.size) return false;
  for (const x of uSet) if (!cSet.has(x)) return false;
  return true;
}
