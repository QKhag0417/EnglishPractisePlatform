import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  RefreshCw,
  Target,
} from "lucide-react";
import { NavBarUnified } from "../../components/NavBarUnified";
import { useEffect, useState } from "react";
import { Footer } from "../../components/Footer";
import {
  ActiveStudyPlan,
  BackendSkillType,
  mapDirectionApiTypeToUi,
  mapFocusTypeApiTypeToUi,
  mapSkillTypeApiTypeToUi,
  mapTargetMetricApiTypeToUi,
  mapTaskStatusApiTypeToUi,
} from "./types";
import { getDirectionIcon, getTaskStatusColor } from "./utils";
import {
  useGetActiveStudyPlanByUserIdAndSkill,
  useGetAnalyticsSubmissionCountsByUserId,
  useGetHasActiveStudyPlan,
  usePostLearnerStudyPlan,
  usePutFinalizeLearnerStudyPlanById,
  usePutRefreshStudyPlan,
} from "./hooks";
import { useAuth } from "../../contexts/AuthContext";
import { mapTopicTagApiToUi } from "../ListeningContentEditorPage/types";
import { mapQuestionApiTypeToUi } from "../MyProfilePage/types";

const MIN_SUBMISSIONS_REQUIRED_FOR_STUDY_PLAN = 5;
const MIN_SUBMISSIONS_SINCE_CREATION_REQUIRED = 5;
const MIN_TASK_COMPLETION_PERCENTAGE = 75;

