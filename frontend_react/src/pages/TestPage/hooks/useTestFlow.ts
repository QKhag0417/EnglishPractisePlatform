import { useCallback, useState } from "react";
import type { TestState, UserAnswers } from "../types";

type Args = {};

export function useTestFlow({}: Args) {
  const [testState, setTestState] = useState<TestState>("instruction");

  const startTest = useCallback(() => {
    setTestState("test");
  }, []);

  const submitTest = useCallback(() => {
    setTestState("results");
  }, []);

  return {
    testState,
    setTestState,
    startTest,
    submitTest,
  };
}
