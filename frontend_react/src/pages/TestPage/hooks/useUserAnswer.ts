import { useCallback, useState } from "react";
import type { UserAnswers } from "../types";

type Args = {};

export function useUserAnswer({}: Args = {}) {
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const onAnswerChange = useCallback(
    (questionId: number, value: string | string[]) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    },
    [],
  );

  return {
    answers,
    setAnswers,
    onAnswerChange,
    currentQuestionIndex,
    setCurrentQuestionIndex,
  };
}
