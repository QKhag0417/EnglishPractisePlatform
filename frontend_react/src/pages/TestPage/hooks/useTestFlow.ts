import { useCallback, useState } from "react";
import type { TestState, UserAnswers } from "../types";

type Args = {};

export function useTestFlow({}: Args) {
  const [testState, setTestState] = useState<TestState>("instruction");

  const goToTest = useCallback(() => {
    setTestState("test");
  }, []);

  const goToResults = useCallback(() => {
    setTestState("results");
  }, []);

  return {
    testState,
    setTestState,
    goToTest,
    goToResults,
  };
}
