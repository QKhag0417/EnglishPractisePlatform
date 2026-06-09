import { API_BASE } from "../../../env";
import { useApiPost } from "../../../utils/api/useApiPost";
import {
  CreateLearnerStudyPlanRequestBody,
  CreateLearnerStudyPlanResponseDTO,
  LearnerStudyPlan,
} from "../types";

function mapCreateLearnerStudyPlanDTOToLearnerStudyPlanResponse(
  dto: CreateLearnerStudyPlanResponseDTO,
): LearnerStudyPlan {
  return {
    id: dto.id ?? "",
  };
}

const initialBody: CreateLearnerStudyPlanRequestBody = {
  learnerId: "",
  skill: "LISTENING",
};

const initialLearnerStudyPlan: LearnerStudyPlan = {
  id: "",
};

export function usePostLearnerStudyPlan(
  params?: CreateLearnerStudyPlanRequestBody,
) {
  const defaultBody = params ?? initialBody;

  const {
    item: learnerStudyPlan,
    setItem: setLearnerStudyPlan,
    loading,
    error,
    post,
  } = useApiPost<
    CreateLearnerStudyPlanResponseDTO,
    LearnerStudyPlan,
    CreateLearnerStudyPlanRequestBody
  >({
    request: {
      apiBase: API_BASE,
      path: "/api/learner-study-plan",
      body: defaultBody,
    },
    initialItem: initialLearnerStudyPlan,
    mapItem: mapCreateLearnerStudyPlanDTOToLearnerStudyPlanResponse,
  });

  return {
    learnerStudyPlan,
    setLearnerStudyPlan,
    loading,
    error,
    post,
  };
}
