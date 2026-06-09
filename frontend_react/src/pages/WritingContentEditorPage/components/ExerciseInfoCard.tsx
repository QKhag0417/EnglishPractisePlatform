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
import { TopicTag } from "../../ListeningContentEditorPage/types";
import { WritingQuestionType } from "../types";

interface ExerciseInfoCardProps {
  title: string;
  onTitleChange: (value: string) => void;
  task: string;
  onTaskChange: (value: string) => void;
  questionTypes: WritingQuestionType[];
  onQuestionTypesChange: (types: WritingQuestionType[]) => void;
  topicTags: TopicTag[];
  onTopicTagsChange: (tags: TopicTag[]) => void;
  updatedOn: string;
  durationMinutes: number;
  onDurationChange: (value: number) => void;
}

export function ExerciseInfoCard({
  title,
  onTitleChange,
  task,
  onTaskChange,
  questionTypes,
  onQuestionTypesChange,
  topicTags,
  onTopicTagsChange,
  updatedOn,
  durationMinutes,
  onDurationChange,
}: ExerciseInfoCardProps) {
  // =========================
  // Task options
  // =========================

  const taskOptions = [
    { value: "TASK_1", label: "Task 1" },
    { value: "TASK_2", label: "Task 2" },
  ];

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

        {/* Task */}
        <div>
          <Label className="font-['Inter'] text-[14px] text-gray-700 mb-[8px] block">
            Task
          </Label>

          <SelectV2
            value={task}
            onChange={onTaskChange}
            options={taskOptions}
            placeholder="Select a task"
            triggerClassName="min-h-[40px] h-auto px-[12px] py-[8px] bg-white border-gray-300 rounded-[8px] font-['Inter'] text-[14px] text-gray-900 shadow-none focus-visible:border-gray-300 focus-visible:ring-0"
          />
        </div>

        {/* Question Types */}
        <div>
          <Label className="font-['Inter'] text-[14px] text-gray-700 mb-[8px] block">
            Question Types
          </Label>
          <div className="pointer-events-none">
            <ChipInput
              value={questionTypes}
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
              value={topicTags}
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
            {1}
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
