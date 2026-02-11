import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, Volume2 } from "lucide-react";

// TODO: update these imports to your actual paths
// import { IELTSMastermindLogo } from "@/components/IELTSMastermindLogo";
// import { InstructionRenderer } from "@/components/InstructionRenderer";

type AnswerValue = string | string[];

type ExercisePrompt = {
  task: number | string;
  totalQuestions: number;
  examText: string;
  audioUrl?: string;
};

interface TestScreenProps {
  exercisePrompt: ExercisePrompt;

  answers: Record<number, AnswerValue>;
  onAnswerChange: (questionNumber: number, value: AnswerValue) => void;

  timeRemaining: number; // seconds

  onConfirmSubmit: () => void;
  onConfirmExit: () => void;

  currentQuestionIndex?: number; // 0-based
  onQuestionNavigation?: (index: number) => void; // 0-based

  buildAudioUrl?: (audioUrl?: string) => string;
  formatTime?: (seconds: number) => string;
}

export function TestScreen({
  exercisePrompt,
  answers,
  onAnswerChange,
  timeRemaining,
  onConfirmSubmit,
  onConfirmExit,
  currentQuestionIndex = 0,
  onQuestionNavigation,
  buildAudioUrl,
  formatTime,
}: TestScreenProps) {
  // ---------- helpers ----------
  const fallbackFormatTime = (seconds: number) => {
    const s = Math.max(0, Math.floor(seconds));
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const fmt = formatTime ?? fallbackFormatTime;

  const audioSrc = useMemo(() => {
    if (!exercisePrompt.audioUrl) return "";
    return buildAudioUrl
      ? buildAudioUrl(exercisePrompt.audioUrl)
      : exercisePrompt.audioUrl;
  }, [exercisePrompt.audioUrl, buildAudioUrl]);

  // ---------- audio state ----------
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioProgress = useMemo(() => {
    if (!duration) return 0;
    return Math.min(100, Math.max(0, (currentTime / duration) * 100));
  }, [currentTime, duration]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      void audio.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) audio.pause();
    };
  }, []);

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime || 0);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handleSeek: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.min(1, Math.max(0, clickX / rect.width));
    audio.currentTime = pct * duration;
    setCurrentTime(audio.currentTime);
  };

  // ---------- submit/exit modals ----------
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  const handleSubmit = () => setShowSubmitModal(true);
  const handleExitTest = () => setShowExitModal(true);

  const handleConfirmSubmit = () => {
    setShowSubmitModal(false);
    onConfirmSubmit();
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    onConfirmExit();
  };

  // ---------- render ----------
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#1977f3] px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-8">
          {/* <IELTSMastermindLogo clickable={false} /> */}
          {/* If you don't want to import, replace with your own header logo */}
          <div className="text-white font-bold text-[18px]">
            IELTS Mastermind
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <span className="text-[16px] text-white font-medium">
              Time remaining
            </span>
            <div className="bg-white px-5 py-2 rounded-md">
              <span className="text-[18px] font-bold text-[#1977f3]">
                {fmt(timeRemaining)}
              </span>
            </div>
          </div>

          <button
            onClick={handleExitTest}
            className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-md font-medium text-[16px] transition-colors"
            type="button"
          >
            Exit test
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-8 py-8">
        {/* Audio Player */}
        {audioSrc ? (
          <>
            <audio
              ref={audioRef}
              src={audioSrc}
              preload="metadata"
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
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
                  <span className="font-medium">{fmt(currentTime)}</span> /{" "}
                  <span>{fmt(duration)}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div
                className="w-full bg-gray-300 rounded-full h-2 cursor-pointer"
                onClick={handleSeek}
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
          </>
        ) : null}

        {/* Questions Section */}
        <div className="bg-white border border-gray-300 rounded-lg p-8 mb-6">
          <h3 className="text-[20px] font-bold text-black mb-2">
            Part {exercisePrompt.task}
          </h3>

          {/* Replace with your renderer */}
          {/* 
          <InstructionRenderer
            instruction={exercisePrompt.examText}
            userAnswers={answers}
            onAnswerChange={onAnswerChange}
          />
          */}

          {/* Minimal fallback if you want something visible without InstructionRenderer */}
          <div className="text-gray-700 whitespace-pre-wrap">
            {exercisePrompt.examText}
          </div>
        </div>

        {/* Question Navigation and Submit Button */}
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
                    onClick={
                      onQuestionNavigation
                        ? () => onQuestionNavigation(index)
                        : undefined
                    }
                    type="button"
                    className={`w-12 h-12 rounded border-2 font-medium text-[16px] transition-colors
                    ${
                      isAnswered
                        ? "bg-[#1977f3] text-white border-[#1977f3]"
                        : "bg-white text-gray-700 border-gray-400 hover:border-[#1977f3]"
                    }
                    ${isCurrent ? "ring-2 ring-[#dc3545]" : ""}
                  `}
                  >
                    {index + 1}
                  </button>
                );
              },
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="bg-[#fcbf65] hover:bg-[#e5ab52] text-black px-10 py-3 rounded-lg font-bold text-[18px] transition-colors"
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
                onClick={handleConfirmSubmit}
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
                onClick={handleConfirmExit}
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
