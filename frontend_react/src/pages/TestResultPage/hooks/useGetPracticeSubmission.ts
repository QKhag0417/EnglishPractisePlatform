import { API_BASE } from "../../../env";
import { useApiGet } from "../../../utils/api/useApiGet";
import {
  PracticeSubmission,
  PracticeSubmissionDTO,
  PRACTICE_SUBMISSION_DTO_INCLUDE_FIELDS_QUERY,
  LocalDateTimeArray,
} from "../types";

function mapPracticeSubmissionDTOToPracticeSubmission(
  dto: PracticeSubmissionDTO,
): PracticeSubmission {
  return {
    id: dto.id ?? "",
    userId: dto.userId ?? "",
    practiceContentId: dto.practiceContentId ?? "",
    timeSpentSeconds: dto.timeSpentSeconds ?? 0,
    score: dto.score ?? 0,
    correctAnswerCount: dto.correctAnswerCount ?? 0,
    wrongAnswerCount: dto.wrongAnswerCount ?? 0,
    skipAnswerCount: dto.skipAnswerCount ?? 0,
    submittedAt: dto.submittedAt ?? [0, 0, 0, 0, 0, 0, 0],
    isTutorReviewRequested: dto.isTutorReviewRequested ?? false,
  };
}

const initialPracticeSubmission: PracticeSubmission = {
  id: "",
  userId: "",
  practiceContentId: "",
  timeSpentSeconds: 0,
  score: 0,
  correctAnswerCount: 0,
  wrongAnswerCount: 0,
  skipAnswerCount: 0,
  submittedAt: [0, 0, 0, 0, 0, 0, 0],
  isTutorReviewRequested: false,
};

export function useGetPracticeSubmission(submissionId: string) {
  const {
    item: submission,
    setItem: setSubmission,
    loading,
    error,
    get,
  } = useApiGet<PracticeSubmissionDTO, PracticeSubmission>({
    request: {
      apiBase: API_BASE,
      path: `/api/practice-submission/${submissionId}`,
      include: PRACTICE_SUBMISSION_DTO_INCLUDE_FIELDS_QUERY,
    },
    initialItem: initialPracticeSubmission,
    mapItem: mapPracticeSubmissionDTOToPracticeSubmission,
  });

  return {
    submission,
    setSubmission,
    loading,
    error,
    get,
  };
}
