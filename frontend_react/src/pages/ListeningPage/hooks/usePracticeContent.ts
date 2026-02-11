import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ExerciseMetadata, PracticeContentDTO } from "../types";
import { PRACTICE_CONTENT_DTO_INCLUDE_FIELDS_QUERY } from "../types";
import { apiGet } from "../../../utils/api";

export function formatLocalDateTimeArrayToISODate(arr?: number[]): string {
  if (!arr || arr.length < 3) return "";

  const [y, m, d] = arr;

  const yyyy = String(y).padStart(4, "0");
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

function parseTaskNumberFromString(task: string): number {
  const match = task.match(/(\d+)/);
  const n = match ? Number(match[1]) : NaN;

  return n;
}

function mapPracticeContentDTOToExerciseMetadata(
  dto: PracticeContentDTO,
): ExerciseMetadata {
  return {
    id: dto.id ?? "",
    skill: dto.skill ?? "",
    title: dto.title ?? "",
    attempts: "0",
    image: dto.thumbnailUrl ?? "",
    task: parseTaskNumberFromString(dto.task),
    questionTypes: dto.questionTypeTags ?? [],
    topics: dto.topicTags ?? [],
    status: dto.status,
    updated: formatLocalDateTimeArrayToISODate(dto.updatedOn),
    questions: dto.questionCount ?? 0,
    duration: dto.durationMinutes ?? 0,
  };
}

export function usePracticeContent(params: {
  apiBase: string;
  initialExercises?: ExerciseMetadata[];
}) {
  const { apiBase, initialExercises = [] } = params;

  const [exercises, setExercises] =
    useState<ExerciseMetadata[]>(initialExercises);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchExercises = useCallback(async () => {
    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const res = await apiGet<PracticeContentDTO[]>({
        apiBase,
        path: "/api/practice-content",
        include: PRACTICE_CONTENT_DTO_INCLUDE_FIELDS_QUERY,
        signal: controller.signal,
      });

      if (controller.signal.aborted) return;

      if (!res.ok) {
        setError(res.message);
        return;
      }

      setExercises(
        (res.data ?? []).map(mapPracticeContentDTOToExerciseMetadata),
      );
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    void fetchExercises();

    return () => {
      abortRef.current?.abort();
    };
  }, [fetchExercises]);

  return useMemo(
    () => ({
      exercises,
      setExercises,
      loading,
      error,
      refetch: fetchExercises,
    }),
    [exercises, loading, error, fetchExercises],
  );
}
