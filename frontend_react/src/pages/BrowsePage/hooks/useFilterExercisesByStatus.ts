import { useMemo } from "react";
import type { ExerciseMetadata } from "../types";

export type AllowedStatus = "PUBLISHED";

export function useFilterExercisesByStatus(
  exercises: ExerciseMetadata[],
  status: AllowedStatus = "PUBLISHED",
) {
  const filteredExercises = useMemo(() => {
    const target = status.toUpperCase();
    return (exercises ?? []).filter(
      (e) => (e.status ?? "").toUpperCase() === target,
    );
  }, [exercises, status]);

  return { status, filteredExercises };
}