export default function StudyPlanPage() {
  // =========================
  // Auth
  // =========================

  const { user } = useAuth();

  const userId = user?.id;

  // =========================
  // Selected skill state
  // =========================

  const [selectedSkill, setSelectedSkill] =
    useState<BackendSkillType>("LISTENING");

  const skills: BackendSkillType[] = [
    "LISTENING",
    "READING",
    "WRITING",
    "SPEAKING",
  ];

  // =========================
  // Get submission count by skill for user
  // =========================

  const getAnalyticsSubmissionCountsByUserId =
    useGetAnalyticsSubmissionCountsByUserId();

  useEffect(() => {
    if (!userId) return;

    void getAnalyticsSubmissionCountsByUserId.get({
      userId,
    });
  }, [userId]);

  // =========================
  // Study plan enablement logic by skill
  // =========================

  const submissionsBySkill: Record<BackendSkillType, number> = {
    LISTENING:
      getAnalyticsSubmissionCountsByUserId.analyticsSubmissionCounts
        .listeningCount ?? 0,
    READING:
      getAnalyticsSubmissionCountsByUserId.analyticsSubmissionCounts
        .readingCount ?? 0,
    WRITING:
      getAnalyticsSubmissionCountsByUserId.analyticsSubmissionCounts
        .writingCount ?? 0,
    SPEAKING:
      getAnalyticsSubmissionCountsByUserId.analyticsSubmissionCounts
        .speakingCount ?? 0,
  };

  const minSubmissionsRequiredBySkill: Record<BackendSkillType, number> = {
    LISTENING: MIN_SUBMISSIONS_REQUIRED_FOR_STUDY_PLAN,
    READING: MIN_SUBMISSIONS_REQUIRED_FOR_STUDY_PLAN,
    WRITING: MIN_SUBMISSIONS_REQUIRED_FOR_STUDY_PLAN,
    SPEAKING: MIN_SUBMISSIONS_REQUIRED_FOR_STUDY_PLAN,
  };

  const totalSubmissions = submissionsBySkill[selectedSkill];
  const minSubmissionsRequired = minSubmissionsRequiredBySkill[selectedSkill];

  const canEnableStudyPlan = totalSubmissions >= minSubmissionsRequired;

  // =========================
  // Get has active study plan by user id and skill
  // =========================

  const getHasActiveStudyPlan = useGetHasActiveStudyPlan();

  const [studyPlanEnabled, setStudyPlanEnabled] = useState(false);

  // =========================
  // Get active study plan data
  // =========================

  const [activeStudyPlanBySkill, setActiveStudyPlanBySkill] = useState<
    Partial<Record<BackendSkillType, ActiveStudyPlan>>
  >({});

  const getActiveStudyPlanByUserIdAndSkill =
    useGetActiveStudyPlanByUserIdAndSkill();

  useEffect(() => {
    if (!userId || !selectedSkill) return;

    const loadStudyPlan = async () => {
      const hasActivePlanResult = await getHasActiveStudyPlan.get({
        userId,
        skill: selectedSkill,
      });

      const hasActivePlan = hasActivePlanResult?.hasActiveStudyPlan ?? false;

      setStudyPlanEnabled(hasActivePlan);

      if (!hasActivePlan) {
        return;
      }

      const activePlanResult = await getActiveStudyPlanByUserIdAndSkill.get({
        userId,
        skill: selectedSkill,
      });

      setActiveStudyPlanBySkill((prev) => ({
        ...prev,
        [selectedSkill]: activePlanResult,
      }));
    };

    void loadStudyPlan();
  }, [userId, selectedSkill]);

  const activeStudyPlan = activeStudyPlanBySkill[selectedSkill];
  const activeStudyPlanTasks = activeStudyPlan?.tasks ?? [];
  const activeStudyPlanStrengths = activeStudyPlan?.strengthBlocks ?? [];
  const activeStudyPlanWeaknesses = activeStudyPlan?.weaknessBlocks ?? [];

  const submissionCountSinceCreation =
    activeStudyPlan?.submissionCountSinceCreation ?? 0;

  const canFinalizeStudyPlan = activeStudyPlan?.readyToFinalize ?? false;

  // =========================
  // Task completion percentage
  // =========================

  const totalTaskCount = activeStudyPlanTasks.length;

  const completedTaskCount = activeStudyPlanTasks.filter(
    (task) => task.status === "COMPLETED",
  ).length;

  const rawTaskCompletionPercentage =
    totalTaskCount > 0 ? (completedTaskCount / totalTaskCount) * 100 : 0;

  const taskCompletionPercentage = Math.round(rawTaskCompletionPercentage);

  // =========================
  // Post learner study plan
  // =========================

  const postLearnerStudyPlan = usePostLearnerStudyPlan();

  // =========================
  // Handle enabling study plan
  // =========================

  const handleEnableStudyPlan = async () => {
    if (!userId || !selectedSkill) return;

    await postLearnerStudyPlan.post({
      learnerId: userId,
      skill: selectedSkill,
    });

    const hasActiveStudyPlanResult = await getHasActiveStudyPlan.get({
      userId,
      skill: selectedSkill,
    });

    const hasActiveStudyPlan =
      hasActiveStudyPlanResult?.hasActiveStudyPlan ?? false;

    setStudyPlanEnabled(hasActiveStudyPlan);

    if (!hasActiveStudyPlan) {
      return;
    }

    const result = await getActiveStudyPlanByUserIdAndSkill.get({
      userId,
      skill: selectedSkill,
    });

    setActiveStudyPlanBySkill((prev) => ({
      ...prev,
      [selectedSkill]: result,
    }));
  };

  // =========================
  // Put finalize learner study plan
  // =========================

  const putRefreshStudyPlan = usePutRefreshStudyPlan();

  // =========================
  // Handle refreshing study plan
  // =========================

  const handleRefreshStudyPlanStatus = async () => {
    if (!userId || !selectedSkill) return;

    await putRefreshStudyPlan.put({
      userId,
      skill: selectedSkill,
    });

    const activePlanResult = await getActiveStudyPlanByUserIdAndSkill.get({
      userId,
      skill: selectedSkill,
    });

    setActiveStudyPlanBySkill((prev) => ({
      ...prev,
      [selectedSkill]: activePlanResult,
    }));
  };

  // =========================
  // Put finalize learner study plan
  // =========================

  const putFinalizeLearnerStudyPlanById = usePutFinalizeLearnerStudyPlanById();

  // =========================
  // Handle finalizing study plan
  // =========================

  const handleFinalizeStudyPlan = async () => {
    if (!userId || !selectedSkill || !activeStudyPlan?.id) return;

    await putFinalizeLearnerStudyPlanById.put({
      studyPlanId: activeStudyPlan.id,
    });

    const hasActiveStudyPlanResult = await getHasActiveStudyPlan.get({
      userId,
      skill: selectedSkill,
    });

    const hasActiveStudyPlan =
      hasActiveStudyPlanResult?.hasActiveStudyPlan ?? false;

    setStudyPlanEnabled(hasActiveStudyPlan);
  };

  return (
    <div className="bg-white min-h-screen">
      <NavBarUnified />

      <div className="min-h-screen bg-gray-50 pt-[66px]">
        <div className="max-w-[1400px] mx-auto px-[24px] py-[32px]">
          {/* Page Header */}
          <div className="mb-[32px]">
            <div className="flex items-center justify-between mb-[8px]">
              <div className="flex items-center gap-[12px]">
                <BookOpen className="w-[32px] h-[32px] text-[#1977f3]" />
                <h1 className="font-['Inter'] font-bold text-[32px] text-gray-900">
                  My Study Plan
                </h1>{" "}
              </div>

              {/* Enable Study Plan Button */}
              {!studyPlanEnabled && (
                <div className="flex items-center gap-[12px]">
                  <button
                    onClick={handleEnableStudyPlan}
                    disabled={!canEnableStudyPlan}
                    className={`px-[20px] py-[10px] rounded-[8px] font-['Inter'] text-[14px] font-semibold transition-all ${
                      canEnableStudyPlan
                        ? "bg-[#1977f3] text-white hover:bg-[#1567d3] shadow-md"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Enable Study Plan
                  </button>
                </div>
              )}

              {/* Finalize Study Plan Button */}
              {studyPlanEnabled && (
                <div className="flex items-center gap-[12px]">
                  <button
                    onClick={handleFinalizeStudyPlan}
                    disabled={!canFinalizeStudyPlan}
                    className={`px-[20px] py-[10px] rounded-[8px] font-['Inter'] text-[14px] font-semibold transition-all ${
                      canFinalizeStudyPlan
                        ? "bg-green-600 text-white hover:bg-green-700 shadow-md"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Finalize Study Plan
                  </button>
                </div>
              )}
            </div>
            <p className="font-['Inter'] text-[16px] text-gray-600">
              Personalized learning path based on your performance analysis
            </p>
          </div>

          {/* Skill Selector */}
          <div className="bg-white rounded-[12px] p-[24px] shadow-sm border border-gray-200 mb-[24px]">
            <div className="grid grid-cols-4 gap-[16px]">
              {skills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => setSelectedSkill(skill)}
                  className={`px-[24px] py-[16px] rounded-[8px] font-['Inter'] text-[16px] font-semibold transition-all ${
                    selectedSkill === skill
                      ? "bg-[#1977f3] text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {mapSkillTypeApiTypeToUi(skill)}
                </button>
              ))}
            </div>
          </div>

          {/* Requirements Banner */}
          {!studyPlanEnabled && !canEnableStudyPlan && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-[12px] p-[24px] mb-[24px]">
              <div className="flex items-start gap-[16px]">
                <div className="w-[48px] h-[48px] rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-[24px] h-[24px] text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-['Inter'] font-semibold text-[18px] text-gray-900 mb-[8px]">
                    Complete More {mapSkillTypeApiTypeToUi(selectedSkill)}{" "}
                    Submissions to Enable Your Study Plan{" "}
                  </h3>
                  <p className="font-['Inter'] text-[14px] text-gray-700 mb-[12px]">
                    You need at least{" "}
                    <strong>{minSubmissionsRequired} submissions</strong> to
                    enable your personalized study plan. You currently have{" "}
                    <strong>
                      {totalSubmissions} submission
                      {totalSubmissions !== 1 ? "s" : ""}
                    </strong>
                    .
                  </p>
                  <div className="flex items-center gap-[16px]">
                    <div className="flex-1 bg-gray-200 rounded-full h-[8px] overflow-hidden">
                      <div
                        className="bg-[#1977f3] h-full transition-all duration-300"
                        style={{
                          width: `${Math.min((totalSubmissions / minSubmissionsRequired) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                    <span className="font-['Inter'] text-[14px] text-gray-600 whitespace-nowrap">
                      {totalSubmissions}/{minSubmissionsRequired}
                    </span>
                  </div>
                  <p className="font-['Inter'] text-[13px] text-gray-600 mt-[12px]">
                    Complete {minSubmissionsRequired - totalSubmissions} more{" "}
                    {minSubmissionsRequired - totalSubmissions === 1
                      ? "submission"
                      : "submissions"}{" "}
                    to unlock your personalized study plan with AI-powered
                    insights.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Info Box when study plan is not enabled but requirements are met */}
          {!studyPlanEnabled && canEnableStudyPlan && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-[12px] p-[32px] text-center">
              <div className="w-[64px] h-[64px] rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-[16px]">
                <Target className="w-[32px] h-[32px] text-[#1977f3]" />
              </div>
              <h3 className="font-['Inter'] font-semibold text-[24px] text-gray-900 mb-[12px]">
                Ready to Enable Your {mapSkillTypeApiTypeToUi(selectedSkill)}{" "}
                Study Plan!{" "}
              </h3>
              <p className="font-['Inter'] text-[16px] text-gray-700 mb-[8px] max-w-[600px] mx-auto">
                You've completed <strong>{totalSubmissions} submissions</strong>{" "}
                — you're ready to unlock your personalized study plan!
              </p>
              <p className="font-['Inter'] text-[14px] text-gray-600 mb-[24px] max-w-[600px] mx-auto">
                Click the "Enable Study Plan" button in the top right corner to
                get AI-powered insights on your strengths, weaknesses, and
                personalized learning tasks.
              </p>
              <div className="flex items-center justify-center gap-[8px] text-green-700">
                <CheckCircle className="w-[20px] h-[20px]" />
                <span className="font-['Inter'] text-[14px] font-medium">
                  Requirements met ({totalSubmissions}/{minSubmissionsRequired}{" "}
                  submissions)
                </span>
              </div>
            </div>
          )}

          {/* Finalization Requirements Banner - Show when study plan is enabled but not finalized */}
          {studyPlanEnabled && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-[12px] p-[24px] mb-[24px]">
              <div className="flex items-start gap-[16px]">
                <div className="w-[48px] h-[48px] rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Target className="w-[24px] h-[24px] text-[#1977f3]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-[16px] mb-[8px]">
                    <h3 className="font-['Inter'] font-semibold text-[18px] text-gray-900 mb-[8px]">
                      Complete Tasks to Finalize Your Study Plan
                    </h3>

                    <button
                      type="button"
                      onClick={handleRefreshStudyPlanStatus}
                      className="flex items-center gap-[8px] px-[14px] py-[8px] rounded-[8px] font-['Inter'] text-[13px] font-semibold transition-all shrink-0 bg-white text-[#1977f3] border border-blue-200 hover:bg-blue-100 hover:border-[#1977f3]"
                    >
                      <RefreshCw className="w-[16px] h-[16px]" />
                      Refresh
                    </button>
                  </div>

                  <p className="font-['Inter'] text-[14px] text-gray-700 mb-[12px]">
                    To finalize your study plan, you need:
                  </p>

                  <ul className="space-y-[8px] mb-[12px]">
                    <li className="flex items-center gap-[8px]">
                      {taskCompletionPercentage >=
                      MIN_TASK_COMPLETION_PERCENTAGE ? (
                        <CheckCircle className="w-[16px] h-[16px] text-green-600" />
                      ) : (
                        <AlertCircle className="w-[16px] h-[16px] text-orange-600" />
                      )}
                      <span className="font-['Inter'] text-[14px] text-gray-700">
                        Complete at least{" "}
                        <strong>{MIN_TASK_COMPLETION_PERCENTAGE}%</strong> of
                        tasks (Currently:{" "}
                        <strong>{taskCompletionPercentage}%</strong>)
                      </span>
                    </li>
                    <li className="flex items-center gap-[8px]">
                      {submissionCountSinceCreation >=
                      MIN_SUBMISSIONS_SINCE_CREATION_REQUIRED ? (
                        <CheckCircle className="w-[16px] h-[16px] text-green-600" />
                      ) : (
                        <AlertCircle className="w-[16px] h-[16px] text-orange-600" />
                      )}
                      <span className="font-['Inter'] text-[14px] text-gray-700">
                        Have at least{" "}
                        <strong>
                          {MIN_SUBMISSIONS_SINCE_CREATION_REQUIRED} submissions
                        </strong>{" "}
                        (Currently:{" "}
                        <strong>{submissionCountSinceCreation}</strong>)
                      </span>
                    </li>
                  </ul>
                  <div className="flex items-center gap-[16px]">
                    <div className="flex-1 bg-gray-200 rounded-full h-[8px] overflow-hidden">
                      <div
                        className="bg-[#1977f3] h-full transition-all duration-300"
                        style={{ width: `${taskCompletionPercentage}%` }}
                      ></div>
                    </div>
                    <span className="font-['Inter'] text-[14px] text-gray-600 whitespace-nowrap">
                      {completedTaskCount}/{totalTaskCount} tasks
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tasks Section */}
          {studyPlanEnabled && (
            <div className="bg-white rounded-[12px] p-[32px] shadow-sm border border-gray-200 mb-[24px]">
              <div className="flex items-center gap-[12px] mb-[24px]">
                <Target className="w-[24px] h-[24px] text-[#1977f3]" />
                <h2 className="font-['Inter'] font-semibold text-[24px] text-gray-900">
                  Active Tasks
                </h2>
                <span className="font-['Inter'] text-[14px] text-gray-500">
                  (Top 4 highest-priority targets)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                {activeStudyPlanTasks.map((task, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-[12px] p-[20px] hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-[12px]">
                      <div className="flex items-center gap-[8px]">
                        <h3 className="font-['Inter'] font-bold text-[16px] text-gray-900">
                          Task {idx + 1}
                        </h3>
                      </div>
                      <span
                        className={`px-[12px] py-[4px] rounded-full font-['Inter'] text-[12px] font-semibold border ${getTaskStatusColor(task.status)}`}
                      >
                        {mapTaskStatusApiTypeToUi(task.status)}
                      </span>
                    </div>

                    <div className="space-y-[8px] mb-[12px]">
                      <div className="flex items-center gap-[8px]">
                        <span className="font-['Inter'] text-[12px] font-bold text-gray-700 min-w-[100px]">
                          Focus Type:
                        </span>
                        <span className="font-['Inter'] text-[12px] text-gray-600">
                          {mapFocusTypeApiTypeToUi(task.focusType)}
                        </span>
                      </div>
                      <div className="flex items-center gap-[8px]">
                        <span className="font-['Inter'] text-[12px] font-bold text-gray-700 min-w-[100px]">
                          Focus Key:
                        </span>
                        <span className="font-['Inter'] text-[12px] text-gray-600">
                          {task.focusType === "QUESTION_TYPE"
                            ? mapQuestionApiTypeToUi(
                                selectedSkill,
                                task.questionType,
                              )
                            : mapTopicTagApiToUi(task.topicTag)}
                        </span>
                      </div>
                      <div className="flex items-center gap-[8px]">
                        <span className="font-['Inter'] text-[12px] font-bold text-gray-700 min-w-[100px]">
                          Target Metric:
                        </span>
                        <span className="font-['Inter'] text-[12px] text-gray-600">
                          {mapTargetMetricApiTypeToUi(task.targetMetric)}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white rounded-[8px] p-[12px] mb-[12px] border border-gray-200">
                      <div className="flex items-center justify-between mb-[8px]">
                        <span className="font-['Inter'] text-[13px] font-semibold text-gray-700">
                          Current Value:
                        </span>
                        <span className="font-['Inter'] text-[18px] font-bold text-gray-900">
                          {task.currentValue}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-[8px]">
                        <span className="font-['Inter'] text-[13px] font-semibold text-gray-700">
                          Target Value:
                        </span>
                        <span className="font-['Inter'] text-[18px] font-bold text-[#1977f3]">
                          {task.targetValue}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-['Inter'] text-[13px] font-semibold text-gray-700">
                          Direction:
                        </span>
                        <div className="flex items-center gap-[6px]">
                          {getDirectionIcon(task.direction)}
                          <span className="font-['Inter'] text-[14px] font-semibold text-gray-900">
                            {mapDirectionApiTypeToUi(task.direction)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="font-['Inter'] text-[14px] text-gray-700 leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Strength Blocks Section */}
          {studyPlanEnabled && (
            <div className="bg-white rounded-[12px] p-[32px] shadow-sm border border-gray-200 mb-[24px]">
              <div className="flex items-center gap-[12px] mb-[24px]">
                <CheckCircle className="w-[24px] h-[24px] text-[#10b981]" />
                <h2 className="font-['Inter'] font-semibold text-[24px] text-gray-900">
                  Strength Blocks
                </h2>
                <span className="font-['Inter'] text-[14px] text-gray-500">
                  (Top strongest focus units)
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
                {activeStudyPlanStrengths.map((strength, idx) => (
                  <div
                    key={idx}
                    className="bg-white border-2 border-green-200 rounded-[12px] p-[20px] hover:border-[#10b981] transition-all"
                  >
                    <div className="flex items-start justify-between mb-[12px]">
                      <h3 className="font-['Inter'] font-bold text-[16px] text-gray-900">
                        Strength Block {idx + 1}
                      </h3>
                    </div>

                    <div className="space-y-[8px] mb-[12px]">
                      <div className="flex items-center gap-[8px]">
                        <span className="font-['Inter'] text-[12px] font-bold text-gray-700 min-w-[80px]">
                          Focus Type:
                        </span>
                        <span className="font-['Inter'] text-[12px] text-gray-600">
                          {mapFocusTypeApiTypeToUi(strength.focusType)}
                        </span>
                      </div>
                      <div className="flex items-center gap-[8px]">
                        <span className="font-['Inter'] text-[12px] font-bold text-gray-700 min-w-[80px]">
                          Focus Key:
                        </span>
                        <span className="font-['Inter'] text-[12px] text-gray-600">
                          {strength.focusType === "QUESTION_TYPE"
                            ? mapQuestionApiTypeToUi(
                                selectedSkill,
                                strength.questionType,
                              )
                            : mapTopicTagApiToUi(strength.topicTag)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-[12px]">
                      <div>
                        <p className="font-['Inter'] text-[14px] font-bold text-gray-900 mb-[4px]">
                          Description:
                        </p>
                        <p className="font-['Inter'] text-[14px] text-gray-600 leading-relaxed">
                          {strength.description}
                        </p>
                      </div>

                      <div>
                        <p className="font-['Inter'] text-[14px] font-bold text-gray-900 mb-[4px]">
                          Explanation:
                        </p>
                        <p className="font-['Inter'] text-[14px] text-gray-600 leading-relaxed">
                          {strength.explanation}
                        </p>
                      </div>

                      <div>
                        <p className="font-['Inter'] text-[14px] font-bold text-gray-900 mb-[4px]">
                          Evidence:
                        </p>
                        <div className="bg-green-50 border-l-4 border-[#10b981] p-[10px] rounded-[4px]">
                          <p className="font-['Inter'] text-[14px] text-gray-700 italic">
                            {strength.evidence}
                          </p>
                        </div>
                      </div>

                      <div className="bg-[#fcbf65]/10 border border-[#fcbf65]/30 rounded-[8px] p-[12px]">
                        <p className="font-['Inter'] text-[14px] font-bold text-gray-900 mb-[4px]">
                          Recommended Next Action:
                        </p>
                        <p className="font-['Inter'] text-[14px] text-gray-700 mb-[6px]">
                          {strength.recommendedNextAction}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weakness Blocks Section */}
          {studyPlanEnabled && (
            <div className="bg-white rounded-[12px] p-[32px] shadow-sm border border-gray-200">
              <div className="flex items-center gap-[12px] mb-[24px]">
                <AlertCircle className="w-[24px] h-[24px] text-[#f59e0b]" />
                <h2 className="font-['Inter'] font-semibold text-[24px] text-gray-900">
                  Weakness Blocks
                </h2>
                <span className="font-['Inter'] text-[14px] text-gray-500">
                  (Top weakest focus units)
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
                {activeStudyPlanWeaknesses.map((weakness, idx) => (
                  <div
                    key={idx}
                    className="bg-white border-2 border-orange-200 rounded-[12px] p-[20px] hover:border-[#f59e0b] transition-all"
                  >
                    <div className="flex items-start justify-between mb-[12px]">
                      <h3 className="font-['Inter'] font-bold text-[16px] text-gray-900">
                        Weakness Block {idx + 1}
                      </h3>
                    </div>

                    <div className="space-y-[8px] mb-[12px]">
                      <div className="flex items-center gap-[8px]">
                        <span className="font-['Inter'] text-[12px] font-bold text-gray-700 min-w-[80px]">
                          Focus Type:
                        </span>
                        <span className="font-['Inter'] text-[12px] text-gray-600">
                          {mapFocusTypeApiTypeToUi(weakness.focusType)}
                        </span>
                      </div>
                      <div className="flex items-center gap-[8px]">
                        <span className="font-['Inter'] text-[12px] font-bold text-gray-700 min-w-[80px]">
                          Focus Key:
                        </span>
                        <span className="font-['Inter'] text-[12px] text-gray-600">
                          {weakness.focusType === "QUESTION_TYPE"
                            ? mapQuestionApiTypeToUi(
                                selectedSkill,
                                weakness.questionType,
                              )
                            : mapTopicTagApiToUi(weakness.topicTag)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-[12px]">
                      <div>
                        <p className="font-['Inter'] text-[14px] font-bold text-gray-900 mb-[4px]">
                          Description:
                        </p>
                        <p className="font-['Inter'] text-[14px] text-gray-600 leading-relaxed">
                          {weakness.description}
                        </p>
                      </div>

                      <div>
                        <p className="font-['Inter'] text-[14px] font-bold text-gray-900 mb-[4px]">
                          Explanation:
                        </p>
                        <p className="font-['Inter'] text-[14px] text-gray-600 leading-relaxed">
                          {weakness.explanation}
                        </p>
                      </div>

                      <div>
                        <p className="font-['Inter'] text-[14px] font-bold text-gray-900 mb-[4px]">
                          Evidence:
                        </p>
                        <div className="bg-orange-50 border-l-4 border-[#f59e0b] p-[10px] rounded-[4px]">
                          <p className="font-['Inter'] text-[14px] text-gray-700 italic">
                            {weakness.evidence}
                          </p>
                        </div>
                      </div>

                      <div className="bg-[#fcbf65]/10 border border-[#fcbf65]/30 rounded-[8px] p-[12px]">
                        <p className="font-['Inter'] text-[14px] font-bold text-gray-900 mb-[4px]">
                          Recommended Next Action:
                        </p>
                        <p className="font-['Inter'] text-[14px] text-gray-700 mb-[6px]">
                          {weakness.recommendedNextAction}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
