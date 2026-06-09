import { useEffect, useMemo, useState } from "react";
import type { ExerciseMetadata, TagFilter } from "../types";
import { UIQuestionType } from "../../MyProfilePage/types";

export function useFilterExercisesByQuestionType(params: {
  exercises: ExerciseMetadata[];
}) {
  const { exercises } = params;

  const [selectedQuestionType, setSelectedQuestionType] =
    useState<TagFilter>("all");

  const availableQuestionTypes = useMemo(() => {
    const set = new Set<UIQuestionType>();
    for (const ex of exercises) {
      for (const qt of ex.questionTypes ?? []) set.add(qt);
    }
    return Array.from(set).sort();
  }, [exercises]);

  useEffect(() => {
    if (selectedQuestionType === "all") return;
    if (!availableQuestionTypes.includes(selectedQuestionType)) {
      setSelectedQuestionType("all");
    }
  }, [availableQuestionTypes, selectedQuestionType]);

  const filteredExercises = useMemo(() => {
    if (selectedQuestionType === "all") return exercises;
    return exercises.filter((ex) =>
      (ex.questionTypes ?? []).includes(selectedQuestionType),
    );
  }, [exercises, selectedQuestionType]);

  return {
    state: { selectedQuestionType },
    setters: { setSelectedQuestionType },
    derived: { availableQuestionTypes, filteredExercises },
  };
}
