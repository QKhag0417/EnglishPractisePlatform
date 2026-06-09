import { BookOpen, PauseCircle, PlayCircle, Volume2 } from "lucide-react";
import {
  useAudioPlayer,
  useGetListeningExercise,
  useGetReadingExercise,
} from "../hooks";
import { API_BASE } from "../../../env";
import { buildAudioUrl, formatAudioTime } from "../utils";
import { useEffect } from "react";
import { InstructionRendererSimplified } from ".";

type Props = {
  exerciseId: string;
};

export function ReviewReading({ exerciseId }: Props) {
  // =========================
  // Get Reading Exercise
  // =========================

  const getReadingExercise = useGetReadingExercise(exerciseId);

  useEffect(() => {
    if (!exerciseId) return;
    getReadingExercise.get();
  }, [exerciseId]);

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
            instruction={getReadingExercise.exercise?.instructionsParsed}
          />
        </div>

        {/* Right Side - Reading Passage */}
        <div className="bg-white flex flex-col max-h-[600px]">
          {/* Reading Passage - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200">
              <InstructionRendererSimplified
                instruction={getReadingExercise.exercise?.passageParsed}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
