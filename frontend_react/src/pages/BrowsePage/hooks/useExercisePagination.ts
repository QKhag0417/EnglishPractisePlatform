import { useEffect, useMemo, useState } from "react";
import type { ExerciseMetadata } from "../types";

export function useExercisePagination(params: {
  exercises: ExerciseMetadata[];
  itemsPerPage?: number;
}) {
  const { exercises, itemsPerPage = 12 } = params;

  const [page, setPage] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(exercises.length / itemsPerPage)),
    [exercises.length, itemsPerPage],
  );

  const currentExercises = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return exercises.slice(startIndex, endIndex);
  }, [exercises, page, itemsPerPage]);

  // keep page within range when dataset shrinks
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  const resetPage = () => setPage(1);

  return {
    state: { page, itemsPerPage },
    setters: { setPage },
    derived: { totalPages, currentExercises },
    actions: { resetPage },
  };
}
