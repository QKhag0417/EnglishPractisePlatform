import { Upload, X, Play, Pause, Check } from "lucide-react";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { useRef, useState, useEffect } from "react";

interface UploadAudioCardProps {
  audioPreview: string | null;
  audioSaved: boolean;

  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;

  onRemove: () => void;
  onSave: () => void;

  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function UploadAudioCard({
  audioPreview,
  audioSaved,
  onFileChange,
  onDrop,
  onDragOver,
  onRemove,
  onSave,
  inputRef,
}: UploadAudioCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleLoaded = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoaded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoaded);
    };
  }, [audioPreview]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white rounded-[12px] p-[24px] shadow-sm border border-gray-200">
      <Label className="font-['Inter'] font-semibold text-[16px] text-gray-900 mb-[16px] block">
        Upload Audio
      </Label>

      {!audioPreview ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-[8px] p-[32px] text-center hover:border-[#1977f3] hover:bg-blue-50/30 transition-colors cursor-pointer"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <Upload className="w-[48px] h-[48px] text-gray-400 mx-auto mb-[12px]" />

          <p className="font-['Inter'] text-[14px] text-gray-700 mb-[4px]">
            Drop file or browse
          </p>

          <p className="font-['Inter'] text-[12px] text-gray-500">
            Formats: .mp3, .wav
            <br />
            Max file size: 25 MB
          </p>

          <input
            type="file"
            ref={inputRef}
            onChange={onFileChange}
            className="hidden"
            accept=".mp3, .wav"
          />

          <Button
            onClick={() => inputRef.current?.click()}
            className="mt-[12px] bg-[#1977f3] hover:bg-[#1567d3] font-['Inter']"
          >
            Browse
          </Button>
        </div>
      ) : (
        <div>
          <div className="bg-gray-100 rounded-[8px] p-[16px] mb-[12px]">
            <div className="flex items-center gap-[12px]">
              <button
                onClick={togglePlay}
                className="w-[40px] h-[40px] bg-[#1977f3] hover:bg-[#1567d3] rounded-full flex items-center justify-center transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-[18px] h-[18px] text-white" />
                ) : (
                  <Play className="w-[18px] h-[18px] text-white ml-[2px]" />
                )}
              </button>

              <div className="flex-1">
                <div className="h-[4px] bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1977f3]"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex justify-between mt-[8px]">
                  <span className="font-['Inter'] text-[12px] text-gray-600">
                    {formatTime(currentTime)}
                  </span>
                  <span className="font-['Inter'] text-[12px] text-gray-600">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>
            </div>

            <audio ref={audioRef} src={audioPreview} hidden />
          </div>

          {!audioSaved ? (
            <Button
              onClick={onSave}
              className="w-full bg-[#1977f3] hover:bg-[#1567d3] font-['Inter'] text-[14px]"
              size="sm"
            >
              <Check className="w-[14px] h-[14px] mr-[6px]" />
              Save
            </Button>
          ) : (
            <Button
              onClick={() => {
                setIsPlaying(false);
                onRemove();
              }}
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400 font-['Inter'] text-[14px]"
              size="sm"
            >
              <X className="w-[14px] h-[14px] mr-[6px]" />
              Remove
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
