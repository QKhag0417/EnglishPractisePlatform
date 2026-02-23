import React from "react";
import { Pause, Play, Volume2 } from "lucide-react";

import { IELTSMastermindLogo } from "../../../components/Logo.tsx";
import { InstructionRenderer } from "../../../components/InstructionParser.tsx";

export type ExercisePromptShape = {
  task: number;
  duration: number;
  audioUrl: string;
  examText: string;
  totalQuestions: number;
};

type UserAnswers = Record<number, string | string[]>;

type Props = {
  exercisePrompt: ExercisePromptShape;

  // timer
  timeRemaining: number;
  formatTime: (seconds: number) => string;

  // answers
  answers: UserAnswers;
  currentQuestionIndex: number;
  onAnswerChange: (questionId: number, value: string | string[]) => void;

  // audio
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  audioProgress: number;
  currentTime: number;
  duration: number;
  onLoadedMetadata: () => void;
  onTimeUpdate: () => void;
  onEnded: () => void;
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  buildAudioUrl: (path?: string) => string;

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

export function TestScreen({
  exercisePrompt,

  timeRemaining,
  formatTime,

  answers,
  currentQuestionIndex,
  onAnswerChange,

  audioRef,
  isPlaying,
  setIsPlaying,
  audioProgress,
  currentTime,
  duration,
  onLoadedMetadata,
  onTimeUpdate,
  onEnded,
  onSeek,
  buildAudioUrl,

  onExitTest,
  onSubmit,

  showSubmitModal,
  setShowSubmitModal,
  showExitModal,
  setShowExitModal,
  onConfirmSubmit,
  onConfirmExit,
}: Props) {
  return (
    <div className="min-h-screen bg-white">
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
          >
            Exit test
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-8 py-8">
        {/* Audio Player */}
        <audio
          ref={audioRef}
          src={buildAudioUrl(exercisePrompt.audioUrl)}
          preload="metadata"
          onLoadedMetadata={onLoadedMetadata}
          onTimeUpdate={onTimeUpdate}
          onEnded={onEnded}
        />

        <div className="bg-[#f5f5dc] border border-gray-300 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying((p) => !p)}
                className="bg-[#fcbf65] hover:bg-[#e5ab52] text-white p-3 rounded-full transition-colors"
                type="button"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>

              <Volume2 className="w-6 h-6 text-gray-600" />
            </div>

            <div className="text-[16px] text-gray-600">
              <span className="font-medium">{formatTime(currentTime)}</span> /{" "}
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div
            className="w-full bg-gray-300 rounded-full h-2 cursor-pointer"
            onClick={onSeek}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(audioProgress)}
          >
            <div
              className="bg-[#fcbf65] h-2 rounded-full transition-all"
              style={{ width: `${audioProgress}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="bg-white border border-gray-300 rounded-lg p-8 mb-6">
          <h3 className="text-[20px] font-bold text-black mb-2">
            Part {exercisePrompt.task}
          </h3>

          <InstructionRenderer
            instruction={exercisePrompt.examText}
            userAnswers={answers}
            onAnswerChange={onAnswerChange}
          />
        </div>

        {/* Navigation + Submit */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3 flex-wrap">
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
            className="bg-[#fcbf65] hover:bg-[#e5ab52] text-black px-10 py-3 rounded-lg font-bold text-[18px] transition-colors"
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
                >
                  Continue Test
                </button>
              )}
              <button
                onClick={onConfirmSubmit}
                className="flex-1 px-6 py-3 bg-[#1977f3] hover:bg-[#1567d3] text-white rounded-lg font-['Inter'] font-bold transition-colors"
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
              >
                Cancel
              </button>
              <button
                onClick={onConfirmExit}
                className="flex-1 px-6 py-3 bg-[#dc3545] hover:bg-[#c82333] text-white rounded-lg font-['Inter'] font-bold transition-colors"
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
