import { API_BASE } from "../../../env";
import { useApiPost } from "../../../utils/api/useApiPost";
import type {
  CreateSubmissionFeedbackRequestBody,
  CreateSubmissionFeedbackResponseDTO,
  CreatedSubmissionFeedback,
} from "../types";

function mapCreateSubmissionFeedbackDTOToCreatedSubmissionFeedback(
  dto: CreateSubmissionFeedbackResponseDTO,
): CreatedSubmissionFeedback {
  return {
    id: dto.id ?? "",
  };
}

const initialBody: CreateSubmissionFeedbackRequestBody = {
  submissionId: "",
  authorId: "",
  authorType: "TUTOR",
  feedbackContent: "",
};

const initialCreatedSubmissionFeedback: CreatedSubmissionFeedback = {
  id: "",
};

export function usePostSubmissionFeedback(
  params?: CreateSubmissionFeedbackRequestBody,
) {
  const defaultBody = params ?? initialBody;

  const {
    item: createdSubmissionFeedback,
    setItem: setCreatedSubmissionFeedback,
    loading,
    error,
    post,
  } = useApiPost<
    CreateSubmissionFeedbackResponseDTO,
    CreatedSubmissionFeedback,
    CreateSubmissionFeedbackRequestBody
  >({
    request: {
      apiBase: API_BASE,
      path: "/api/submission-feedback",
      body: defaultBody,
    },
    initialItem: initialCreatedSubmissionFeedback,
    mapItem: mapCreateSubmissionFeedbackDTOToCreatedSubmissionFeedback,
  });

  return {
    createdSubmissionFeedback,
    setCreatedSubmissionFeedback,
    loading,
    error,
    post,
  };
}
