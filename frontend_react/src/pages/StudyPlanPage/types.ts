import { BackendTopicTag } from "../ListeningContentEditorPage/types";
import { BackendQuestionType } from "../MyProfilePage/types";

// =========================
// Skill type
// =========================

export type SkillType = "Listening" | "Reading" | "Writing" | "Speaking";
export type BackendSkillType = "LISTENING" | "READING" | "WRITING" | "SPEAKING";

export const mapSkillTypeApiTypeToUi = (type: BackendSkillType): SkillType => {
  switch (type) {
    case "LISTENING":
      return "Listening";
    case "READING":
      return "Reading";
    case "WRITING":
      return "Writing";
    case "SPEAKING":
      return "Speaking";
    default:
      return "Listening";
  }
};

// =========================
// Focus type
// =========================

export type FocusType = "Question Type" | "Topic";
export type BackendFocusType = "QUESTION_TYPE" | "TOPIC";

export const mapFocusTypeApiTypeToUi = (type: BackendFocusType): FocusType => {
  switch (type) {
    case "QUESTION_TYPE":
      return "Question Type";
    case "TOPIC":
      return "Topic";
    default:
      return "Question Type";
  }
};

// =========================
// Direction
// =========================

export type Direction = "INCREASE" | "REDUCE" | "MAINTAIN";
export type BackendDirection = "INCREASE" | "REDUCE" | "MAINTAIN";

export const mapDirectionApiTypeToUi = (type: BackendDirection): Direction => {
  switch (type) {
    case "INCREASE":
      return "INCREASE";
    case "REDUCE":
      return "REDUCE";
    case "MAINTAIN":
      return "MAINTAIN";
    default:
      return "MAINTAIN";
  }
};

// =========================
// Task status
// =========================

export type TaskStatus = "ACTIVE" | "FAILED" | "COMPLETED";
export type BackendTaskStatus = "ACTIVE" | "FAILED" | "COMPLETED";

export const mapTaskStatusApiTypeToUi = (
  type: BackendTaskStatus,
): TaskStatus => {
  switch (type) {
    case "ACTIVE":
      return "ACTIVE";
    case "FAILED":
      return "FAILED";
    case "COMPLETED":
      return "COMPLETED";
    default:
      return "ACTIVE";
  }
};

// =========================
// Strength status
// =========================

export type StrengthStatus = "MAINTAINED" | "IMPROVED" | "WEAKENED";
export type BackendStrengthStatus = "MAINTAINED" | "IMPROVED" | "WEAKENED";

export const mapStrengthStatusApiTypeToUi = (
  type: BackendStrengthStatus,
): StrengthStatus => {
  switch (type) {
    case "MAINTAINED":
      return "MAINTAINED";
    case "IMPROVED":
      return "IMPROVED";
    case "WEAKENED":
      return "WEAKENED";
    default:
      return "MAINTAINED";
  }
};

// =========================
// Weakness status
// =========================

export type WeaknessStatus = "WORSENED" | "CONTINUED" | "IMPROVED";
export type BackendWeaknessStatus = "WORSENED" | "CONTINUED" | "IMPROVED";

export const mapWeaknessStatusApiTypeToUi = (
  type: BackendWeaknessStatus,
): WeaknessStatus => {
  switch (type) {
    case "WORSENED":
      return "WORSENED";
    case "CONTINUED":
      return "CONTINUED";
    case "IMPROVED":
      return "IMPROVED";
    default:
      return "CONTINUED";
  }
};

// =========================
// Target metric
// =========================

export type TargetMetric =
  | "Rolling Correct Answer Percentage"
  | "Rolling Skip Rate"
  | "Rolling Effective Accuracy";
export type BackendTargetMetric =
  | "ROLLING_CORRECT_ANSWER_PERCENTAGE"
  | "ROLLING_SKIP_RATE"
  | "ROLLING_EFFECTIVE_ACCURACY";

export const mapTargetMetricApiTypeToUi = (
  type: BackendTargetMetric,
): TargetMetric => {
  switch (type) {
    case "ROLLING_CORRECT_ANSWER_PERCENTAGE":
      return "Rolling Correct Answer Percentage";
    case "ROLLING_SKIP_RATE":
      return "Rolling Skip Rate";
    case "ROLLING_EFFECTIVE_ACCURACY":
      return "Rolling Effective Accuracy";
    default:
      return "Rolling Correct Answer Percentage";
  }
};

// =========================
// Get Active Study Plan By User Id and Skill
// =========================

export type ActiveStudyPlanParams = {
  userId: string;
  skill: string;
};

export type ActiveStudyPlanTaskDTO = {
  focusType?: BackendFocusType;
  questionType?: BackendQuestionType;
  topicTag?: BackendTopicTag;
  targetMetric?: BackendTargetMetric;
  currentValue?: number;
  targetValue?: number;
  direction?: BackendDirection;
  status?: BackendTaskStatus;
  description?: string;
};

export type ActiveStudyPlanStrengthBlockDTO = {
  focusType?: BackendFocusType;
  questionType?: BackendQuestionType;
  topicTag?: BackendTopicTag;
  description?: string;
  explanation?: string;
  evidence?: string;
  recommendedNextAction?: string;
};

