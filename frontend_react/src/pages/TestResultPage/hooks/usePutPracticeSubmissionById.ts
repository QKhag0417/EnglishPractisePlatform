import { API_BASE } from "../../../env";
import { useApiPutByParams } from "../../../utils/api";
import {
  UpdatePracticeSubmissionByIdBody,
  UpdatePracticeSubmissionByIdParams,
  UpdatePracticeSubmissionByIdResponseDTO,
  UpdatePracticeSubmissionByIdResponse,
} from "../types";

const initialParams: UpdatePracticeSubmissionByIdParams = {
  practiceSubmissionId: "",
};

const initialBody: UpdatePracticeSubmissionByIdBody = {
  isTutorReviewRequested: false,
};

const initialPracticeSubmission: UpdatePracticeSubmissionByIdResponse = {
  id: "",
};

function mapUpdatePracticeSubmissionByIdDTOToPracticeSubmission(
  dto: UpdatePracticeSubmissionByIdResponseDTO,
): UpdatePracticeSubmissionByIdResponse {
  return {
    id: dto.id ?? "",
  };
}

export function usePutPracticeSubmissionById(
  params?: UpdatePracticeSubmissionByIdParams,
  body?: UpdatePracticeSubmissionByIdBody,
) {
  const defaultParams = params ?? initialParams;
  const defaultBody = body ?? initialBody;

  const {
    item: practiceSubmission,
    setItem: setPracticeSubmission,
    loading,
    error,
    put,
  } = useApiPutByParams<
    UpdatePracticeSubmissionByIdResponseDTO,
    UpdatePracticeSubmissionByIdResponse,
    UpdatePracticeSubmissionByIdParams,
    UpdatePracticeSubmissionByIdBody
  >({
    buildRequest: (requestParams) => {
      const resolvedParams = requestParams ?? defaultParams;

      return {
        apiBase: API_BASE,
        path: `/api/practice-submission/${resolvedParams.practiceSubmissionId}`,
        body: defaultBody,
      };
    },
    initialItem: initialPracticeSubmission,
    mapItem: mapUpdatePracticeSubmissionByIdDTOToPracticeSubmission,
  });

  return {
    practiceSubmission,
    setPracticeSubmission,
    loading,
    error,
    put,
  };
}
