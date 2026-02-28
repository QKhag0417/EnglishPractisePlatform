import { useEffect, useMemo, useState } from "react";

type Args = {
  durationMinutes: number;
  isRunning: boolean;
  onExpire?: () => void;
};

export function useCountdownTimer({
  durationMinutes,
  isRunning,
  onExpire,
}: Args) {
  const initialSeconds = useMemo(() => {
    const mins = Number.isFinite(durationMinutes) ? durationMinutes : 0;
    return Math.max(0, mins) * 60;
  }, [durationMinutes]);

  const [secondsRemaining, setSecondsRemaining] = useState(0);

  // Check if countdown timer should start
  useEffect(() => {
    if (isRunning) {
      setSecondsRemaining(initialSeconds);
    }
  }, [isRunning, initialSeconds]);

  // Countdown tick
  useEffect(() => {
    if (!isRunning) return;

    const timer = window.setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, secondsRemaining, onExpire]);

  return { secondsRemaining, setSecondsRemaining };
}