export type ActiveStudyPlanWeaknessBlockDTO = {
  focusType?: BackendFocusType;
  questionType?: BackendQuestionType;
  topicTag?: BackendTopicTag;
  description?: string;
  explanation?: string;
  evidence?: string;
  recommendedNextAction?: string;
};

export type ActiveStudyPlanDTO = {
  id: string;
  submissionCountSinceCreation: number;
  readyToFinalize: boolean;
  tasks: ActiveStudyPlanTaskDTO[];
  strengthBlocks: ActiveStudyPlanStrengthBlockDTO[];
  weaknessBlocks: ActiveStudyPlanWeaknessBlockDTO[];
};

export type ActiveStudyPlanTask = {
  focusType: BackendFocusType;
  questionType: BackendQuestionType;
  topicTag: BackendTopicTag;
  targetMetric: BackendTargetMetric;
  currentValue: number;
  targetValue: number;
  direction: BackendDirection;
  status: BackendTaskStatus;
  description: string;
};

export type ActiveStudyPlanStrengthBlock = {
  focusType: BackendFocusType;
  questionType: BackendQuestionType;
  topicTag: BackendTopicTag;
  description: string;
  explanation: string;
  evidence: string;
  recommendedNextAction: string;
};

export type ActiveStudyPlanWeaknessBlock = {
  focusType: BackendFocusType;
  questionType: BackendQuestionType;
  topicTag: BackendTopicTag;
  description: string;
  explanation: string;
  evidence: string;
  recommendedNextAction: string;
};

export type ActiveStudyPlan = {
  id: string;
  submissionCountSinceCreation: number;
  readyToFinalize: boolean;
  tasks: ActiveStudyPlanTask[];
  strengthBlocks: ActiveStudyPlanStrengthBlock[];
  weaknessBlocks: ActiveStudyPlanWeaknessBlock[];
};

export const ACTIVE_STUDY_PLAN_DTO_INCLUDE_FIELDS = [
  "submissioncountsincecreation",
  "readytofinalize",
  "tasks.focustype",
  "tasks.questiontype",
  "tasks.topictag",
  "tasks.targetmetric",
  "tasks.currentvalue",
  "tasks.targetvalue",
  "tasks.direction",
  "tasks.status",
  "tasks.description",
  "strengthblocks.focustype",
  "strengthblocks.questiontype",
  "strengthblocks.topictag",
  "strengthblocks.description",
  "strengthblocks.explanation",
  "strengthblocks.evidence",
  "strengthblocks.recommendednextaction",
  "weaknessblocks.focustype",
  "weaknessblocks.questiontype",
  "weaknessblocks.topictag",
  "weaknessblocks.description",
  "weaknessblocks.explanation",
  "weaknessblocks.evidence",
  "weaknessblocks.recommendednextaction",
] as const;

export const ACTIVE_STUDY_PLAN_DTO_INCLUDE_FIELDS_QUERY =
  ACTIVE_STUDY_PLAN_DTO_INCLUDE_FIELDS.join(",");

// =========================
// Get Submission Count By User Id
// =========================

export type SubmissionCountBySkillParams = {
  userId: string;
};

export type SubmissionCountBySkillDTO = {
  listeningCount: number;
  readingCount: number;
  writingCount: number;
  speakingCount: number;
};

export type SubmissionCountBySkill = {
  listeningCount: number;
  readingCount: number;
  writingCount: number;
  speakingCount: number;
};

// =========================
// Create Learner Study Plan
// =========================

export type CreateLearnerStudyPlanRequestBody = {
  learnerId: string;
  skill: BackendSkillType;
};

export type CreateLearnerStudyPlanResponseDTO = {
  id: string;
};

export type LearnerStudyPlan = {
  id: string;
};

// =========================
// Get Has Active Study Plan
// =========================

export type HasActiveStudyPlanParams = {
  userId: string;
  skill: BackendSkillType;
};

export type HasActiveStudyPlanDTO = {
  hasActiveStudyPlan: boolean;
};

export type HasActiveStudyPlan = {
  hasActiveStudyPlan: boolean;
};

// =========================
// Update Finalize Study Plan
// =========================

export type FinalizeLearnerStudyPlanByIdParams = {
  studyPlanId: string;
};

export type FinalizeLearnerStudyPlanByIdBody = {};

export type FinalizeLearnerStudyPlanByIdResponseDTO = {
  id?: string;
};

export type FinalizeLearnerStudyPlanByIdResponse = {
  id: string;
};

// =========================
// Update Refresh Study Plan
// =========================

export type UpdateRefreshStudyPlanParams = {
  userId: string;
  skill: string;
};

export type UpdateRefreshStudyPlanResponseDTO = {
  id?: string;
};

export type UpdateRefreshStudyPlanResponse = {
  id: string;
};

// =======================================
// Get Analytics Submission Counts By User
// =======================================

export type AnalyticsSubmissionCountsParams = {
  userId: string;
};

export type AnalyticsSubmissionCountsDTO = {
  listeningCount: number;
  readingCount: number;
  writingCount: number;
  speakingCount: number;
};

export type AnalyticsSubmissionCounts = {
  listeningCount: number;
  readingCount: number;
  writingCount: number;
  speakingCount: number;
};
