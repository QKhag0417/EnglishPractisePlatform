import { useState, useEffect, useRef } from "react";
import { X, Volume2, Pause, Play } from "lucide-react";
import {
  TestInstructionScreen,
  TestScreen,
  TestResultScreen,
} from "./components";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { API_BASE } from "../../env.ts";

import {
  ExercisePrompt,
  mockExercisePrompt1,
} from "../../mocks/exercisePrompts.mock.ts";
import {
  ExerciseAnswer,
  mockExerciseAnswers,
} from "../../mocks/exerciseAnswers.mock.ts";

type UserAnswers = Record<number, string | string[]>;

export function ListeningTestPage() {
  const { exerciseId } = useParams();

  // =========================
  // Navigation + auth
  // =========================
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // =========================
  // API mapping helpers
  // =========================
  const taskTypeToNumber = (task?: string): number => {
    switch (task) {
      case "TASK_1":
        return 1;
      case "TASK_2":
        return 2;
      case "TASK_3":
        return 3;
      case "TASK_4":
        return 4;
      default:
        return 0;
    }
  };

  // =========================
  // Initial data state (instruction + prompt + answers)
  // =========================

  const [exercisePrompt, setExercisePrompt] =
    useState<ExercisePrompt>(mockExercisePrompt1);

  const [exerciseAnswers, setExerciseAnswers] =
    useState<ExerciseAnswer>(mockExerciseAnswers);

  // =========================
  // Fetch prompt
  // =========================
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/practice-content/${exerciseId}/prompt`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
            credentials: "include",
          },
        );

        const json = await res.json();
        const dto = json?.data;

        if (!dto) return;

        const prompt: ExercisePrompt = {
          id: dto.id,
          task: taskTypeToNumber(dto.task),
          duration: dto.duration ?? 0,
          audioUrl: dto.audioUrl ?? "",
          examText: dto.examText ?? "",
          totalQuestions: dto.totalQuestions ?? 0,
        };

        setExercisePrompt(prompt);
      } catch (err) {
        console.error("Failed to fetch prompt:", err);
      }
    })();
  }, [exerciseId]);

  // =========================
  // Fetch answers
  // =========================
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/practice-content/${exerciseId}/answers`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
            credentials: "include",
          },
        );

        const json = await res.json();
        const dto = json?.data;

        if (!dto) return;

        const correctAnswers: Record<number, string | string[]> = {};

        for (const a of dto.answers ?? []) {
          const list: string[] = a?.correctAnswers ?? [];
          correctAnswers[a.orderIndex] =
            list.length <= 1 ? (list[0] ?? "") : list;
        }

        const answers: ExerciseAnswer = {
          id: dto.id,
          correctAnswers,
        };

        setExerciseAnswers(answers);
      } catch (err) {
        console.error("Failed to fetch answers:", err);
      }
    })();
  }, [exerciseId]);

  // =========================
  // Test flow state (instruction/test/results) + user answers + timing
  // =========================
  const [testState, setTestState] = useState<
    "instruction" | "test" | "results"
  >("instruction");
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [timeRemaining, setTimeRemaining] = useState(
    exercisePrompt.duration * 60,
  );
  const [testStartTime, setTestStartTime] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // =========================
  // Audio playback state + refs
  // =========================
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // =========================
  // Timer countdown (auto-submit when hits 0)
  // =========================
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

  // =========================
  // Time formatting helper (MM:SS)
  // =========================
  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return "00:00";

    const total = Math.floor(seconds); // or Math.round(seconds)
    const mins = Math.floor(total / 60);
    const secs = total % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // =========================
  // Test flow handlers (start/exit/submit/results)
  // =========================
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

  // =========================
  // Answer handlers (user input)
  // =========================
  const handleAnswerChange = (questionId: number, value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // const handleQuestionNavigation = (index: number) => {
  //   setCurrentQuestionIndex(index);
  // };

  // =========================
  // Audio side-effects (play/pause + reset when audioUrl changes)
  // =========================
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

  useEffect(() => {
    setIsPlaying(false);
    setAudioProgress(0);
    setCurrentTime(0);
    setDuration(0);
  }, [exercisePrompt.audioUrl]);

  // =========================
  // Audio event handlers (progress/metadata/end/seek)
  // =========================
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

  const buildAudioUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  // =========================
  // Reset helpers (restart entire test + audio UI)
  // =========================
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
      <TestInstructionScreen skill="LISTENING" onStartTest={handleStartTest} />
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
    <TestScreen
      exercisePrompt={exercisePrompt}
      timeRemaining={timeRemaining}
      formatTime={formatTime}
      answers={answers}
      currentQuestionIndex={currentQuestionIndex}
      onAnswerChange={handleAnswerChange}
      audioRef={audioRef}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
      audioProgress={audioProgress}
      currentTime={currentTime}
      duration={duration}
      onLoadedMetadata={handleLoadedMetadata}
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
      onSeek={handleSeek}
      buildAudioUrl={buildAudioUrl}
      onExitTest={handleExitTest}
      onSubmit={handleSubmit}
      showSubmitModal={showSubmitModal}
      setShowSubmitModal={setShowSubmitModal}
      showExitModal={showExitModal}
      setShowExitModal={setShowExitModal}
      onConfirmSubmit={handleConfirmSubmit}
      onConfirmExit={handleConfirmExit}
    />
  );
}
