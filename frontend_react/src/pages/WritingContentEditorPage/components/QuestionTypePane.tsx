import { useState } from "react";
import { Label } from "../../../components/ui/label";
import { SelectV2 } from "../../TutorDashboardPage/components";
import { Button } from "../../../components/ui/button";
import { WritingQuestionType } from "../types";

interface Props {
  questionTypes: WritingQuestionType[];
  onQuestionTypesChange: (types: WritingQuestionType[]) => void;
}

export function QuestionTypePane({
  questionTypes,
  onQuestionTypesChange,
}: Props) {
  // =========================
  // Question type state
  // =========================

  const [questionType, setQuestionType] =
    useState<WritingQuestionType>("Line Graph");

  // =========================
  // Handle add question type
  // =========================

  const handleAddQuestionType = () => {
    if (!questionType) return;
    if (questionTypes.includes(questionType)) return;

    onQuestionTypesChange([...questionTypes, questionType]);
  };

  // =========================
  // Handle remove question type
  // =========================

  const handleRemoveQuestionType = () => {
    onQuestionTypesChange(
      questionTypes.filter((type) => type !== questionType),
    );
  };

  // =========================
  // Question type options
  // =========================

  const questionTypeOptions: { value: WritingQuestionType; label: string }[] = [
    { value: "Line Graph", label: "Line Graph" },
    { value: "Bar Chart", label: "Bar Chart" },
    { value: "Pie Chart", label: "Pie Chart" },
    { value: "Table", label: "Table" },
    { value: "Process Diagram", label: "Process Diagram" },
    { value: "Map", label: "Map" },
    { value: "Mixed Visuals", label: "Mixed Visuals" },
    { value: "Agree-Disagree", label: "Agree-Disagree" },
    { value: "Opinion", label: "Opinion" },
    { value: "Discussion", label: "Discussion" },
    { value: "Problem-Solution", label: "Problem-Solution" },
    {
      value: "Advantages-Disadvantages",
      label: "Advantages-Disadvantages",
    },
    { value: "Two-part Question", label: "Two-part Question" },
  ];

  return (
    <div className="bg-white rounded-[12px] p-[32px] shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-[20px]">
        <h3 className="font-['Inter'] font-semibold text-[18px] text-gray-900">
          Select Question Types
        </h3>
      </div>

      <div className="mb-[8px]">
        <Label className="font-['Inter'] font-medium text-[14px] text-gray-700 mb-[12px] block">
          Question type
        </Label>

        <div className="flex gap-[8px]">
          <SelectV2
            value={questionType}
            onChange={(value) => {
              setQuestionType(value as WritingQuestionType);
            }}
            options={questionTypeOptions}
            placeholder="Question type"
          />

          <Button
            onClick={handleAddQuestionType}
            disabled={questionTypes.includes(questionType)}
            className="bg-[#1977f3] hover:bg-[#1567d3]"
          >
            Add
          </Button>

          <Button
            onClick={handleRemoveQuestionType}
            disabled={!questionTypes.includes(questionType)}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
