import { IELTSMastermindLogo } from "../../../components/Logo.tsx";
import { InstructionRenderer } from "./InstructionRenderer.tsx";
import { useNavigate } from "react-router";

import { formatTime, countWords } from "../utils";

import { useEffect, useRef, use } from "react";

import {
  useExitModal,
  useGetWritingExercise,
  useCountdownTimer,
  useUserAnswer,
  usePostUserSubmission,
  useSubmitModal,
  usePostUserPracticeWritingAnswer,
  usePostUserPracticeContentProgressAttemptIncrement,
} from "../hooks";

import { useAuth } from "../../../contexts/AuthContext.tsx";

type Props = {
  exerciseId: string;
};

export function WritingTestScreen({ exerciseId }: Props) {
  // =========================
  // Auth information
  // =========================

  const { user } = useAuth();

  // =========================
  // Navigation
  // =========================

  const navigate = useNavigate();

  // =========================
  // Get exercise test data
  // =========================

  const getWritingExercise = useGetWritingExercise(exerciseId);

  useEffect(() => {
    if (!exerciseId) return;
    void getWritingExercise.get();
  }, [exerciseId, getWritingExercise.get]);

  // =========================
  // User Answers
  // =========================

  const userAnswer = useUserAnswer({});

  const writingText = userAnswer.answers[1]?.[0] ?? "";

  // =========================
  // Countdown Timer
  // =========================

  const onExpireRef = useRef<() => void>(() => {});

  const countdownTimer = useCountdownTimer({
    durationMinutes: getWritingExercise.exercise.duration,
    isRunning: getWritingExercise.exercise.duration > 0,
    onExpire: () => onExpireRef.current(),
  });

  // =========================
  // Post User Submission
  // =========================

  const postUserSubmission = usePostUserSubmission({
    userId: user?.id || "",
    practiceContentId: exerciseId,
    timeSpentSeconds:
      getWritingExercise.exercise.duration * 60 -
      countdownTimer.secondsRemaining,
  });

  // =========================
  // Post User Practice Writing Answer
  // =========================

  const postUserPracticeWritingAnswer = usePostUserPracticeWritingAnswer({
    userPracticeSubmissionId:
      postUserSubmission.submission.practiceSubmissionId || "",
    orderIndex: "1",
    essayText: writingText,
  });

  // =========================
  // Post User Attempt Increment
  // =========================

  const postAttemptIncrement =
    usePostUserPracticeContentProgressAttemptIncrement(
      user?.id || "",
      exerciseId,
    );

  // =========================
  // Submit Modal
  // =========================

  const submitModal = useSubmitModal({
    onGoToResults: () =>
      navigate(
        `/test/result/${postUserSubmission.submission.practiceSubmissionId}`,
      ),
    onPostSubmission: postUserSubmission.post,
    onPostSubmissionAnswers: postUserPracticeWritingAnswer.post,
    onPostAttemptIncrement: postAttemptIncrement.post,
  });

  useEffect(() => {
    onExpireRef.current = submitModal.openSubmitModal;
  }, [submitModal.openSubmitModal]);

  // =========================
  // Exit Modal
  // =========================

  const exitPath = `/writing/browse`;

  const exitModal = useExitModal({ onExit: () => navigate(exitPath) });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-[#1977f3] px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-8">
          <IELTSMastermindLogo clickable={false} />
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <span className="text-[16px] text-white font-medium">
              Time remaining
            </span>
            <div className="bg-white px-5 py-2 rounded-md">
              <span className="text-[18px] font-bold text-[#1977f3]">
                {formatTime(countdownTimer.secondsRemaining)}
              </span>
            </div>
          </div>

          <button
            onClick={exitModal.openExitModal}
            className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-md font-medium text-[16px] transition-colors"
          >
            Exit test
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative pb-[72px]">
        {/* Left Side - Task */}
        <div className="w-1/2 border-r-2 border-gray-300 overflow-y-auto p-8 bg-white">
          <InstructionRenderer
            instruction={getWritingExercise.exercise.examText}
          />
        </div>

        {/* Right Side - Writing Area */}
        <div className="w-1/2 overflow-y-auto p-8 bg-gray-50">
          <textarea
            value={writingText}
            onChange={(e) => userAnswer.onAnswerChange(1, [e.target.value])}
            placeholder="Type your essay here..."
            spellCheck={false}
            className="w-full h-[calc(100vh-340px)] p-4 border border-gray-300 rounded-lg font-['Inter'] text-[16px] resize-none focus:outline-none focus:ring-2 focus:ring-[#1977f3] focus:border-transparent"
          />

          <div className="mt-4 text-[15px] text-gray-600 font-['Inter']">
            Words Count:{" "}
            <span
              className="font-semibold text-gray-900" // TODO: Replace with actual count
            >
              {countWords(writingText)}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Submit Button */}

      <div className="border-t-2 border-gray-300 bg-white px-6 py-4 fixed bottom-0 left-0 right-0">
        <div className="flex items-center justify-end">
          <button
            onClick={submitModal.openSubmitModal}
            className="px-8 py-3 bg-[#fcbf65] hover:bg-[#e5ab52] text-black rounded font-['Inter'] font-bold text-[16px] transition-colors"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Exit Modal */}
      {exitModal.showExitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-[500px] w-full mx-4 shadow-2xl">
            <h2 className="font-['Inter'] font-bold text-[24px] mb-4 text-black">
              Exit Test?
            </h2>
            <p className="font-['Inter'] text-[16px] text-gray-700 mb-6">
              Are you sure you want to exit the test? Your progress will not be
              saved.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => exitModal.setShowExitModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-['Inter'] font-semibold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={exitModal.confirmExit}
                className="flex-1 px-6 py-3 bg-[#dc3545] hover:bg-[#c82333] text-white rounded-lg font-['Inter'] font-bold transition-colors"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Modal */}
      {submitModal.showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-[500px] w-full mx-4 shadow-2xl">
            <h2 className="font-['Inter'] font-bold text-[24px] mb-4 text-black">
              Submit Test?
            </h2>
            <p className="font-['Inter'] text-[16px] text-gray-700 mb-6">
              Are you sure you want to submit your test? You cannot change your
              answers after submission.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => submitModal.setShowSubmitModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-['Inter'] font-semibold hover:bg-gray-100 transition-colors"
              >
                Continue Test
              </button>
              <button
                onClick={submitModal.confirmSubmit}
                className="flex-1 px-6 py-3 bg-[#1977f3] hover:bg-[#1567d3] text-white rounded-lg font-['Inter'] font-bold transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
