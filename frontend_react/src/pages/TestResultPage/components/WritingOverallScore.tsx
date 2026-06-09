import { Award } from "lucide-react";
import {
  useGetAllTutorBandScoreByWritingId,
  useWritingReviewRefreshStore,
} from "../hooks";
import { useEffect } from "react";
import { WritingReviewBandScore } from "../types";

type Props = {
  writingSubmissionId: string;
  taskType: "TASK_1" | "TASK_2" | "TASK_3" | "TASK_4" | string;
  onScoreExistChange?: (hasScore: boolean) => void;
};

export function WritingOverallScore({
  writingSubmissionId,
  taskType,
  onScoreExistChange,
}: Props) {
  // =========================
  // Check task
  // =========================

  const isTask1 = taskType === "TASK_1";
  const isTask2 = taskType === "TASK_2";

  // =========================
  // Get all tutor band score by writing id
  // =========================

  const { refreshVersion } = useWritingReviewRefreshStore();

  const getAllTutorBandScoreByWritingId = useGetAllTutorBandScoreByWritingId();

  useEffect(() => {
    if (!writingSubmissionId) return;
    getAllTutorBandScoreByWritingId.get({
      writingAnswerId: writingSubmissionId,
    });
  }, [writingSubmissionId, refreshVersion]);

  const allTutorBandScores =
    getAllTutorBandScoreByWritingId.writingReviewBandScores;

  // =========================
  // Check if any writing score exists
  // =========================

  const isValidScore = (score?: number | null) => {
    return typeof score === "number" && !Number.isNaN(score) && score > 0;
  };

  const hasRequiredWritingScore = allTutorBandScores.some((review) => {
    const taskScore = isTask1
      ? review.tutorTaskAchievementBand
      : isTask2
        ? review.tutorTaskResponseBand
        : review.tutorTaskAchievementBand;

    return (
      isValidScore(taskScore) &&
      isValidScore(review.tutorCoherenceAndCohesionBand) &&
      isValidScore(review.tutorLexicalResourceBand) &&
      isValidScore(review.tutorGrammaticalRangeAndAccuracyBand)
    );
  });

  useEffect(() => {
    onScoreExistChange?.(hasRequiredWritingScore);
  }, [hasRequiredWritingScore, onScoreExistChange]);

  // =========================
  // Calculate overall score
  // =========================

  const calculateOverallScore = () => {
    if (!allTutorBandScores || allTutorBandScores.length === 0) return "--";

    const allScores: number[] = [];

    allTutorBandScores.forEach((review) => {
      const taskScore = isTask1
        ? review.tutorTaskAchievementBand
        : isTask2
          ? review.tutorTaskResponseBand
          : review.tutorTaskAchievementBand;

      const coherenceScore = review.tutorCoherenceAndCohesionBand;
      const lexicalScore = review.tutorLexicalResourceBand;
      const grammaticalScore = review.tutorGrammaticalRangeAndAccuracyBand;

      if (!isNaN(taskScore)) allScores.push(taskScore);
      if (!isNaN(coherenceScore)) allScores.push(coherenceScore);
      if (!isNaN(lexicalScore)) allScores.push(lexicalScore);
      if (!isNaN(grammaticalScore)) allScores.push(grammaticalScore);
    });

    if (allScores.length === 0) return "--";

    const average =
      allScores.reduce((sum, score) => sum + score, 0) / allScores.length;

    return average.toFixed(1);
  };

  const overallScore = calculateOverallScore();

  // =========================
  // Calculate average score for each criterion
  // =========================

  const calculateCriterionAverage = (
    criterionGetter: (review: WritingReviewBandScore) => number,
  ) => {
    if (!allTutorBandScores || allTutorBandScores.length === 0) return "--";

    const scores: number[] = [];

    allTutorBandScores.forEach((review) => {
      const score = criterionGetter(review);
      if (!isNaN(score)) scores.push(score);
    });

    if (scores.length === 0) return "--";

    const average =
      scores.reduce((sum, score) => sum + score, 0) / scores.length;

    return average.toFixed(1);
  };

  const taskAchievementAverage = calculateCriterionAverage(
    (r) => r.tutorTaskAchievementBand,
  );

  const taskResponseAverage = calculateCriterionAverage(
    (r) => r.tutorTaskResponseBand,
  );

  const coherenceAndCohesionAverage = calculateCriterionAverage(
    (r) => r.tutorCoherenceAndCohesionBand,
  );

  const lexicalResourceAverage = calculateCriterionAverage(
    (r) => r.tutorLexicalResourceBand,
  );

  const grammaticalRangeAverage = calculateCriterionAverage(
    (r) => r.tutorGrammaticalRangeAndAccuracyBand,
  );

  return (
    <div className="bg-white rounded-[12px] p-[32px] shadow-sm border border-gray-200 mb-[24px]">
      <div className="flex items-center gap-[12px] mb-[24px]">
        <Award className="w-[24px] h-[24px] text-[#1977f3]" />
        <h2 className="font-['Inter'] font-semibold text-[20px] text-gray-900">
          Overall Score
        </h2>
      </div>

      {allTutorBandScores.length === 0 ? (
        <div className="bg-gray-50 rounded-[12px] p-[32px] text-center border border-gray-200">
          <p className="font-['Inter'] text-[14px] text-gray-600">
            No tutor reviews available yet. Scores will appear here once tutors
            have provided feedback.
          </p>
        </div>
      ) : (
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-[20px]">
            {/* Overall Score - Larger */}
            <div className="md:col-span-1 bg-gradient-to-br from-[#fcbf65] to-[#f59e0b] rounded-[12px] p-[24px] flex flex-col items-center justify-center border-2 border-[#fcbf65]">
              <p className="font-['Inter'] text-[12px] font-medium text-gray-800 mb-[8px]">
                Overall Band Score
              </p>
              <p className="font-['Inter'] text-[48px] font-bold leading-none text-gray-900">
                {overallScore}
              </p>
            </div>

            {/* Individual Criteria Scores */}
            <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
              {/* Task Achievement */}
              <div className="bg-blue-50 rounded-[12px] p-[20px] border border-blue-200 flex flex-col items-center justify-center">
                <p className="font-['Inter'] text-[11px] font-medium text-gray-600 uppercase mb-[12px] text-center">
                  {isTask1
                    ? "Task Achievement"
                    : isTask2
                      ? "Task Response"
                      : "Task Achievement"}
                </p>
                <p className="font-['Inter'] text-[36px] font-bold leading-none text-gray-900">
                  {isTask1
                    ? taskAchievementAverage
                    : isTask2
                      ? taskResponseAverage
                      : taskAchievementAverage}
                </p>
              </div>

              {/* Coherence and Cohesion */}
              <div className="bg-purple-50 rounded-[12px] p-[20px] border border-purple-200 flex flex-col items-center justify-center">
                <p className="font-['Inter'] text-[11px] font-medium text-gray-600 uppercase mb-[12px] text-center">
                  Coherence & Cohesion
                </p>
                <p className="font-['Inter'] text-[36px] font-bold leading-none text-gray-900">
                  {coherenceAndCohesionAverage}
                </p>
              </div>

              {/* Lexical Resource */}
              <div className="bg-green-50 rounded-[12px] p-[20px] border border-green-200 flex flex-col items-center justify-center">
                <p className="font-['Inter'] text-[11px] font-medium text-gray-600 uppercase mb-[12px] text-center">
                  Lexical Resource
                </p>
                <p className="font-['Inter'] text-[36px] font-bold leading-none text-gray-900">
                  {lexicalResourceAverage}
                </p>
              </div>

              {/* Grammatical Range and Accuracy */}
              <div className="bg-orange-50 rounded-[12px] p-[20px] border border-orange-200 flex flex-col items-center justify-center">
                <p className="font-['Inter'] text-[11px] font-medium text-gray-600 uppercase mb-[12px] text-center">
                  Grammatical Range
                </p>
                <p className="font-['Inter'] text-[36px] font-bold leading-none text-gray-900">
                  {grammaticalRangeAverage}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
