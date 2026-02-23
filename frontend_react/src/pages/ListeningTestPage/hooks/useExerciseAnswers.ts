import { useEffect, useState } from "react";
import type { ExerciseAnswer } from "../types";

type Args = {
  apiBase: string;
  exerciseId?: string;
  initialAnswers: ExerciseAnswer;
};

export function useExerciseAnswers({
  apiBase,
  exerciseId,
  initialAnswers,
}: Args) {
  const [exerciseAnswers, setExerciseAnswers] =
    useState<ExerciseAnswer>(initialAnswers);

  useEffect(() => {
    if (!exerciseId) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(
          `${apiBase}/api/practice-content/${exerciseId}/answers`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
            credentials: "include",
          },
        );

        const json = await res.json();
        const dto = json?.data;

        if (!dto || cancelled) return;

        const correctAnswers: Record<number, string | string[]> = {};

        for (const a of dto.answers ?? []) {
          const list: string[] = a?.correctAnswers ?? [];
          correctAnswers[a.orderIndex] =
            list.length <= 1 ? (list[0] ?? "") : list;
        }

        const answers: ExerciseAnswer = {
          id: dto.id,
          correctAnswers,
        };

        setExerciseAnswers(answers);
      } catch (err) {
        console.error("Failed to fetch answers:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [apiBase, exerciseId]);

  return { exerciseAnswers, setExerciseAnswers };
}
