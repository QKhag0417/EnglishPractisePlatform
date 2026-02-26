import { useMemo, useState } from "react";
import { ExerciseMetadata } from "../types";

export function useFilterExercisesBySearch(params: {
  exercises: ExerciseMetadata[];
}) {
  const { exercises } = params;

  const [searchQuery, setSearchQuery] = useState("");

  const filteredExercises = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return exercises;

    return exercises.filter((ex) => (ex.title ?? "").toLowerCase().includes(q));
  }, [exercises, searchQuery]);

  return {
    state: { searchQuery },
    setters: { setSearchQuery },
    derived: { filteredExercises },
  };
}
