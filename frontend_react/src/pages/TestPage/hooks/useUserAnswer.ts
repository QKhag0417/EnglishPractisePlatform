import { useCallback, useEffect, useState } from "react";
import type { UserAnswers } from "../types";

type Args = { answerCount?: number };

export function useUserAnswer({ answerCount = 0 }: Args = {}) {
  const [answers, setAnswers] = useState<UserAnswers>({});

  useEffect(() => {
    setAnswers((prev) => {
      const next: UserAnswers = { ...prev };

      for (let i = 1; i <= answerCount; i++) {
        if (!(i in next)) {
          next[i] = [];
        }
      }

      return next;
    });
  }, [answerCount]);

  const onAnswerChange = useCallback((questionId: number, value: string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  return {
    answers,
    setAnswers,
    onAnswerChange,
  };
}
