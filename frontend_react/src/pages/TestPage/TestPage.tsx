import { useNavigate, useParams } from "react-router";

import { useAuth } from "../../contexts/AuthContext.tsx";

import {
  TestInstructionScreen,
  ListeningTestScreen,
  TestResultScreen,
} from "./components/index.ts";

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

  const { skill, exerciseId } = useParams();

  // =========================
  // Test flow management
  // =========================

  const flow = useTestFlow({});

  // Instruction Screen
  if (flow.testState === "instruction") {
    return (
      <TestInstructionScreen skill={skill || ""} onGoToTest={flow.goToTest} />
    );
  }

  // Test Screen
  if (flow.testState === "test") {
    if (skill === "listening") {
      return (
        <ListeningTestScreen
          exerciseId={exerciseId || ""}
          onGoToResults={flow.goToResults}
        />
      );
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
