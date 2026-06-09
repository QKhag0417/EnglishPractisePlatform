import { API_BASE } from "../../../env";
import { useApiPost } from "../../../utils/api/useApiPost";
import type {
  CreateWritingCriterionFeedbackRequestBody,
  CreateWritingCriterionFeedbackResponseDTO,
  CreatedWritingCriterionFeedback,
} from "../types";

function mapCreateWritingCriterionFeedbackDTOToItem(
  dto: CreateWritingCriterionFeedbackResponseDTO,
): CreatedWritingCriterionFeedback {
  return {
    id: dto.id ?? "",
  };
}

const initialBody: CreateWritingCriterionFeedbackRequestBody = {
  authorType: "TUTOR",
  criterionName: "TASK_ACHIEVEMENT",
  feedbackType: "STRENGTH",
  label: "FULL_TASK_COVERAGE",
  description: "",
  explanation: "",
  evidenceSentences: [],
  recommendedActionDescription: "",
  recommendedActionExplanation: "",
  userPracticeWritingAnswerId: "",
  reviewedByUserId: "",
};

const initialItem: CreatedWritingCriterionFeedback = {
  id: "",
};

export function usePostCreateWritingCriterionFeedback(
  params?: CreateWritingCriterionFeedbackRequestBody,
) {
  const defaultBody = params ?? initialBody;

  const {
    item: createdWritingCriterionFeedback,
    setItem: setCreatedWritingCriterionFeedback,
    loading,
    error,
    post,
  } = useApiPost<
    CreateWritingCriterionFeedbackResponseDTO,
    CreatedWritingCriterionFeedback,
    CreateWritingCriterionFeedbackRequestBody
  >({
    request: {
      apiBase: API_BASE,
      path: "/api/practice-writing-criterion-feedback",
      body: defaultBody,
    },
    initialItem,
    mapItem: mapCreateWritingCriterionFeedbackDTOToItem,
  });

  return {
    createdWritingCriterionFeedback,
    setCreatedWritingCriterionFeedback,
    loading,
    error,
    post,
  };
}
