import { API_BASE } from "../../../env";
import { useApiPutByParams } from "../../../utils/api";
import {
  UpdateWritingCriterionFeedbackByIdBody,
  UpdateWritingCriterionFeedbackByIdParams,
  UpdateWritingCriterionFeedbackByIdResponseDTO,
  UpdateWritingCriterionFeedbackByIdResponse,
} from "../types";

const initialParams: UpdateWritingCriterionFeedbackByIdParams = {
  writingCriterionFeedbackId: "",
};

const initialBody: UpdateWritingCriterionFeedbackByIdBody = {
  label: "FULL_TASK_COVERAGE",
  description: "",
  explanation: "",
  evidenceSentences: [],
  recommendedActionDescription: "",
  recommendedActionExplanation: "",
};

const initialWritingCriterionFeedback: UpdateWritingCriterionFeedbackByIdResponse =
  {
    id: "",
  };

function mapUpdateWritingCriterionFeedbackByIdDTOToItem(
  dto: UpdateWritingCriterionFeedbackByIdResponseDTO,
): UpdateWritingCriterionFeedbackByIdResponse {
  return {
    id: dto.id ?? "",
  };
}

export function usePutWritingCriterionFeedbackById(
  params?: UpdateWritingCriterionFeedbackByIdParams,
  body?: UpdateWritingCriterionFeedbackByIdBody,
) {
  const defaultParams = params ?? initialParams;
  const defaultBody = body ?? initialBody;

  const {
    item: updatedWritingCriterionFeedback,
    setItem: setUpdatedWritingCriterionFeedback,
    loading,
    error,
    put,
  } = useApiPutByParams<
    UpdateWritingCriterionFeedbackByIdResponseDTO,
    UpdateWritingCriterionFeedbackByIdResponse,
    UpdateWritingCriterionFeedbackByIdParams,
    UpdateWritingCriterionFeedbackByIdBody
  >({
    buildRequest: (requestParams) => {
      const resolvedParams = requestParams ?? defaultParams;

      return {
        apiBase: API_BASE,
        path: `/api/practice-writing-criterion-feedback/${resolvedParams.writingCriterionFeedbackId}`,
        body: defaultBody,
      };
    },
    initialItem: initialWritingCriterionFeedback,
    mapItem: mapUpdateWritingCriterionFeedbackByIdDTOToItem,
  });

  return {
    updatedWritingCriterionFeedback,
    setUpdatedWritingCriterionFeedback,
    loading,
    error,
    put,
  };
}
