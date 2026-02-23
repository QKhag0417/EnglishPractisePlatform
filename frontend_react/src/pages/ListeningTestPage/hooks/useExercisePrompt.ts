import { useEffect, useState } from "react";
import type { ExercisePrompt } from "../types";
import { taskTypeToNumber } from "../utils/tempUtils.ts";

type Args = {
  apiBase: string;
  exerciseId?: string;
  initialPrompt: ExercisePrompt;
};

export function useExercisePrompt({
  apiBase,
  exerciseId,
  initialPrompt,
}: Args) {
  const [exercisePrompt, setExercisePrompt] =
    useState<ExercisePrompt>(initialPrompt);

  useEffect(() => {
    if (!exerciseId) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(
          `${apiBase}/api/practice-content/${exerciseId}/prompt`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
            credentials: "include",
          },
        );

        const json = await res.json();
        const dto = json?.data;

        if (!dto || cancelled) return;

        const prompt: ExercisePrompt = {
          id: dto.id,
          task: taskTypeToNumber(dto.task),
          duration: dto.duration ?? 0,
          audioUrl: dto.audioUrl ?? "",
          examText: dto.examText ?? "",
          totalQuestions: dto.totalQuestions ?? 0,
        };

        setExercisePrompt(prompt);
      } catch (err) {
        console.error("Failed to fetch prompt:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [apiBase, exerciseId]);

  return { exercisePrompt, setExercisePrompt };
}
