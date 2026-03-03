import { useNavigate, useParams } from "react-router";

import {
  TestInstructionScreen,
  ListeningTestScreen,
} from "./components/index.ts";

import { useTestFlow } from "./hooks";

export function TestPage() {
  // =========================
  // Skill and exercise id from URL
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
}
