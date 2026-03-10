// src/features/practice-content-answer/hooks/useGetPracticeContentAnswers.ts
import { API_BASE } from "../../../env";
import { useApiGet } from "../../../utils/api/useApiGet";
import {
  PracticeContentAnswerDTO,
  PracticeContentAnswer,
  PRACTICE_CONTENT_ANSWER_DTO_INCLUDE_FIELDS_QUERY,
} from "../types";

function mapPracticeContentAnswerDTOsToPracticeContentAnswers(
  dtos: PracticeContentAnswerDTO[],
): PracticeContentAnswer[] {
  return (dtos ?? []).map((dto) => ({
    id: dto.id ?? "",
    orderIndex: dto.orderIndex ?? 0,
    correctAnswers: dto.correctAnswers ?? [],
  }));
}

const initialPracticeContentAnswers: PracticeContentAnswerDTO[] = [];

export function useGetPracticeContentAnswers(practiceContentId: string) {
  const {
    item: answers,
    setItem: setAnswers,
    loading,
    error,
    get,
  } = useApiGet<PracticeContentAnswerDTO[], PracticeContentAnswer[]>({
    request: {
      apiBase: API_BASE,
      path: `/api/practice-question/${practiceContentId}`,
      include: PRACTICE_CONTENT_ANSWER_DTO_INCLUDE_FIELDS_QUERY, // "orderIndex,correctAnswers"
    },
    initialItem: initialPracticeContentAnswers,
    mapItem: mapPracticeContentAnswerDTOsToPracticeContentAnswers,
  });

  return {
    answers,
    setAnswers,
    loading,
    error,
    get,
  };
}
