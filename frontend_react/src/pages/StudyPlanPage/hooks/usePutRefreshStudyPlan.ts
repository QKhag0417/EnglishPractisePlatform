import { API_BASE } from "../../../env";
import { useApiPutByParams } from "../../../utils/api";
import {
  UpdateRefreshStudyPlanParams,
  UpdateRefreshStudyPlanResponseDTO,
  UpdateRefreshStudyPlanResponse,
} from "../types";

const initialParams: UpdateRefreshStudyPlanParams = {
  userId: "",
  skill: "",
};

const initialRefreshStudyPlan: UpdateRefreshStudyPlanResponse = {
  id: "",
};

function mapUpdateRefreshStudyPlanDTOToRefreshStudyPlan(
  dto: UpdateRefreshStudyPlanResponseDTO,
): UpdateRefreshStudyPlanResponse {
  return {
    id: dto.id ?? "",
  };
}

export function usePutRefreshStudyPlan(params?: UpdateRefreshStudyPlanParams) {
  const defaultParams = params ?? initialParams;

  const {
    item: refreshStudyPlan,
    setItem: setRefreshStudyPlan,
    loading,
    error,
    put,
  } = useApiPutByParams<
    UpdateRefreshStudyPlanResponseDTO,
    UpdateRefreshStudyPlanResponse,
    UpdateRefreshStudyPlanParams,
    undefined
  >({
    buildRequest: (requestParams) => {
      const resolvedParams = requestParams ?? defaultParams;

      return {
        apiBase: API_BASE,
        path: `/api/learner-study-plan/user/${resolvedParams.userId}/skill/${resolvedParams.skill}/refresh`,
      };
    },
    initialItem: initialRefreshStudyPlan,
    mapItem: mapUpdateRefreshStudyPlanDTOToRefreshStudyPlan,
  });

  return {
    refreshStudyPlan,
    setRefreshStudyPlan,
    loading,
    error,
    put,
  };
}
