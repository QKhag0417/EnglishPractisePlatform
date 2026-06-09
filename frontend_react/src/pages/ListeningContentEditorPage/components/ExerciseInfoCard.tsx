import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { ChipInput } from "../../../components/ChipInput";
import { SelectV2 } from "../../TutorDashboardPage/components";
import {
  BackendListeningQuestionType,
  BackendTopicTag,
  mapListeningApiTypeToUi,
  mapTopicTagApiToUi,
  TopicTag,
} from "../types";
import { useEffect } from "react";

interface ExerciseInfoCardProps {
  title: string;
  onTitleChange: (value: string) => void;
  task: string;
  onTaskChange: (value: string) => void;
  questionTypeTags: BackendListeningQuestionType[];
  onQuestionTypeTagsChange: (tags: BackendListeningQuestionType[]) => void;
  topicTags: BackendTopicTag[];
  onTopicTagsChange: (tags: BackendTopicTag[]) => void;
  updatedOn: string;
  questionsCount: number;
  durationMinutes: number;
  onDurationChange: (value: number) => void;
}

export function ExerciseInfoCard({
  title,
  onTitleChange,
  task,
  onTaskChange,
  questionTypeTags,
  onQuestionTypeTagsChange,
  topicTags,
  onTopicTagsChange,
  updatedOn,
  questionsCount,
  durationMinutes,
  onDurationChange,
}: ExerciseInfoCardProps) {
  // =========================
  // Defaulting Task to ALL since Task is not needed for Listening
  // =========================

  useEffect(() => {
    if (!task) {
      onTaskChange("ALL");
    }
  }, [task, onTaskChange]);

  return (
    <div className="bg-white rounded-[12px] p-[24px] shadow-sm border border-gray-200">
      <Label className="font-['Inter'] font-semibold text-[16px] text-gray-900 mb-[20px] block">
        Exercise Info
      </Label>

      <div className="space-y-[16px]">
        {/* Title */}
        <div>
          <Label className="font-['Inter'] text-[14px] text-gray-700 mb-[8px] block">
            Title
          </Label>
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter exercise title…"
            className="w-full min-h-[40px] px-[12px] py-[8px] bg-white border border-gray-300 rounded-[8px] font-['Inter'] text-[14px] text-gray-900 outline-none"
          />
        </div>

        {/* Question Type Tags */}
        <div>
          <Label className="font-['Inter'] text-[14px] text-gray-700 mb-[8px] block">
            Question Type
          </Label>
          <div className="pointer-events-none">
            <ChipInput
              value={questionTypeTags.map(mapListeningApiTypeToUi)}
              onChange={() => {}}
              placeholder="Add tag..."
              maxTags={100}
            />
          </div>
        </div>

        {/* Topic Tags */}
        <div>
          <Label className="font-['Inter'] text-[14px] text-gray-700 mb-[8px] block">
            Topic
          </Label>
          <div className="pointer-events-none">
            <ChipInput
              value={topicTags.map(mapTopicTagApiToUi)}
              onChange={() => {}}
              placeholder="Add tag..."
              maxTags={100}
            />
          </div>
        </div>

        {/* Updated On */}
        <div>
          <Label className="font-['Inter'] text-[14px] text-gray-700 mb-[8px] block">
            Updated On
          </Label>
          <div className="w-full min-h-[40px] px-[12px] py-[8px] bg-gray-100 border border-gray-300 rounded-[8px] font-['Inter'] text-[14px] text-gray-900">
            {updatedOn.replace(/^(\d{4})-(\d{2})-(\d{2})$/, "$2/$3/$1")}
          </div>
        </div>

        {/* Questions Count */}
        <div>
          <Label className="font-['Inter'] text-[14px] text-gray-700 mb-[8px] block">
            Questions
          </Label>
          <div className="w-full min-h-[40px] px-[12px] py-[8px] bg-gray-100 border border-gray-300 rounded-[8px] font-['Inter'] text-[14px] text-gray-900">
            {questionsCount}
          </div>
        </div>

        {/* Duration */}
        <div>
          <Label className="font-['Inter'] text-[14px] text-gray-700 mb-[8px] block">
            Duration (minutes)
          </Label>
          <Input
            type="number"
            value={durationMinutes}
            onChange={(e) => onDurationChange(Number(e.target.value))}
            min="1"
            className="w-full min-h-[40px] px-[12px] py-[8px] bg-white border border-gray-300 rounded-[8px] font-['Inter'] text-[14px] text-gray-900 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
