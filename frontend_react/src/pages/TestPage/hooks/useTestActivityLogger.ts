import { useCallback, useRef } from "react";
import type { LearnerTestActivity, LogActivityInput } from "../types";
import { toLocalDateTimeArray } from "../utils";

type Args = {
  getElapsedMs: () => number;
};

export function useTestActivityLogger({ getElapsedMs }: Args) {
  const queueRef = useRef<LearnerTestActivity[]>([]);

  const logActivity = useCallback(
    ({ activityType, questionNumber, value }: LogActivityInput) => {
      queueRef.current.push({
        activityType,
        questionNumber,
        value,
        offsetMs: getElapsedMs(),
      });
    },
    [getElapsedMs],
  );

  const clear = useCallback(() => {
    queueRef.current = [];
  }, []);

  const getQueuedActivities = useCallback(() => {
    return [...queueRef.current];
  }, []);

  return {
    logActivity,
    clear,
    getQueuedActivities,
  };
}
