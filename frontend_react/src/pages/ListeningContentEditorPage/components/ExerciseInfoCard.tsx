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

interface ExerciseInfoCardProps {
  title: string;
  onTitleChange: (value: string) => void;
  task: string;
  onTaskChange: (value: string) => void;
  questionTypeTags: string[];
  onQuestionTypeTagsChange: (tags: string[]) => void;
  topicTags: string[];
  onTopicTagsChange: (tags: string[]) => void;
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
            className="px-[12px] py-[10px] bg-gray-100 border border-gray-200 rounded-[8px] font-['Inter'] text-[14px] text-gray-900 h-auto"
          />
        </div>

        {/* Task */}
        <div>
          <Label className="font-['Inter'] text-[14px] text-gray-700 mb-[8px] block">
            Task
          </Label>
          <Select value={task} onValueChange={onTaskChange}>
            <SelectTrigger className="px-[12px] py-[10px] bg-gray-100 border border-gray-200 rounded-[8px] font-['Inter'] text-[14px] text-gray-900 h-auto">
              <SelectValue placeholder="Select a task" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TASK_1">Task 1</SelectItem>
              <SelectItem value="TASK_2">Task 2</SelectItem>
              <SelectItem value="TASK_3">Task 3</SelectItem>
              <SelectItem value="TASK_4">Task 4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Question Type Tags */}
        <div>
          <Label className="font-['Inter'] text-[14px] text-gray-700 mb-[8px] block">
            Question Type
          </Label>
          <div className="pointer-events-none">
            <ChipInput
              value={questionTypeTags}
              onChange={() => {}}
              placeholder="Add tag..."
              maxTags={4}
            />
          </div>
        </div>

        {/* Topic Tags */}
        <div>
          <Label className="font-['Inter'] text-[14px] text-gray-700 mb-[8px] block">
            Topic
          </Label>
          <ChipInput
            value={topicTags}
            onChange={onTopicTagsChange}
            placeholder="Add tag..."
            maxTags={4}
          />
        </div>

        {/* Updated On */}
        <div>
          <Label className="font-['Inter'] text-[14px] text-gray-700 mb-[8px] block">
            Updated On
          </Label>
          <Input
            type="date"
            value={updatedOn}
            readOnly
            className="px-[12px] py-[10px] bg-gray-100 border border-gray-200 rounded-[8px] font-['Inter'] text-[14px] text-gray-900 h-auto"
          />
        </div>

        {/* Questions Count */}
        <div>
          <Label className="font-['Inter'] text-[14px] text-gray-700 mb-[8px] block">
            Questions
          </Label>
          <div className="px-[12px] py-[10px] bg-gray-100 border border-gray-200 rounded-[8px] font-['Inter'] text-[14px] text-gray-900">
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
          />
        </div>
      </div>
    </div>
  );
}