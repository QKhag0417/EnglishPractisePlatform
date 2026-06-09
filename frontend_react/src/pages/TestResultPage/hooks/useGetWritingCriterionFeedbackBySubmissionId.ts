import { API_BASE } from "../../../env";
import { useApiGetByParams } from "../../../utils/api";
import {
  WritingCriterionFeedbackBySubmissionItem,
  WritingCriterionFeedbackBySubmissionItemDTO,
  WritingCriterionFeedbackBySubmissionParams,
  WRITING_CRITERION_FEEDBACK_BY_SUBMISSION_DTO_INCLUDE_FIELDS_QUERY,
} from "../types";

function mapWritingCriterionFeedbackBySubmissionItemDTO(
  dto: WritingCriterionFeedbackBySubmissionItemDTO,
): WritingCriterionFeedbackBySubmissionItem {
  return {
    id: dto.id ?? "",
    authorType: dto.authorType ?? "TUTOR",
    criterionName: dto.criterionName ?? "TASK_ACHIEVEMENT",
    feedbackType: dto.feedbackType ?? "STRENGTH",
    label: dto.label ?? "FULL_TASK_COVERAGE",
    description: dto.description ?? "",
    explanation: dto.explanation ?? "",
    evidenceSentences: dto.evidenceSentences ?? [],
    recommendedActionDescription: dto.recommendedActionDescription ?? "",
    recommendedActionExplanation: dto.recommendedActionExplanation ?? "",
    reviewedByUser: {
      userId: dto.reviewedByUser?.userId ?? "",
      email: dto.reviewedByUser?.email ?? "",
      firstname: dto.reviewedByUser?.firstname ?? "",
      lastname: dto.reviewedByUser?.lastname ?? "",
    },
  };
}

function mapWritingCriterionFeedbackBySubmissionDTOToItems(
  dto: WritingCriterionFeedbackBySubmissionItemDTO[],
): WritingCriterionFeedbackBySubmissionItem[] {
  return (dto ?? []).map(mapWritingCriterionFeedbackBySubmissionItemDTO);
}

const initialParams: WritingCriterionFeedbackBySubmissionParams = {
  submissionId: "",
};

const initialWritingCriterionFeedbacks: WritingCriterionFeedbackBySubmissionItem[] =
  [];

export function useGetWritingCriterionFeedbackBySubmissionId(
  params?: WritingCriterionFeedbackBySubmissionParams,
) {
  const defaultParams = params ?? initialParams;

  const {
    item: writingCriterionFeedbacks,
    setItem: setWritingCriterionFeedbacks,
    loading,
    error,
    get,
  } = useApiGetByParams<
    WritingCriterionFeedbackBySubmissionItemDTO[],
    WritingCriterionFeedbackBySubmissionItem[],
    WritingCriterionFeedbackBySubmissionParams
  >({
    buildRequest: (requestParams) => {
      const resolvedParams = requestParams ?? defaultParams;
      const submissionId = resolvedParams.submissionId ?? "";

      return {
        apiBase: API_BASE,
        path: `/api/practice-writing-criterion-feedback/submission/${submissionId}`,
        include:
          WRITING_CRITERION_FEEDBACK_BY_SUBMISSION_DTO_INCLUDE_FIELDS_QUERY,
      };
    },
    initialItem: initialWritingCriterionFeedbacks,
    mapItem: mapWritingCriterionFeedbackBySubmissionDTOToItems,
  });

  return {
    writingCriterionFeedbacks,
    setWritingCriterionFeedbacks,
    loading,
    error,
    get,
  };
}
