import { useMemo } from "react";
import type { ExerciseMetadata } from "../types";

const SKILL_MAP = {
  listening: "LISTENING",
  reading: "READING",
  writing: "WRITING",
  speaking: "SPEAKING",
} as const;

export type AllowedSkill = (typeof SKILL_MAP)[keyof typeof SKILL_MAP];

export function useFilterExercisesBySkill(
  exercises: ExerciseMetadata[],
  skillParam?: string,
) {
  const skill = useMemo<AllowedSkill | null>(() => {
    const key = (skillParam ?? "").toLowerCase() as keyof typeof SKILL_MAP;
    return SKILL_MAP[key] ?? null;
  }, [skillParam]);

  const skillExercises = useMemo(() => {
    if (!skill) return [];
    return exercises.filter((e) => (e.skill ?? "").toUpperCase() === skill);
  }, [exercises, skill]);

  return { skill, skillExercises };
}
