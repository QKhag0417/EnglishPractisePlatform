import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import {
  ExercisePrompt,
  PracticeContentDTO,
  PRACTICE_CONTENT_DTO_INCLUDE_FIELDS_QUERY,
} from "../types";
import { apiGet } from "../../../utils/api";

type Args = {
  apiBase: string;
  exerciseId?: string;
  initialPrompt: ExercisePrompt;
};

export const taskTypeToNumber = (task?: string): number => {
  switch (task) {
    case "TASK_1":
      return 1;
    case "TASK_2":
      return 2;
    case "TASK_3":
      return 3;
    case "TASK_4":
      return 4;
    default:
      return 0;
  }
};

function mapPracticeContentDTOToExercisePrompt(
  dto: PracticeContentDTO,
): ExercisePrompt {
  return {
    id: dto.id,
    task: taskTypeToNumber(dto.task),
    duration: dto.durationMinutes ?? 0,
    audioUrl: dto.audioUrl ?? "",
    examText: dto.instructionsParsed ?? "",
    totalQuestions: dto.questionCount ?? 0,
  };
}

export function useExercisePrompt({
  apiBase,
  exerciseId,
  initialPrompt,
}: Args) {
  const [exercisePrompt, setExercisePrompt] =
    useState<ExercisePrompt>(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!exerciseId) setExercisePrompt(initialPrompt);
  }, [exerciseId, initialPrompt]);

  const fetchPrompt = useCallback(async () => {
    if (!exerciseId) return;

    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const res = await apiGet<PracticeContentDTO>({
        apiBase,
        path: `/api/practice-content/${exerciseId}`,
        include: PRACTICE_CONTENT_DTO_INCLUDE_FIELDS_QUERY,
        signal: controller.signal,
      });

      if (controller.signal.aborted) return;

      if (!res.ok) {
        setError(res.message);
        return;
      }

      const dto = res.data;
      if (!dto) return;

      setExercisePrompt(mapPracticeContentDTOToExercisePrompt(dto));
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [apiBase, exerciseId]);

  useEffect(() => {
    void fetchPrompt();

    return () => {
      abortRef.current?.abort();
    };
  }, [fetchPrompt]);

  return useMemo(
    () => ({
      exercisePrompt,
      setExercisePrompt,
      loading,
      error,
      refetch: fetchPrompt,
    }),
    [exercisePrompt, loading, error, fetchPrompt],
  );
}
