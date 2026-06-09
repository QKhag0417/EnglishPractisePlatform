import { API_BASE } from "../../../env";
import { useApiPutByParams } from "../../../utils/api";
import {
  FinalizeLearnerStudyPlanByIdBody,
  FinalizeLearnerStudyPlanByIdParams,
  FinalizeLearnerStudyPlanByIdResponseDTO,
  FinalizeLearnerStudyPlanByIdResponse,
} from "../types";

const initialParams: FinalizeLearnerStudyPlanByIdParams = {
  studyPlanId: "",
};

const initialBody: FinalizeLearnerStudyPlanByIdBody = {};

const initialStudyPlan: FinalizeLearnerStudyPlanByIdResponse = {
  id: "",
};

function mapFinalizeLearnerStudyPlanByIdDTOToResponse(
  dto: FinalizeLearnerStudyPlanByIdResponseDTO,
): FinalizeLearnerStudyPlanByIdResponse {
  return {
    id: dto.id ?? "",
  };
}

export function usePutFinalizeLearnerStudyPlanById(
  params?: FinalizeLearnerStudyPlanByIdParams,
  body?: FinalizeLearnerStudyPlanByIdBody,
) {
  const defaultParams = params ?? initialParams;
  const defaultBody = body ?? initialBody;

  const {
    item: finalizedStudyPlan,
    setItem: setFinalizedStudyPlan,
    loading,
    error,
    put,
  } = useApiPutByParams<
    FinalizeLearnerStudyPlanByIdResponseDTO,
    FinalizeLearnerStudyPlanByIdResponse,
    FinalizeLearnerStudyPlanByIdParams,
    FinalizeLearnerStudyPlanByIdBody
  >({
    buildRequest: (requestParams) => {
      const resolvedParams = requestParams ?? defaultParams;

      return {
        apiBase: API_BASE,
        path: `/api/learner-study-plan/${resolvedParams.studyPlanId}/finalize`,
        body: defaultBody,
      };
    },
    initialItem: initialStudyPlan,
    mapItem: mapFinalizeLearnerStudyPlanByIdDTOToResponse,
  });

  return {
    finalizedStudyPlan,
    setFinalizedStudyPlan,
    loading,
    error,
    put,
  };
}
