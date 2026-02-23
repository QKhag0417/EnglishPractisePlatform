import { useCallback, useState } from "react";
import type { TestState, UserAnswers } from "../types";

type Args = {
  onExitToLibrary: () => void;
};

export function useTestFlow({ onExitToLibrary }: Args) {
  const [testState, setTestState] = useState<TestState>("instruction");
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [testStartTime, setTestStartTime] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const startTest = useCallback(() => {
    setTestState("test");
    setTestStartTime(Date.now());
  }, []);

  const openExitModal = useCallback(() => setShowExitModal(true), []);
  const cancelExitModal = useCallback(() => setShowExitModal(false), []);

  const confirmExit = useCallback(() => {
    setShowExitModal(false);
    onExitToLibrary();
  }, [onExitToLibrary]);

  const openSubmitModal = useCallback(() => setShowSubmitModal(true), []);
  const cancelSubmitModal = useCallback(() => setShowSubmitModal(false), []);

  const confirmSubmit = useCallback(() => {
    setShowSubmitModal(false);
    const spent = testStartTime
      ? Math.floor((Date.now() - testStartTime) / 1000)
      : 0;
    setTimeSpent(spent);
    setTestState("results");
  }, [testStartTime]);

  const onAnswerChange = useCallback(
    (questionId: number, value: string | string[]) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    },
    [],
  );

  const resetFlow = useCallback((nextDurationSeconds: number) => {
    setTestState("instruction");
    setAnswers({});
    setTestStartTime(0);
    setTimeSpent(0);
    setShowSubmitModal(false);
    setShowExitModal(false);
    setCurrentQuestionIndex(0);
    // timer reset is handled by the countdown hook (called from page)
    void nextDurationSeconds;
  }, []);

  return {
    testState,
    setTestState,

    answers,
    onAnswerChange,

    timeSpent,

    showSubmitModal,
    setShowSubmitModal,
    showExitModal,
    setShowExitModal,

    currentQuestionIndex,
    setCurrentQuestionIndex,

    startTest,
    openExitModal,
    cancelExitModal,
    confirmExit,
    openSubmitModal,
    cancelSubmitModal,
    confirmSubmit,

    resetFlow,
  };
}
