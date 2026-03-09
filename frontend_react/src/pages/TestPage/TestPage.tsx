import { useParams } from "react-router";

import {
  ListeningTestScreen,
  ReadingTestScreen,
  WritingTestScreen,
} from "./components/index.ts";

export function TestPage() {
  // =========================
  // Skill and exercise id from URL
  // =========================

  const { skill, exerciseId } = useParams();

  // Test Screen
  if (skill === "listening") {
    return <ListeningTestScreen exerciseId={exerciseId || ""} />;
  }

  if (skill === "reading") {
    return <ReadingTestScreen exerciseId={exerciseId || ""} />;
  }

  if (skill === "writing") {
    return <WritingTestScreen exerciseId={exerciseId || ""} />;
  }
}
