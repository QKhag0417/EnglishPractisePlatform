import { useCallback, useEffect, useState } from "react";

import { IELTSMastermindLogo } from "../../../components/Logo.tsx";
import { InstructionRenderer } from "./InstructionRenderer.tsx";

import {
  useCountdownTimer,
  useGetReadingExercise,
  useUserAnswer,
  usePostUserAnswersBulk,
  usePostUserSubmission,
  useExitModal,
  usePostUserPracticeContentProgressAttemptIncrement,
  useTestActivityLogger,
} from "../hooks/index.ts";

import { formatTime } from "../utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext.tsx";

type Props = {
  exerciseId: string;
};

export function ReadingTestScreen({ exerciseId }: Props) {
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

  const getReadingExercise = useGetReadingExercise(exerciseId);

  useEffect(() => {
    if (!exerciseId) return;
    void getReadingExercise.get();
  }, [exerciseId, getReadingExercise.get]);

  // =========================
  // User Answers
  // =========================

  const userAnswer = useUserAnswer({
    answerCount: getReadingExercise.exercise.totalQuestions,
  });

  // =========================
  // Countdown Timer
  // =========================

  const countdownTimer = useCountdownTimer({
    durationMinutes: getReadingExercise.exercise.duration,
  });

  // =========================
  // Test Activity Logger
  // =========================

  const testActivityLogger = useTestActivityLogger({
    getElapsedMs: countdownTimer.getElapsedMs,
  });

  // =========================
  // Log test start activity on component mount
  // =========================

  useEffect(() => {
    if (!exerciseId) return;

    testActivityLogger.logActivity({
      activityType: "TEST_START",
    });
  }, [exerciseId]);

  // =========================
  // Post User Submission
  // =========================

  const postUserSubmission = usePostUserSubmission();

  // =========================
  // Post User Answers Bulk
  // =========================

  const postUserAnswersBulk = usePostUserAnswersBulk();

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

  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const openSubmitModal = useCallback(() => setShowSubmitModal(true), []);
  const cancelSubmitModal = useCallback(() => setShowSubmitModal(false), []);

  const confirmSubmit = async () => {
    testActivityLogger.logActivity({
      activityType: "TEST_SUBMIT",
    });

    const submission = await postUserSubmission.post({
      userId: user?.id || "",
      practiceContentId: exerciseId,
      timeSpentSeconds:
        getReadingExercise.exercise.duration * 60 -
        countdownTimer.secondsRemaining,
      learnerTestActivities: testActivityLogger.getQueuedActivities(),
    });

    const submissionId = submission?.practiceSubmissionId;

    await postUserAnswersBulk.post({
      userPracticeSubmissionId: submissionId || "",
      answers: Object.entries(userAnswer.answers)
        .map(([orderIndex, answers]) => ({
          orderIndex: Number(orderIndex),
          answers: answers ?? [],
        }))
        .filter((row) => Number.isFinite(row.orderIndex))
        .sort((a, b) => a.orderIndex - b.orderIndex),
    });

    await postAttemptIncrement.post();

    setShowSubmitModal(false);
    navigate(`/test/result/${submissionId}`);
  };

  useEffect(() => {
    if (countdownTimer.isExpired) {
      openSubmitModal();
    }
  }, [countdownTimer.isExpired, openSubmitModal]);

  // =========================
  // Exit Modal
  // =========================

  const exitPath = `/${getReadingExercise.exercise.skill.toLowerCase()}/browse`;

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
            type="button"
          >
            Exit test
          </button>
        </div>
      </div>

      {/* Split area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Passage */}
        <div className="w-1/2 border-r-2 border-gray-300 overflow-y-auto p-8">
          <div className="text-[16px] leading-7 text-gray-800 whitespace-pre-line">
            <InstructionRenderer
              instruction={getReadingExercise.exercise.passageParsed}
            />
          </div>
        </div>

        {/* Right: Questions */}
        <div className="w-1/2 overflow-y-auto p-8">
          <InstructionRenderer
            instruction={getReadingExercise.exercise.examText}
            userAnswers={userAnswer.answers}
            onAnswerChange={userAnswer.onAnswerChange}
            onLogActivity={testActivityLogger.logActivity}
          />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t-2 border-gray-300 bg-white px-6 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {Array.from({
              length: getReadingExercise.exercise.totalQuestions,
            }).map((_, index) => {
              const answer = userAnswer.answers[index + 1];

              const isAnswered = (answer?.[0]?.length ?? 0) > 0;

              return (
                <button
                  key={index}
                  className={`w-12 h-12 rounded border-2 font-medium text-[16px] transition-colors
${isAnswered ? "bg-[#1977f3] text-white border-[#1977f3]" : "bg-white text-gray-700 border-gray-400 hover:border-[#1977f3]"}
`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <button
            onClick={openSubmitModal}
            className="px-8 py-3 bg-[#fcbf65] hover:bg-[#e5ab52] text-black rounded font-['Inter'] font-bold text-[16px] transition-colors"
            type="button"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-[500px] w-full mx-4 shadow-2xl">
            <h2 className="font-['Inter'] font-bold text-[24px] mb-4 text-black">
              Submit Test?
            </h2>
            <p className="font-['Inter'] text-[16px] text-gray-700 mb-6">
              {countdownTimer.secondsRemaining === 0
                ? "Time is up! Your test will be submitted automatically."
                : "Are you sure you want to submit your test? You cannot change your answers after submission."}
            </p>
            <div className="flex gap-4">
              {countdownTimer.secondsRemaining > 0 && (
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-['Inter'] font-semibold hover:bg-gray-100 transition-colors"
                  type="button"
                >
                  Continue Test
                </button>
              )}
              <button
                onClick={confirmSubmit}
                className="flex-1 px-6 py-3 bg-[#1977f3] hover:bg-[#1567d3] text-white rounded-lg font-['Inter'] font-bold transition-colors"
                type="button"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {exitModal.showExitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-[500px] w-full mx-4 shadow-2xl">
            <h2 className="font-['Inter'] font-bold text-[24px] mb-4 text-black">
              Exit Test?
            </h2>
            <p className="font-['Inter'] text-[16px] text-gray-700 mb-6">
              Are you sure you want to exit the test? Your answers will not be
              saved.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => exitModal.setShowExitModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-['Inter'] font-semibold hover:bg-gray-100 transition-colors"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={exitModal.confirmExit}
                className="flex-1 px-6 py-3 bg-[#dc3545] hover:bg-[#c82333] text-white rounded-lg font-['Inter'] font-bold transition-colors"
                type="button"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
