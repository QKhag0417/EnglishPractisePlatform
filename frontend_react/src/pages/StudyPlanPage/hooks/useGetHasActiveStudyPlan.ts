import { API_BASE } from "../../../env";
import { useApiGetByParams } from "../../../utils/api";
import {
  BackendSkillType,
  HasActiveStudyPlan,
  HasActiveStudyPlanDTO,
  HasActiveStudyPlanParams,
} from "../types";

function mapHasActiveStudyPlanDTOToHasActiveStudyPlan(
  dto: HasActiveStudyPlanDTO,
): HasActiveStudyPlan {
  return {
    hasActiveStudyPlan: dto.hasActiveStudyPlan ?? false,
  };
}

const initialParams: HasActiveStudyPlanParams = {
  userId: "",
  skill: "LISTENING",
};

const initialHasActiveStudyPlan: HasActiveStudyPlan = {
  hasActiveStudyPlan: false,
};

export function useGetHasActiveStudyPlan(params?: HasActiveStudyPlanParams) {
  const defaultParams = params ?? initialParams;

  const {
    item: hasActiveStudyPlan,
    setItem: setHasActiveStudyPlan,
    loading,
    error,
    get,
  } = useApiGetByParams<
    HasActiveStudyPlanDTO,
    HasActiveStudyPlan,
    HasActiveStudyPlanParams
  >({
    buildRequest: (requestParams) => {
      const resolvedParams = requestParams ?? defaultParams;
      const userId = resolvedParams.userId ?? "";
      const skill = resolvedParams.skill ?? "LISTENING";

      return {
        apiBase: API_BASE,
        path: `/api/learner-study-plan/user/${userId}/skill/${skill}/active/check`,
      };
    },
    initialItem: initialHasActiveStudyPlan,
    mapItem: mapHasActiveStudyPlanDTOToHasActiveStudyPlan,
  });

  return {
    hasActiveStudyPlan,
    setHasActiveStudyPlan,
    loading,
    error,
    get,
  };
}
