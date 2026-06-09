import { useCallback, useEffect, useRef, useState } from "react";

type Args = {
  audioUrl: string;
};

export function useAudioPlayer({ audioUrl }: Args) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // play/pause side-effect
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // reset when source changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    setIsPlaying(false);
    setAudioProgress(0);
    setCurrentTime(0);
    setDuration(0);
  }, [audioUrl]);

  const togglePlay = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const ct = audio.currentTime || 0;
    const d = audio.duration || 0;

    setCurrentTime(ct);
    setDuration(d);

    const pct = d > 0 ? (ct / d) * 100 : 0;
    setAudioProgress(pct);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(audio.duration || 0);
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const audio = audioRef.current;
      if (!audio || !duration) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.min(Math.max(x / rect.width, 0), 1);
      audio.currentTime = pct * duration;
    },
    [duration],
  );

  const resetAudio = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
    setAudioProgress(0);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  return {
    audioRef,
    isPlaying,
    togglePlay,
    audioProgress,
    currentTime,
    duration,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    handleSeek,
    resetAudio,
  };
}
