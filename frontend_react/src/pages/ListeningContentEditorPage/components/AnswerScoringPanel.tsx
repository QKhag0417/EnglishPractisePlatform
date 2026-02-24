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

import { QuestionType, Option } from "../types";

interface Props {
  selectedQuestionNumber?: number;

  questionType: QuestionType;
  setQuestionType: (v: QuestionType) => void;

  options: Option[];
  setOptions: React.Dispatch<React.SetStateAction<Option[]>>;

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
  options,
  setOptions,
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
  // Option handlers
  // ========================

  const addOption = () => {
    const newOption: Option = {
      id: Date.now().toString(),
      text: "",
      feedback: "",
      isCorrect: false,
    };
    setOptions([...options, newOption]);
    markAsUnsaved();
  };

  const deleteOption = (id: string) => {
    if (options.length <= 2) return;
    setOptions(options.filter((o) => o.id !== id));
    markAsUnsaved();
  };

  const updateOption = (
    id: string,
    field: keyof Option,
    value: string | boolean,
  ) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, [field]: value } : opt)),
    );
    markAsUnsaved();
  };

  const setCorrectOption = (id: string) => {
    setOptions((prev) =>
      prev.map((opt) => ({ ...opt, isCorrect: opt.id === id })),
    );
    markAsUnsaved();
  };

  // ========================
  // Short text handlers
  // ========================

  const addCorrectAnswer = () => {
    if (!newAnswerInput.trim()) return;
    setCorrectAnswers([...correctAnswers, newAnswerInput.trim()]);
    setNewAnswerInput("");
    markAsUnsaved();
  };

  const removeCorrectAnswer = (index: number) => {
    setCorrectAnswers(correctAnswers.filter((_, i) => i !== index));
    markAsUnsaved();
  };

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
        <Label className="font-['Inter'] font-medium text-[14px] text-gray-700 mb-[8px] block">
          Question type
        </Label>

        <Select
          value={questionType}
          onValueChange={(v: QuestionType) => {
            setQuestionType(v);
            markAsUnsaved();
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="mcq-single">
              Multiple Choice – Single Correct
            </SelectItem>
            <SelectItem value="mcq-multiple">
              Multiple Choice – Multiple Correct
            </SelectItem>
            <SelectItem value="short-text">
              Short Text (auto-checked)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* MCQ */}
      {(questionType === "mcq-single" ||
        questionType === "mcq-multiple") && (
        <div className="space-y-[16px]">

          {/* Header row */}
          <div className="grid grid-cols-[60px_1fr_40px] gap-[12px] pb-[8px] border-b border-gray-200">
            <span className="font-['Inter'] font-medium text-[12px] text-gray-500 uppercase">
              Correct
            </span>
            <span className="font-['Inter'] font-medium text-[12px] text-gray-500 uppercase">
              Option Text
            </span>
            <span></span>
          </div>

          {options.map((option, index) => (
            <div
              key={option.id}
              className="grid grid-cols-[60px_1fr_40px] gap-[12px] items-start"
            >
              <div className="flex items-center justify-center pt-[10px]">
                {questionType === "mcq-single" ? (
                  <input
                    type="radio"
                    name="correct-option"
                    checked={option.isCorrect}
                    onChange={() => setCorrectOption(option.id)}
                    className="w-[18px] h-[18px] cursor-pointer"
                  />
                ) : (
                  <input
                    type="checkbox"
                    checked={option.isCorrect}
                    onChange={(e) =>
                      updateOption(option.id, "isCorrect", e.target.checked)
                    }
                    className="w-[18px] h-[18px] cursor-pointer"
                  />
                )}
              </div>

              <Input
                placeholder={`Option ${index + 1}`}
                value={option.text}
                onChange={(e) =>
                  updateOption(option.id, "text", e.target.value)
                }
              />

              <button
                onClick={() => deleteOption(option.id)}
                disabled={options.length <= 2}
                className="p-[8px] hover:bg-gray-100 rounded-[6px] transition-colors disabled:opacity-30 disabled:cursor-not-allowed mt-[2px]"
              >
                <Trash2 className="w-[16px] h-[16px] text-red-500" />
              </button>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addOption}
            className="w-full mt-[8px]"
          >
            <Plus className="w-[16px] h-[16px] mr-[8px]" />
            Add option
          </Button>
        </div>
      )}

      {/* Short Text */}
      {questionType === "short-text" && (
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
              Add multiple accepted variations (e.g., "Docklands",
              "Eastside Docklands")
            </p>
          </div>
        </div>
      )}

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
