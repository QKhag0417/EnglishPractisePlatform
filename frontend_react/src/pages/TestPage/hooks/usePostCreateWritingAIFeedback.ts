import { API_BASE } from "../../../env";
import { useApiPost } from "../../../utils/api/useApiPost";
import {
  CreateWritingAIFeedbackRequestBody,
  CreateWritingAIFeedbackResponseDTO,
  CreateWritingAIFeedback,
} from "../types";

function mapCreateWritingAIFeedbackDTOToCreateWritingAIFeedback(
  dto: CreateWritingAIFeedbackResponseDTO,
): CreateWritingAIFeedback {
  return {
    submissionId: dto.data ?? "",
  };
}

const initialBody: CreateWritingAIFeedbackRequestBody = {
  submissionId: "",
};

const initialCreateWritingAIFeedback: CreateWritingAIFeedback = {
  submissionId: "",
};

export function usePostCreateWritingAIFeedback(
  params?: CreateWritingAIFeedbackRequestBody,
) {
  const defaultBody = params ?? initialBody;

  const {
    item: createWritingAIFeedback,
    setItem: setCreateWritingAIFeedback,
    loading,
    error,
    post,
  } = useApiPost<
    CreateWritingAIFeedbackResponseDTO,
    CreateWritingAIFeedback,
    CreateWritingAIFeedbackRequestBody
  >({
    request: {
      apiBase: API_BASE,
      path: "/api/writing-submissions/ai-feedback",
      body: defaultBody,
    },
    initialItem: initialCreateWritingAIFeedback,
    mapItem: mapCreateWritingAIFeedbackDTOToCreateWritingAIFeedback,
  });

  return {
    createWritingAIFeedback,
    setCreateWritingAIFeedback,
    loading,
    error,
    post,
  };
}
