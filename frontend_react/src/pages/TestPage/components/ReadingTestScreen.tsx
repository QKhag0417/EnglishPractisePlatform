import React from "react";

import { IELTSMastermindLogo } from "../../../components/Logo.tsx";
import { InstructionRenderer } from "../../../components/InstructionParser.tsx";

import type { ExercisePrompt, UserAnswers } from "../types.ts";

type Props = {
  exercisePrompt: ExercisePrompt;

  // timer
  timeRemaining: number;
  formatTime: (seconds: number) => string;

  // answers
  answers: UserAnswers;
  currentQuestionIndex: number;
  onAnswerChange: (questionId: number, value: string | string[]) => void;

  // actions
  onExitTest: () => void;
  onSubmit: () => void;

  // modals
  showSubmitModal: boolean;
  setShowSubmitModal: React.Dispatch<React.SetStateAction<boolean>>;
  showExitModal: boolean;
  setShowExitModal: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirmSubmit: () => void;
  onConfirmExit: () => void;
};

export function ReadingTestScreen({
  exercisePrompt,
  timeRemaining,
  formatTime,
  answers,
  currentQuestionIndex,
  onAnswerChange,
  onExitTest,
  onSubmit,
  showSubmitModal,
  setShowSubmitModal,
  showExitModal,
  setShowExitModal,
  onConfirmSubmit,
  onConfirmExit,
}: Props & { onNavigateQuestion?: (index: number) => void }) {
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
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          <button
            onClick={onExitTest}
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
          <h3 className="font-['Inter'] font-bold text-[20px] mb-4 text-black">
            {exercisePrompt.passageTitle ?? "Reading Passage"}
          </h3>
          <div className="text-[16px] leading-7 text-gray-800 whitespace-pre-line">
            {exercisePrompt.passageText}
          </div>
        </div>

        {/* Right: Questions */}
        <div className="w-1/2 overflow-y-auto p-8">
          <h3 className="font-['Inter'] font-bold text-[20px] mb-6 text-black">
            Part {exercisePrompt.task}
          </h3>

          <InstructionRenderer
            instruction={exercisePrompt.examText}
            userAnswers={answers}
            onAnswerChange={onAnswerChange}
          />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t-2 border-gray-300 bg-white px-6 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {Array.from({ length: exercisePrompt.totalQuestions }).map(
              (_, index) => {
                const answer = answers[index + 1];

                const isAnswered = Array.isArray(answer)
                  ? answer.length > 0
                  : typeof answer === "string" && answer.trim().length > 0;

                const isCurrent = currentQuestionIndex === index;

                return (
                  <button
                    key={index}
                    className={`w-12 h-12 rounded border-2 font-medium text-[16px] transition-colors
${isAnswered ? "bg-[#1977f3] text-white border-[#1977f3]" : "bg-white text-gray-700 border-gray-400 hover:border-[#1977f3]"}
${isCurrent ? "ring-2 ring-[#dc3545]" : ""}`}
                  >
                    {index + 1}
                  </button>
                );
              },
            )}
          </div>

          <button
            onClick={onSubmit}
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
              {timeRemaining === 0
                ? "Time is up! Your test will be submitted automatically."
                : "Are you sure you want to submit your test? You cannot change your answers after submission."}
            </p>
            <div className="flex gap-4">
              {timeRemaining > 0 && (
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-['Inter'] font-semibold hover:bg-gray-100 transition-colors"
                  type="button"
                >
                  Continue Test
                </button>
              )}
              <button
                onClick={onConfirmSubmit}
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
      {showExitModal && (
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
                onClick={() => setShowExitModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-['Inter'] font-semibold hover:bg-gray-100 transition-colors"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={onConfirmExit}
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
