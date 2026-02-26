import { useNavigate, useParams } from "react-router";

import { useAuth } from "../../contexts/AuthContext.tsx";
import { API_BASE } from "../../env.ts";

import {
  TestInstructionScreen,
  ListeningTestScreen,
  TestResultScreen,
  ReadingTestScreen,
} from "./components/index.ts";

import { useExercisePrompt } from "./hooks/index.ts";

import type { ExercisePrompt } from "./types.ts";

import {
  mockListeningExercisePrompt,
  mockReadingExercisePrompt,
} from "./mock/exercisePrompts.mock.ts";
import { mockExerciseAnswers } from "./mock/exerciseAnswers.mock.ts";

import { useTestFlow } from "./hooks";

export function TestPage() {
  // =========================
  // Auth and navigation
  // =========================
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // =========================
  // Choosen exercise id
  // =========================

  const { exerciseId } = useParams();

  // =========================
  // Get exercise data
  // =========================

  // data
  const { exercisePrompt } = useExercisePrompt({
    apiBase: API_BASE + "error",
    // apiBase: API_BASE,
    exerciseId,
    initialPrompt: mockListeningExercisePrompt as ExercisePrompt,
  });

  // flow

  const flow = useTestFlow({});

  // Instruction Screen
  if (flow.testState === "instruction") {
    return (
      <TestInstructionScreen
        skill={exercisePrompt.skill}
        onStartTest={flow.startTest}
      />
    );
  }

  // Test Screen
  if (flow.testState === "test") {
    if (exercisePrompt.skill === "LISTENING") {
      return <ListeningTestScreen exerciseId={exerciseId || ""} />;
    }

    // if (exercisePrompt.skill === "READING") {
    //   return (
    //     <ReadingTestScreen
    //       exercisePrompt={exercisePrompt}
    //       timeRemaining={timer.secondsRemaining}
    //       formatTime={formatTime}
    //       answers={flow.answers}
    //       currentQuestionIndex={flow.currentQuestionIndex}
    //       onAnswerChange={flow.onAnswerChange}
    //       onExitTest={flow.openExitModal}
    //       onSubmit={flow.openSubmitModal}
    //       showSubmitModal={flow.showSubmitModal}
    //       setShowSubmitModal={flow.setShowSubmitModal}
    //       showExitModal={flow.showExitModal}
    //       setShowExitModal={flow.setShowExitModal}
    //       onConfirmSubmit={flow.confirmSubmit}
    //       onConfirmExit={flow.confirmExit}
    //     />
    //   );
    // }
  }

  // // Results Screen
  // if (flow.testState === "results") {
  //   return (
  //     <TestResultScreen
  //       userAnswers={flow.answers}
  //       exerciseAnswers={exerciseAnswers.correctAnswers}
  //       timeSpent={flow.timeSpent}
  //       onReturnToLibrary={() => navigate(browsePath)}
  //       onTakeAnotherTest={resetTest}
  //       onLogout={handleLogout}
  //     />
  //   );
  // }
}
