import { useEffect, useMemo, useState } from "react";

type Args = {
  durationMinutes: number; // comes from prompt
  isRunning: boolean; // testState === "test"
  onExpire?: () => void; // open submit modal
  syncWhenNotRunning?: boolean; // default true
};

export function useSyncedCountdownTimer({
  durationMinutes,
  isRunning,
  onExpire,
  syncWhenNotRunning = true,
}: Args) {
  const initialSeconds = useMemo(() => {
    const mins = Number.isFinite(durationMinutes) ? durationMinutes : 0;
    return Math.max(0, mins) * 60;
  }, [durationMinutes]);

  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);

  // ✅ sync to new duration when NOT running (no page-level useEffect needed)
  useEffect(() => {
    if (!syncWhenNotRunning) return;
    if (!isRunning) setSecondsRemaining(initialSeconds);
  }, [initialSeconds, isRunning, syncWhenNotRunning]);

  // countdown tick
  useEffect(() => {
    if (!isRunning) return;
    if (secondsRemaining <= 0) return;

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

  const reset = (mins = durationMinutes) => {
    const next = Math.max(0, (Number.isFinite(mins) ? mins : 0) * 60);
    setSecondsRemaining(next);
  };

  return { secondsRemaining, setSecondsRemaining, reset, initialSeconds };
}
