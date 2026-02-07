import { useState, useEffect, useRef } from "react";
import { X, Volume2, Pause, Play } from "lucide-react";
import { IELTSMastermindLogo } from "../components/Logo";
import { TestResultScreen } from "../components/TestResultScreen";
import { InstructionRenderer } from "../components/InstructionParser.tsx";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../contexts/AuthContext";

import {
  ExerciseInstruction,
  mockExerciseInstruction1,
} from "../mocks/instructions.mock";
import {
  ExercisePrompt,
  mockExercisePrompt1,
} from "../mocks/exercisePrompts.mock";
import {
  ExerciseAnswer,
  mockExerciseAnswers,
} from "../mocks/exerciseAnswers.mock";

type UserAnswers = Record<number, string | string[]>;

export function ListeningTestPage() {
  // TODO: Fetch instruction based on exerciseId and learnerId
  const [exerciseInstruction, setExerciseInstruction] =
    useState<ExerciseInstruction>(mockExerciseInstruction1);

  // TODO: Fetch exercise prompt based on exerciseId and learnerId
  const [exercisePrompt, setExercisePrompt] =
    useState<ExercisePrompt>(mockExercisePrompt1);

  // TODO: Fetch exercise answers based on exerciseId and learnerId
  const [exerciseAnswers, setExerciseAnswers] =
    useState<ExerciseAnswer>(mockExerciseAnswers);

  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [testState, setTestState] = useState<
    "instruction" | "test" | "results"
  >("instruction");
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [timeRemaining, setTimeRemaining] = useState(
    exercisePrompt.duration * 60,
  );
  const [testStartTime, setTestStartTime] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Timer countdown
  useEffect(() => {
    if (testState === "test" && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowSubmitModal(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [testState, timeRemaining]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return "00:00";

    const total = Math.floor(seconds); // or Math.round(seconds)
    const mins = Math.floor(total / 60);
    const secs = total % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleStartTest = () => {
    setTestState("test");
    setTestStartTime(Date.now());
  };

  const handleExitTest = () => {
    setShowExitModal(true);
  };

  const handleConfirmExit = () => {
    navigate("/listening");
  };

  const handleAnswerChange = (questionId: number, value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = () => {
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = () => {
    // Close modal immediately
    setShowSubmitModal(false);
    // Calculate time spent and show results
    const spent = Math.floor((Date.now() - testStartTime) / 1000);
    setTimeSpent(spent);
    setTestState("results");
  };

  // const handleQuestionNavigation = (index: number) => {
  //   setCurrentQuestionIndex(index);
  // };

  // Play/pause whenever isPlaying changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {
        // autoplay/user-gesture restrictions can cause play() to reject
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // If audioUrl changes, reset UI
  useEffect(() => {
    setIsPlaying(false);
    setAudioProgress(0);
    setCurrentTime(0);
    setDuration(0);
  }, [exercisePrompt.audioUrl]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const ct = audio.currentTime || 0;
    const d = audio.duration || 0;

    setCurrentTime(ct);
    setDuration(d);

    const pct = d > 0 ? (ct / d) * 100 : 0;
    setAudioProgress(pct);
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(audio.duration || 0);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.min(Math.max(x / rect.width, 0), 1);
    audio.currentTime = pct * duration;
  };

  const resetTest = () => {
    // stop + reset audio
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    // reset test states
    setTestState("instruction");
    setAnswers({});
    setTimeRemaining(exercisePrompt.duration * 60);
    setTestStartTime(0);
    setTimeSpent(0);

    // reset UI states
    setIsPlaying(false);
    setShowSubmitModal(false);
    setShowExitModal(false);
    setCurrentQuestionIndex(0);

    // reset audio UI
    setAudioProgress(0);
    setCurrentTime(0);
    setDuration(0); // optional: or keep duration if you prefer
  };

  // Instruction Screen
  if (testState === "instruction") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-lg max-w-[900px] w-full p-12">
          <h1 className="text-[32px] font-bold text-[#1977f3] mb-6">
            {exerciseInstruction.title}
          </h1>

          <p className="text-[18px] text-gray-600 mb-8">
            <span className="font-bold">{exerciseInstruction.timeInfo}</span>
          </p>

          <div className="mb-8">
            <h2 className="text-[20px] font-bold text-black mb-4">
              INSTRUCTIONS TO CANDIDATES
            </h2>
            <ul className="list-disc list-inside space-y-3 text-[16px] text-gray-700">
              {exerciseInstruction.candidateInstructions.map(
                (instruction, index) => (
                  <li key={index}>{instruction}</li>
                ),
              )}
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-[20px] font-bold text-black mb-4">
              INFORMATION FOR CANDIDATES
            </h2>
            <ul className="list-disc list-inside space-y-3 text-[16px] text-gray-700">
              {exerciseInstruction.candidateInfo.map((info, index) => (
                <li key={index}>{info}</li>
              ))}
            </ul>
          </div>

          <p className="text-center text-[16px] text-gray-700 font-medium mb-6">
            Do not click 'Start test' until you are told to do so.
          </p>

          <div className="flex justify-center">
            <button
              onClick={handleStartTest}
              className="bg-[#dc3545] hover:bg-[#c82333] text-white px-12 py-3 rounded-lg font-semibold text-[18px] transition-colors"
            >
              Start test
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (testState === "results") {
    return (
      <TestResultScreen
        userAnswers={answers}
        exerciseAnswers={exerciseAnswers.correctAnswers}
        timeSpent={timeSpent}
        onReturnToLibrary={() => navigate("/listening")}
        onTakeAnotherTest={resetTest}
        onLogout={handleLogout}
      />
    );
  }

  // Test Screen
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
            onClick={handleExitTest}
            className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-md font-medium text-[16px] transition-colors"
          >
            Exit test
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-8 py-8">
        {/* Audio Player - Moved to top */}
        <audio
          ref={audioRef}
          src={exercisePrompt.audioUrl}
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
              <span className="font-medium">{formatTime(currentTime)}</span> /{" "}
              <span>{formatTime(duration)}</span>
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

        {/* Questions Section */}
        <div className="bg-white border border-gray-300 rounded-lg p-8 mb-6">
          <h3 className="text-[20px] font-bold text-black mb-2">
            Part {exercisePrompt.task}
          </h3>

          {/* Render exam text */}
          <InstructionRenderer
            instruction={exercisePrompt.examText}
            userAnswers={answers}
            onAnswerChange={handleAnswerChange}
          />
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
                    // onClick={() => handleQuestionNavigation(index)}
                    className={`w-12 h-12 rounded border-2 font-medium text-[16px] transition-colors
          ${isAnswered ? "bg-[#1977f3] text-white border-[#1977f3]" : "bg-white text-gray-700 border-gray-400 hover:border-[#1977f3]"}
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
                onClick={handleConfirmSubmit}
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
                onClick={handleConfirmExit}
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
