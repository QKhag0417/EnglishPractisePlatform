import { useNavigate, useParams } from "react-router";

import { useAuth } from "../../contexts/AuthContext.tsx";
import { API_BASE } from "../../env.ts";

import {
  TestInstructionScreen,
  TestScreen,
  TestResultScreen,
} from "./components/index.ts";

import {
  useExercisePrompt,
  useExerciseAnswers,
  useTestFlow,
  useAudioPlayer,
  useSyncedCountdownTimer,
  useAudioSrc,
} from "./hooks/index.ts";

import { formatTime } from "./utils/tempUtils.ts";

import type { ExerciseAnswer, ExercisePrompt } from "./types.ts";

import { mockExercisePrompt } from "./mock/exercisePrompts.mock.ts";
import { mockExerciseAnswers } from "./mock/exerciseAnswers.mock.ts";

export function TestPage() {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // data
  const { exercisePrompt } = useExercisePrompt({
    apiBase: API_BASE + "error",
    // apiBase: API_BASE,
    exerciseId,
    initialPrompt: mockExercisePrompt as ExercisePrompt,
  });

  const { exerciseAnswers } = useExerciseAnswers({
    apiBase: API_BASE + "error",
    // apiBase: API_BASE,
    exerciseId,
    initialAnswers: mockExerciseAnswers as ExerciseAnswer,
  });

  // flow
  const flow = useTestFlow({
    onExitToLibrary: () => navigate("/listening/browse"),
  });

  // timer (fully synced internally)
  const timer = useSyncedCountdownTimer({
    durationMinutes: exercisePrompt.duration,
    isRunning: flow.testState === "test",
    onExpire: flow.openSubmitModal,
  });

  // audio
  const audio = useAudioPlayer({ resetKey: exercisePrompt.audioUrl });
  const audioSrc = useAudioSrc(API_BASE, exercisePrompt.audioUrl);

  const resetTest = () => {
    audio.resetAudio();
    flow.resetFlow(0);
    timer.reset(exercisePrompt.duration);
  };

  // Instruction Screen
  if (flow.testState === "instruction") {
    return (
      <TestInstructionScreen skill="LISTENING" onStartTest={flow.startTest} />
    );
  }

  // Results Screen
  if (flow.testState === "results") {
    return (
      <TestResultScreen
        userAnswers={flow.answers}
        exerciseAnswers={exerciseAnswers.correctAnswers}
        timeSpent={flow.timeSpent}
        onReturnToLibrary={() => navigate("/listening/browse")}
        onTakeAnotherTest={resetTest}
        onLogout={handleLogout}
      />
    );
  }

  // Test Screen
  return (
    <TestScreen
      exercisePrompt={exercisePrompt}
      timeRemaining={timer.secondsRemaining}
      formatTime={formatTime}
      answers={flow.answers}
      currentQuestionIndex={flow.currentQuestionIndex}
      onAnswerChange={flow.onAnswerChange}
      audioRef={audio.audioRef}
      isPlaying={audio.isPlaying}
      setIsPlaying={audio.togglePlay}
      audioProgress={audio.audioProgress}
      currentTime={audio.currentTime}
      duration={audio.duration}
      onLoadedMetadata={audio.handleLoadedMetadata}
      onTimeUpdate={audio.handleTimeUpdate}
      onEnded={audio.handleEnded}
      onSeek={audio.handleSeek}
      buildAudioUrl={() => audioSrc}
      onExitTest={flow.openExitModal}
      onSubmit={flow.openSubmitModal}
      showSubmitModal={flow.showSubmitModal}
      setShowSubmitModal={flow.setShowSubmitModal}
      showExitModal={flow.showExitModal}
      setShowExitModal={flow.setShowExitModal}
      onConfirmSubmit={flow.confirmSubmit}
      onConfirmExit={flow.confirmExit}
    />
  );
}
