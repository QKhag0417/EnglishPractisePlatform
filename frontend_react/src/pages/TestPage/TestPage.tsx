import { useNavigate, useParams } from "react-router";

import {
  TestInstructionScreen,
  ListeningTestScreen,
} from "./components/index.ts";

import { useTestFlow } from "./hooks";
import { ReadingTestScreen } from "./components/ReadingTestScreen.tsx";

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

    if (skill === "reading") {
      return <ReadingTestScreen exerciseId={exerciseId || ""} />;
    }
  }
}
