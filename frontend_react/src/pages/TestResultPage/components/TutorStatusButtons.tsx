import { CheckCircle } from "lucide-react";
import {
  useGetTutorUserPracticeSubmissionByTutorIdAndSubmissionId,
  usePutSetTutorStatus,
  useRefreshStudyPlanAfterSubmission,
} from "../hooks";
import { useAuth } from "../../../contexts/AuthContext";
import { useEffect } from "react";
import { TutorStatus } from "../types";

type Props = {
  submissionId: string;
  learnerId?: string;
  skill?: "LISTENING" | "READING" | "WRITING" | "SPEAKING";
  onTutorStatusChange?: (status: TutorStatus) => void;
  canCompleteReview?: boolean;
};

export function TutorStatusButtons({
  submissionId,
  learnerId,
  skill,
  onTutorStatusChange,
  canCompleteReview = true,
}: Props) {
  // =========================
  // Auth
  // =========================

  const { user } = useAuth();

  const tutorId = user?.id;

  // =========================
  // Get tutor user practice submission by tutorId and submissionId
  // =========================

  const getTutorUserPracticeSubmissionByTutorIdAndSubmissionIdParams =
    useGetTutorUserPracticeSubmissionByTutorIdAndSubmissionId();

  useEffect(() => {
    if (!submissionId || !tutorId) return;
    getTutorUserPracticeSubmissionByTutorIdAndSubmissionIdParams.get({
      tutorId,
      submissionId,
    });
  }, [submissionId, tutorId]);

  const tutorUserPracticeSubmission =
    getTutorUserPracticeSubmissionByTutorIdAndSubmissionIdParams.tutorUserPracticeSubmission;

  const tutorStatus = tutorUserPracticeSubmission?.tutorStatus;

  const currentTutorStatus = (tutorStatus ?? "PENDING") as TutorStatus;

  useEffect(() => {
    onTutorStatusChange?.(currentTutorStatus);
  }, [currentTutorStatus, onTutorStatusChange]);

  // =========================
  // Put set tutor status
  // =========================

  const putSetTutorStatus = usePutSetTutorStatus();

  const handleSetTutorStatus = async (nextStatus: TutorStatus) => {
    if (!tutorId || !submissionId) return;

    const allowedNextStatusByCurrentStatus: Record<
      TutorStatus,
      TutorStatus | null
    > = {
      PENDING: "IN_REVIEW",
      IN_REVIEW: "COMPLETED",
      COMPLETED: null,
    };

    if (allowedNextStatusByCurrentStatus[currentTutorStatus] !== nextStatus) {
      return;
    }

    await putSetTutorStatus.put(
      {
        tutorId,
        submissionId,
      },
      {
        tutorStatus: nextStatus,
      },
    );

    await getTutorUserPracticeSubmissionByTutorIdAndSubmissionIdParams.get({
      tutorId,
      submissionId,
    });
  };

  const handleStartReview = () => handleSetTutorStatus("IN_REVIEW");

  const handleCompleteReview = () => handleSetTutorStatus("COMPLETED");

  return (
    <div className="flex items-center gap-[16px]">
      <div className="flex gap-[12px]">
        {currentTutorStatus === "PENDING" && (
          <button
            type="button"
            onClick={handleStartReview}
            className="bg-blue-600 hover:bg-blue-700 text-white px-[16px] py-[10px] rounded-[8px] font-['Inter'] font-semibold text-[14px] transition-colors"
          >
            Start Review
          </button>
        )}

        {currentTutorStatus === "IN_REVIEW" && (
          <button
            type="button"
            onClick={handleCompleteReview}
            disabled={!canCompleteReview}
            className={`px-[16px] py-[10px] rounded-[8px] font-['Inter'] font-semibold text-[14px] transition-colors flex items-center ${
              canCompleteReview
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <CheckCircle className="w-[16px] h-[16px] mr-[8px]" />
            Mark as Completed
          </button>
        )}

        {currentTutorStatus === "COMPLETED" && (
          <div className="flex items-center gap-[8px] text-green-600 font-['Inter']">
            <CheckCircle className="w-[20px] h-[20px]" />
            <span className="font-semibold">Review Completed</span>
          </div>
        )}
      </div>
    </div>
  );
}
