import { BookOpen, PauseCircle, PlayCircle, Volume2 } from "lucide-react";
import { useAudioPlayer, useGetListeningExercise } from "../hooks";
import { API_BASE } from "../../../env";
import { buildAudioUrl, formatAudioTime } from "../utils";
import { useEffect } from "react";
import { InstructionRendererSimplified } from ".";

type Props = {
  exerciseId: string;
};

export function ReviewListening({ exerciseId }: Props) {
  // =========================
  // Get Listening Exercise
  // =========================

  const getListeningExercise = useGetListeningExercise(exerciseId);

  useEffect(() => {
    if (!exerciseId) return;
    getListeningExercise.get();
  }, [exerciseId]);

  // =========================
  // Audio Player
  // =========================

  const audioPlayer = useAudioPlayer({
    audioUrl: getListeningExercise.exercise?.audioUrl || "",
  });

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-white p-6 border-b border-gray-200">
        <div className="flex items-center gap-[10px]">
          <BookOpen className="w-[20px] h-[20px] text-[#1977f3]" />
          <h2 className="font-['Inter'] font-semibold text-[20px] text-gray-900">
            Review & Explanations
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-gray-200">
        {/* Left Side - Your Answers */}
        <div className="p-8 bg-white max-h-[600px] overflow-y-auto">
          <InstructionRendererSimplified
            instruction={getListeningExercise.exercise?.instructionsParsed}
          />
        </div>

        {/* Right Side - Audio Player & Script */}
        <div className="bg-white flex flex-col max-h-[600px]">
          {/* Audio Player - Fixed at top, full width */}
          <div className="bg-white px-6 py-4 border-b border-gray-200 flex-shrink-0">
            {/* Hidden audio element */}
            <audio
              ref={audioPlayer.audioRef}
              src={buildAudioUrl(
                API_BASE,
                getListeningExercise.exercise.audioUrl || "",
              )}
              preload="metadata"
              onLoadedMetadata={audioPlayer.handleLoadedMetadata}
              onTimeUpdate={audioPlayer.handleTimeUpdate}
              onEnded={audioPlayer.handleEnded}
            />

            <div className="flex items-center gap-4">
              <button
                onClick={audioPlayer.togglePlay}
                className="w-[44px] h-[44px] rounded-full bg-[#1977f3] hover:bg-[#1567d3] flex items-center justify-center transition-colors flex-shrink-0"
              >
                {audioPlayer.isPlaying ? (
                  <PauseCircle className="w-[24px] h-[24px] text-white" />
                ) : (
                  <PlayCircle className="w-[24px] h-[24px] text-white" />
                )}
              </button>

              {/* Progress Bar */}
              <div
                className="flex-1 h-2 bg-gray-200 rounded-full cursor-pointer"
                onClick={audioPlayer.handleSeek}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(audioPlayer.audioProgress)}
              >
                <div
                  className="h-2 bg-[#1977f3] rounded-full transition-all"
                  style={{ width: `${audioPlayer.audioProgress}%` }}
                />
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Volume2 className="w-[18px] h-[18px] text-gray-600" />
                <span className="font-['Inter'] text-[14px] text-gray-900 font-medium min-w-[80px] text-right whitespace-nowrap">
                  {formatAudioTime(audioPlayer.currentTime)} /{" "}
                  {formatAudioTime(audioPlayer.duration)}
                </span>
              </div>
            </div>
          </div>

          {/* Audio Script - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="mb-4">
                <InstructionRendererSimplified
                  instruction={getListeningExercise.exercise?.transcriptParsed}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
