import { useMemo, useState } from "react";
import type { ExerciseMetadata, SortBy } from "../types";

const dateToMillis = (v: string) => {
  const t = new Date(v).getTime();
  return Number.isFinite(t) ? t : 0;
};

const attemptsToNumber = (v: string) => {
  const n = Number(String(v).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

export function useExerciseSort(params: { exercises: ExerciseMetadata[] }) {
  const { exercises } = params;

  const [sortBy, setSortBy] = useState<SortBy>("newest");

  const sortedExercises = useMemo(() => {
    const arr = [...exercises];

    switch (sortBy) {
      case "newest":
        return arr.sort(
          (a, b) => dateToMillis(b.updated) - dateToMillis(a.updated),
        );
      case "oldest":
        return arr.sort(
          (a, b) => dateToMillis(a.updated) - dateToMillis(b.updated),
        );
      case "attempts":
        return arr.sort((a, b) => b.attempts - a.attempts);
      case "a-z":
        return arr.sort((a, b) => a.title.localeCompare(b.title));
      case "z-a":
        return arr.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return arr;
    }
  }, [exercises, sortBy]);

  return {
    state: { sortBy },
    setters: { setSortBy },
    derived: { sortedExercises },
  };
}
