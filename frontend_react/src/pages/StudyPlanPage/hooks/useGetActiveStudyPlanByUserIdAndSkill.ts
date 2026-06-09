import { API_BASE } from "../../../env";
import { useApiGetByParams } from "../../../utils/api";
import {
  ActiveStudyPlan,
  ActiveStudyPlanDTO,
  ActiveStudyPlanParams,
  ACTIVE_STUDY_PLAN_DTO_INCLUDE_FIELDS_QUERY,
} from "../types";

function mapActiveStudyPlanTaskDTOToActiveStudyPlanTask(
  dto: ActiveStudyPlanDTO["tasks"][number],
): ActiveStudyPlan["tasks"][number] {
  return {
    focusType: dto.focusType ?? "QUESTION_TYPE",
    questionType: dto.questionType ?? "MULTIPLE_CHOICE",
    topicTag: dto.topicTag ?? "EDUCATION_AND_LEARNING",
    targetMetric: dto.targetMetric ?? "ROLLING_CORRECT_ANSWER_PERCENTAGE",
    currentValue: dto.currentValue ?? 0,
    targetValue: dto.targetValue ?? 0,
    direction: dto.direction ?? "INCREASE",
    status: dto.status ?? "ACTIVE",
    description: dto.description ?? "",
  };
}

function mapActiveStudyPlanStrengthBlockDTOToActiveStudyPlanStrengthBlock(
  dto: ActiveStudyPlanDTO["strengthBlocks"][number],
): ActiveStudyPlan["strengthBlocks"][number] {
  return {
    focusType: dto.focusType ?? "QUESTION_TYPE",
    questionType: dto.questionType ?? "MULTIPLE_CHOICE",
    topicTag: dto.topicTag ?? "EDUCATION_AND_LEARNING",
    description: dto.description ?? "",
    explanation: dto.explanation ?? "",
    evidence: dto.evidence ?? "",
    recommendedNextAction: dto.recommendedNextAction ?? "",
  };
}

function mapActiveStudyPlanWeaknessBlockDTOToActiveStudyPlanWeaknessBlock(
  dto: ActiveStudyPlanDTO["weaknessBlocks"][number],
): ActiveStudyPlan["weaknessBlocks"][number] {
  return {
    focusType: dto.focusType ?? "QUESTION_TYPE",
    questionType: dto.questionType ?? "MULTIPLE_CHOICE",
    topicTag: dto.topicTag ?? "EDUCATION_AND_LEARNING",
    description: dto.description ?? "",
    explanation: dto.explanation ?? "",
    evidence: dto.evidence ?? "",
    recommendedNextAction: dto.recommendedNextAction ?? "",
  };
}

function mapActiveStudyPlanDTOToActiveStudyPlan(
  dto: ActiveStudyPlanDTO,
): ActiveStudyPlan {
  return {
    id: dto.id ?? "",
    submissionCountSinceCreation: dto.submissionCountSinceCreation ?? 0,
    readyToFinalize: dto.readyToFinalize ?? false,
    tasks: (dto.tasks ?? []).map(
      mapActiveStudyPlanTaskDTOToActiveStudyPlanTask,
    ),
    strengthBlocks: (dto.strengthBlocks ?? []).map(
      mapActiveStudyPlanStrengthBlockDTOToActiveStudyPlanStrengthBlock,
    ),
    weaknessBlocks: (dto.weaknessBlocks ?? []).map(
      mapActiveStudyPlanWeaknessBlockDTOToActiveStudyPlanWeaknessBlock,
    ),
  };
}

const initialParams: ActiveStudyPlanParams = {
  userId: "",
  skill: "",
};

const initialActiveStudyPlan: ActiveStudyPlan = {
  id: "",
  submissionCountSinceCreation: 0,
  readyToFinalize: false,
  tasks: [],
  strengthBlocks: [],
  weaknessBlocks: [],
};

export function useGetActiveStudyPlanByUserIdAndSkill(
  params?: ActiveStudyPlanParams,
) {
  const defaultParams = params ?? initialParams;

  const {
    item: activeStudyPlan,
    setItem: setActiveStudyPlan,
    loading,
    error,
    get,
  } = useApiGetByParams<
    ActiveStudyPlanDTO,
    ActiveStudyPlan,
    ActiveStudyPlanParams
  >({
    buildRequest: (requestParams) => {
      const resolvedParams = requestParams ?? defaultParams;
      const userId = resolvedParams.userId ?? "";
      const skill = resolvedParams.skill ?? "";

      return {
        apiBase: API_BASE,
        path: `/api/learner-study-plan/user/${userId}/skill/${skill}/active`,
        include: ACTIVE_STUDY_PLAN_DTO_INCLUDE_FIELDS_QUERY,
      };
    },
    initialItem: initialActiveStudyPlan,
    mapItem: mapActiveStudyPlanDTOToActiveStudyPlan,
  });

  return {
    activeStudyPlan,
    setActiveStudyPlan,
    loading,
    error,
    get,
  };
}
