// src/features/practice-submission-answer/hooks/useGetPracticeSubmissionAnswers.ts
import { API_BASE } from "../../../env";
import { useApiGet } from "../../../utils/api/useApiGet";
import {
  PracticeSubmissionAnswerDTO,
  PRACTICE_SUBMISSION_ANSWER_DTO_INCLUDE_FIELDS_QUERY,
  PracticeSubmissionAnswer,
} from "../types";

function mapPracticeSubmissionAnswerDTOsToPracticeSubmissionAnswers(
  dtos: PracticeSubmissionAnswerDTO[],
): PracticeSubmissionAnswer[] {
  return (dtos ?? []).map((dto) => ({
    id: dto.id ?? "",
    orderIndex: dto.orderIndex ?? 0,
    answers: dto.answers ?? [],
    result: dto.result ?? "SKIPPED",
  }));
}

const initialPracticeSubmissionAnswers: PracticeSubmissionAnswer[] = [];

export function useGetPracticeSubmissionAnswers(submissionId: string) {
  const {
    item: answers,
    setItem: setAnswers,
    loading,
    error,
    get,
  } = useApiGet<PracticeSubmissionAnswerDTO[], PracticeSubmissionAnswer[]>({
    request: {
      apiBase: API_BASE,
      path: `/api/practice-submission-answer/submission/${submissionId}`,
      include: PRACTICE_SUBMISSION_ANSWER_DTO_INCLUDE_FIELDS_QUERY,
    },
    initialItem: initialPracticeSubmissionAnswers,
    mapItem: mapPracticeSubmissionAnswerDTOsToPracticeSubmissionAnswers,
  });

  return {
    answers,
    setAnswers,
    loading,
    error,
    get,
  };
}
