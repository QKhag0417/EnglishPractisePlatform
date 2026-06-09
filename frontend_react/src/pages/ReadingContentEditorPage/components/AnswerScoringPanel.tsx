import { Plus, Trash2, X, Check, AlertCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import { ReadingQuestionType } from "../types";
import { SelectV2 } from "../../TutorDashboardPage/components";
import { TopicTag } from "../../ListeningContentEditorPage/types";

interface Props {
  selectedQuestionNumber?: number;

  questionType: ReadingQuestionType;
  setQuestionType: (v: ReadingQuestionType) => void;
  topicTag: TopicTag;
  setTopicTag: (v: TopicTag) => void;

  correctAnswers: string[];
  setCorrectAnswers: React.Dispatch<React.SetStateAction<string[]>>;

  newAnswerInput: string;
  setNewAnswerInput: (v: string) => void;

  saveState: "saved" | "unsaved" | "editing";

  markAsUnsaved: () => void;
  handleSaveQuestion: () => void;
  handleCancelQuestion: () => void;
}

export function AnswerScoringPanel({
  selectedQuestionNumber,
  questionType,
  setQuestionType,
  topicTag,
  setTopicTag,
  correctAnswers,
  setCorrectAnswers,
  newAnswerInput,
  setNewAnswerInput,
  saveState,
  markAsUnsaved,
  handleSaveQuestion,
  handleCancelQuestion,
}: Props) {
  // ========================
  // Add correct answer
  // ========================

  const addCorrectAnswer = () => {
    if (!newAnswerInput.trim()) return;
    setCorrectAnswers([...correctAnswers, newAnswerInput.trim()]);
    setNewAnswerInput("");
    markAsUnsaved();
  };

  // ========================
  // Remove correct answer
  // ========================

  const removeCorrectAnswer = (index: number) => {
    setCorrectAnswers(correctAnswers.filter((_, i) => i !== index));
    markAsUnsaved();
  };

  // =========================
  // Question type options
  // =========================
  const questionTypeOptions: { value: ReadingQuestionType; label: string }[] = [
    { value: "Multiple Choice", label: "Multiple Choice" },
    {
      value: "Identifying Information (True/False/Not Given)",
      label: "Identifying Information (True/False/Not Given)",
    },
    {
      value: "Identifying Writer's Views/Claims (Yes/No/Not Given)",
      label: "Identifying Writer's Views/Claims (Yes/No/Not Given)",
    },
    { value: "Matching Information", label: "Matching Information" },
    { value: "Matching Headings", label: "Matching Headings" },
    { value: "Matching Features", label: "Matching Features" },
    {
      value: "Matching Sentence Endings",
      label: "Matching Sentence Endings",
    },
    { value: "Sentence Completion", label: "Sentence Completion" },
    { value: "Summary Completion", label: "Summary Completion" },
    { value: "Note Completion", label: "Note Completion" },
    { value: "Table Completion", label: "Table Completion" },
    { value: "Flow-chart Completion", label: "Flow-chart Completion" },
    { value: "Diagram Label Completion", label: "Diagram Label Completion" },
    { value: "Short-answer Questions", label: "Short-answer Questions" },
  ];

  // =========================
  // Topic tag options
  // =========================

  const topicTagOptions: { value: TopicTag; label: string }[] = [
    { value: "Education and Learning", label: "Education and Learning" },
    { value: "Work, Jobs and Careers", label: "Work, Jobs and Careers" },
    {
      value: "Technology, Internet and AI",
      label: "Technology, Internet and AI",
    },
    {
      value: "Health, Healthcare and Lifestyle",
      label: "Health, Healthcare and Lifestyle",
    },
    {
      value: "Environment, Climate and Sustainability",
      label: "Environment, Climate and Sustainability",
    },
    {
      value: "Government, Law and Public Policy",
      label: "Government, Law and Public Policy",
    },
    {
      value: "Society, Social Behavior and Values",
      label: "Society, Social Behavior and Values",
    },
    {
      value: "Family, Children and Ageing",
      label: "Family, Children and Ageing",
    },
    {
      value: "Media, Advertising and Communication",
      label: "Media, Advertising and Communication",
    },
    {
      value: "Culture, Art, Traditions and Language",
      label: "Culture, Art, Traditions and Language",
    },
    {
      value: "Travel, Tourism and Transport",
      label: "Travel, Tourism and Transport",
    },
    {
      value: "Housing, Cities and Urban/Rural Life",
      label: "Housing, Cities and Urban/Rural Life",
    },
    {
      value: "Science, Research and Innovation",
      label: "Science, Research and Innovation",
    },
    {
      value: "Business, Economy and Consumer Behavior",
      label: "Business, Economy and Consumer Behavior",
    },
    {
      value: "Food, Agriculture and Farming",
      label: "Food, Agriculture and Farming",
    },
    {
      value: "Sport, Leisure and Hobbies",
      label: "Sport, Leisure and Hobbies",
    },
    {
      value: "History, Archaeology and Heritage",
      label: "History, Archaeology and Heritage",
    },
    {
      value: "Energy, Natural Resources and Infrastructure",
      label: "Energy, Natural Resources and Infrastructure",
    },
    {
      value: "Crime, Safety and Security",
      label: "Crime, Safety and Security",
    },
    {
      value: "Globalisation, Migration and International Development",
      label: "Globalisation, Migration and International Development",
    },
    {
      value: "Population and Demographics",
      label: "Population and Demographics",
    },
    { value: "Animals and Wildlife", label: "Animals and Wildlife" },
  ];

  return (
    <div className="bg-white rounded-[12px] p-[32px] shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-[20px]">
        <h3 className="font-['Inter'] font-semibold text-[18px] text-gray-900">
          Answer & Scoring
        </h3>

        {selectedQuestionNumber && (
          <div className="flex items-center gap-[8px]">
            <span className="font-['Inter'] text-[14px] text-gray-600">
              Editing:{" "}
              <span className="text-[#1977f3] font-medium">
                Question {selectedQuestionNumber}
              </span>
            </span>

            <span className="text-gray-400">·</span>

            {saveState === "saved" ? (
              <span className="flex items-center gap-[6px] font-['Inter'] text-[14px] text-green-600">
                <Check className="w-[14px] h-[14px]" />
                Saved
              </span>
            ) : (
              <span className="flex items-center gap-[6px] font-['Inter'] text-[14px] text-orange-600">
                <AlertCircle className="w-[14px] h-[14px]" />
                Unsaved changes
              </span>
            )}
          </div>
        )}
      </div>

      {/* Question Type */}
      <div className="mb-[24px]">
        <Label className="font-['Inter'] font-medium text-[14px] text-gray-700 mb-[12px] block">
          Question type
        </Label>

        <SelectV2
          value={questionType}
          onChange={(value) => {
            setQuestionType(value as ReadingQuestionType);
            markAsUnsaved();
          }}
          options={questionTypeOptions}
          placeholder="Question type"
        />
      </div>

      {/* Topic Tag */}
      <div className="mb-[24px]">
        <Label className="font-['Inter'] font-medium text-[14px] text-gray-700 mb-[12px] block">
          Topic tag
        </Label>

        <SelectV2
          value={topicTag}
          onChange={(value) => {
            setTopicTag(value as TopicTag);
            markAsUnsaved();
          }}
          options={topicTagOptions}
          placeholder="Topic tag"
        />
      </div>

      {/* Short Text */}
      <div className="space-y-[16px]">
        <div>
          <Label className="font-['Inter'] font-medium text-[14px] text-gray-700 mb-[8px] block">
            Correct answers
          </Label>

          <div className="flex flex-wrap gap-[8px] mb-[12px]">
            {correctAnswers.map((ans, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-[6px] bg-blue-100 text-blue-800 px-[12px] py-[6px] rounded-[6px] font-['Inter'] text-[14px]"
              >
                <span>{ans}</span>
                <button
                  onClick={() => removeCorrectAnswer(i)}
                  className="hover:bg-blue-200 rounded-full p-[2px] transition-colors"
                >
                  <X className="w-[14px] h-[14px]" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-[8px]">
            <Input
              placeholder="Type an answer and press Enter"
              value={newAnswerInput}
              onChange={(e) => setNewAnswerInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCorrectAnswer();
                }
              }}
            />
            <Button
              onClick={addCorrectAnswer}
              disabled={!newAnswerInput.trim()}
              className="bg-[#1977f3] hover:bg-[#1567d3]"
            >
              Add
            </Button>
          </div>

          <p className="font-['Inter'] text-[12px] text-gray-500 mt-[8px]">
            Add multiple accepted variations (e.g., "Docklands", "Eastside
            Docklands")
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-[24px] flex items-center gap-[12px]">
        <Button
          onClick={handleSaveQuestion}
          className="bg-[#1977f3] hover:bg-[#1567d3] font-['Inter']"
        >
          Save
        </Button>

        <Button
          onClick={handleCancelQuestion}
          className="bg-gray-200 hover:bg-gray-300 font-['Inter']"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
