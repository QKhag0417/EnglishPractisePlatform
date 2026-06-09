import { MessageSquare, Send, UserCheck } from "lucide-react";
import { use, useEffect, useState } from "react";
import { Switch } from "../../../components/ui/switch";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { formatRelativeLocalDateTime, getAvatarMeta } from "../utils";
import {
  useGetPracticeSubmission,
  useGetSubmissionFeedbacks,
  usePostSubmissionFeedback,
  usePutPracticeSubmissionById,
  useReviewRequested,
  useTutorMessage,
} from "../hooks";
import { useAuth } from "../../../contexts/AuthContext";

type Props = {
  submissionId: string;
};

export function FeedbackSection({ submissionId }: Props) {
  // =========================
  // Auth
  // =========================

  const { user } = useAuth();

  const isLearner = user?.role === "learner";
  const isTutor = user?.role === "tutor";

  const userId = user?.id;

  // =========================
  // Get Submission Feedback
  // =========================

  const getSubmissionFeedbacks = useGetSubmissionFeedbacks(submissionId);

  useEffect(() => {
    if (!submissionId) return;
    getSubmissionFeedbacks.get();
  }, [submissionId, getSubmissionFeedbacks.get]);

  // =========================
  // Prepared Tutor Feedback
  // =========================

  const preparedTutorFeedback = getSubmissionFeedbacks.feedbacks.map((item) => {
    const avatarMeta = getAvatarMeta(
      item.author.firstname,
      item.author.lastname,
    );

    return {
      ...item,
      tutorInitials: avatarMeta.initials,
      avatarColor: avatarMeta.colorClass,
      avatarUrl: avatarMeta.avatarUrl,
      tutorFullName: `${item.author.firstname} ${item.author.lastname}`,
      timeAgo: formatRelativeLocalDateTime(item.updatedAt),
    };
  });

  // =========================
  // Tutor message
  // =========================

  const tutorMessage = useTutorMessage();

  // =========================
  // Post submission feedback
  // =========================

  const postSubmissionFeedback = usePostSubmissionFeedback();

  // =========================
  // Handle click send feedback button
  // =========================

  const handleOnClickSendFeedbackButton = async () => {
    const feedbackContent = tutorMessage.tutorMessage.trim();

    if (!feedbackContent || !submissionId || !userId) return;

    await postSubmissionFeedback.post({
      submissionId: submissionId,
      authorId: userId,
      authorType: "TUTOR",
      feedbackContent,
    });

    await getSubmissionFeedbacks.get();
    tutorMessage.setTutorMessage("");
  };

  // =========================
  // Put practice submission by id
  // =========================

  const putPracticeSubmissionById = usePutPracticeSubmissionById();

  // =========================
  // Get practice submission data for isTutorReviewRequested
  // =========================

  const getPracticeSubmission = useGetPracticeSubmission(submissionId || "");

  useEffect(() => {
    if (!submissionId) return;
    getPracticeSubmission.get();
  }, [submissionId, getPracticeSubmission.get]);

  const isTutorReviewRequested =
    getPracticeSubmission.submission?.isTutorReviewRequested;

  // =========================
  // Handle switch review
  // =========================

  const handleOnSwitchReview = async (checked: boolean) => {
    if (!submissionId) return;

    await putPracticeSubmissionById.put(
      { practiceSubmissionId: submissionId },
      { isTutorReviewRequested: checked },
    );

    await getPracticeSubmission.get();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
      <div className="flex items-center gap-[10px] mb-[24px]">
        <MessageSquare className="w-[20px] h-[20px] text-[#10b981]" />
        <h2 className="font-['Inter'] font-semibold text-[20px] text-gray-900">
          Feedback & Discussion
        </h2>
      </div>

      {/* Request Tutor Review Card with Toggle */}
      {isLearner && (
        <div className="bg-gray-50 rounded-[12px] p-[20px] border border-gray-200 mb-[24px]">
          <div className="flex items-center justify-between gap-[12px]">
            <div className="flex items-start gap-[12px] flex-1">
              <UserCheck className="w-[20px] h-[20px] text-gray-600 mt-[2px] flex-shrink-0" />
              <div>
                <h3 className="font-['Inter'] font-semibold text-[14px] text-gray-900 mb-[4px]">
                  Request Tutor Review
                </h3>
                <p className="font-['Inter'] text-[14px] text-gray-600 leading-relaxed">
                  {isTutorReviewRequested
                    ? "Your test was sent for tutor review. You'll get expert feedback soon."
                    : "Turn this on to send your test for tutor feedback."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-[12px] flex-shrink-0">
              {isTutorReviewRequested && (
                <span className="font-['Inter'] text-[14px] text-[#10b981] font-medium">
                  Review enabled
                </span>
              )}
              <Switch
                checked={!!isTutorReviewRequested}
                onCheckedChange={handleOnSwitchReview}
                className="data-[state=checked]:bg-[#10b981]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tutor Message */}
      <div className="bg-white rounded-[12px] p-[20px] border border-gray-200 mb-[24px]">
        <textarea
          value={tutorMessage.tutorMessage}
          onChange={(e) => tutorMessage.setTutorMessage(e.target.value)}
          placeholder="Write a message..."
          className="w-full min-h-[100px] p-[12px] border border-gray-300 rounded-[8px] font-['Inter'] text-[14px] text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#1977f3] focus:border-transparent"
        />
        <div className="flex justify-end mt-[12px]">
          <button
            onClick={handleOnClickSendFeedbackButton}
            disabled={!tutorMessage.tutorMessage.trim()}
            className="px-[16px] py-[8px] bg-[#1977f3] hover:bg-[#1567d3] text-white rounded-[8px] font-['Inter'] font-semibold text-[14px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-[8px]"
          >
            <Send className="w-[16px] h-[16px]" />
            Send Message
          </button>
        </div>
      </div>

      {/* Feedback Comments - Always visible */}
      <div className="space-y-[16px]">
        <h3 className="font-['Inter'] font-semibold text-[16px] text-gray-900 mb-[12px]">
          Messages ({preparedTutorFeedback.length})
        </h3>
        {preparedTutorFeedback.map((feedback) => (
          <div
            key={feedback.id}
            className="bg-gray-50 rounded-[12px] p-[20px] border border-gray-200"
          >
            <div className="flex items-start gap-[12px]">
              {/* Avatar */}
              <Avatar className="w-[40px] h-[40px] flex-shrink-0">
                <AvatarImage
                  src={feedback.avatarUrl}
                  alt={feedback.tutorInitials}
                />
                <AvatarFallback
                  className={`${feedback.avatarColor} text-white font-['Inter'] font-semibold text-[14px]`}
                >
                  {feedback.tutorInitials}
                </AvatarFallback>
              </Avatar>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-[8px] mb-[8px]">
                  <h4 className="font-['Inter'] font-semibold text-[14px] text-gray-900">
                    {feedback.tutorFullName}
                  </h4>
                  <span className="text-gray-400">•</span>
                  <span className="font-['Inter'] text-[13px] text-gray-500">
                    {feedback.timeAgo}
                  </span>
                </div>
                <p className="font-['Inter'] text-[14px] text-gray-700 leading-relaxed">
                  {feedback.feedbackContent}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
