import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { apiGet } from "../../../utils/api";
import {
  ExerciseAnswer,
  PracticeContentDTO,
  PRACTICE_CONTENT_DTO_INCLUDE_FIELDS_QUERY,
} from "../types";

type Args = {
  apiBase: string;
  exerciseId?: string;
  initialAnswers: ExerciseAnswer;
};

function mapPracticeContentDTOToExerciseAnswer(
  dto: PracticeContentDTO,
): ExerciseAnswer {
  const correctAnswers: Record<number, string | string[]> = {};

  return {
    id: dto.id,
    correctAnswers,
  };
}

export function useExerciseAnswers({
  apiBase,
  exerciseId,
  initialAnswers,
}: Args) {
  const [exerciseAnswers, setExerciseAnswers] =
    useState<ExerciseAnswer>(initialAnswers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!exerciseId) setExerciseAnswers(initialAnswers);
  }, [exerciseId, initialAnswers]);

  const fetchAnswers = useCallback(async () => {
    if (!exerciseId) return;

    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const res = await apiGet<PracticeContentDTO>({
        apiBase,
        path: `/api/practice-content/${exerciseId}/answers`,
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

      setExerciseAnswers(mapPracticeContentDTOToExerciseAnswer(dto));
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [apiBase, exerciseId]);

  useEffect(() => {
    void fetchAnswers();

    return () => {
      abortRef.current?.abort();
    };
  }, [fetchAnswers]);

  return useMemo(
    () => ({
      exerciseAnswers,
      setExerciseAnswers,
      loading,
      error,
      refetch: fetchAnswers,
    }),
    [exerciseAnswers, loading, error, fetchAnswers],
  );
}
