import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Args = {
  durationMinutes: number;
};

export function useCountdownTimer({ durationMinutes }: Args) {
  const initialMs = useMemo(() => {
    const mins = Number.isFinite(durationMinutes) ? durationMinutes : 0;
    return Math.max(0, mins) * 60 * 1000;
  }, [durationMinutes]);

  const [secondsRemaining, setSecondsRemaining] = useState(
    Math.ceil(initialMs / 1000),
  );

  const [isExpired, setIsExpired] = useState(false);

  const endTimeRef = useRef<number | null>(null);
  const remainingMsRef = useRef(initialMs);

  const getElapsedMs = useCallback(() => {
    return Math.max(
      0,
      Math.min(initialMs, Math.round(initialMs - remainingMsRef.current)),
    );
  }, [initialMs]);

  useEffect(() => {
    if (initialMs <= 0) {
      remainingMsRef.current = 0;
      endTimeRef.current = null;
      setSecondsRemaining(0);
      setIsExpired(false);
      return;
    }

    remainingMsRef.current = initialMs;
    endTimeRef.current = performance.now() + initialMs;
    setSecondsRemaining(Math.ceil(initialMs / 1000));
    setIsExpired(false);

    const tick = () => {
      if (endTimeRef.current === null) return;

      const remaining = Math.max(0, endTimeRef.current - performance.now());
      remainingMsRef.current = remaining;
      setSecondsRemaining(Math.ceil(remaining / 1000));

      if (remaining <= 0) {
        setIsExpired(true);
        endTimeRef.current = null;
      }
    };

    tick();

    const timer = window.setInterval(tick, 250);

    return () => {
      window.clearInterval(timer);

      if (endTimeRef.current !== null) {
        remainingMsRef.current = Math.max(
          0,
          endTimeRef.current - performance.now(),
        );
        endTimeRef.current = null;
      }
    };
  }, [initialMs]);

  return { secondsRemaining, getElapsedMs, isExpired };
}
