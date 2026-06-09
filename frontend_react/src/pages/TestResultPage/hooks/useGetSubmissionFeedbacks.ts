// src/features/submission-feedback/hooks/useGetSubmissionFeedbacks.ts
import { API_BASE } from "../../../env";
import { useApiGet } from "../../../utils/api/useApiGet";
import {
  SubmissionFeedbackDTO,
  SubmissionFeedback,
  SUBMISSION_FEEDBACK_DTO_INCLUDE_FIELDS_QUERY,
} from "../types";

function mapSubmissionFeedbackDTOsToSubmissionFeedbacks(
  dtos: SubmissionFeedbackDTO[],
): SubmissionFeedback[] {
  return (dtos ?? []).map((dto) => ({
    id: dto.id ?? "",
    feedbackContent: dto.feedbackContent ?? "",
    updatedAt: dto.updatedAt ?? [],
    author: {
      firstname: dto.author?.firstname ?? "",
      lastname: dto.author?.lastname ?? "",
      avatarUrl: dto.author?.avatarUrl ?? "",
    },
  }));
}

const initialSubmissionFeedbacks: SubmissionFeedbackDTO[] = [];

export function useGetSubmissionFeedbacks(submissionId: string) {
  const {
    item: feedbacks,
    setItem: setFeedbacks,
    loading,
    error,
    get,
  } = useApiGet<SubmissionFeedbackDTO[], SubmissionFeedback[]>({
    request: {
      apiBase: API_BASE,
      path: `/api/submission-feedback/submission/${submissionId}`,
      include: SUBMISSION_FEEDBACK_DTO_INCLUDE_FIELDS_QUERY,
    },
    initialItem: initialSubmissionFeedbacks,
    mapItem: mapSubmissionFeedbackDTOsToSubmissionFeedbacks,
  });

  return {
    feedbacks,
    setFeedbacks,
    loading,
    error,
    get,
  };
}
