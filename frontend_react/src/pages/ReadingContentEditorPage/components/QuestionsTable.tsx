import { Question } from "../types";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";

interface QuestionsTableProps {
  questions: Question[];
  selectedQuestionTempId: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function QuestionsTable({
  questions,
  selectedQuestionTempId,
  onSelect,
  onDelete,
  onAdd,
}: QuestionsTableProps) {
  return (
    <div className="bg-white rounded-[12px] p-[32px] shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-[20px]">
        <div className="flex items-center gap-[12px]">
          <h3 className="font-['Inter'] font-semibold text-[18px] text-gray-900">
            Questions
          </h3>
          <Badge variant="secondary" className="font-['Inter']">
            {questions.length}{" "}
            {questions.length === 1 ? "question" : "questions"}
          </Badge>
        </div>

        <Button
          onClick={onAdd}
          className="bg-[#1977f3] hover:bg-[#1567d3]"
          size="sm"
        >
          <Plus className="w-[16px] h-[16px] mr-[6px]" />
          Add Question
        </Button>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-[8px] overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[80px_140px_1fr_100px] gap-[16px] bg-gray-50 px-[20px] py-[12px] border-b border-gray-200">
          <span className="font-['Inter'] font-medium text-[12px] text-gray-600 uppercase">
            #
          </span>
          <span className="font-['Inter'] font-medium text-[12px] text-gray-600 uppercase">
            Type
          </span>
          <span className="font-['Inter'] font-medium text-[12px] text-gray-600 uppercase">
            Correct Answer
          </span>
          <span className="font-['Inter'] font-medium text-[12px] text-gray-600 uppercase text-center">
            Actions
          </span>
        </div>

        {/* Rows */}
        <div>
          {questions.map((question) => (
            <div
              key={question.tempId}
              onClick={() => onSelect(question.tempId)}
              className={`grid grid-cols-[80px_140px_1fr_100px] gap-[16px] px-[20px] py-[16px] border-b border-gray-200 last:border-b-0 cursor-pointer transition-colors ${
                selectedQuestionTempId === question.tempId
                  ? "bg-blue-50 border-l-4 border-l-[#1977f3]"
                  : "hover:bg-gray-50"
              }`}
            >
              <span className="font-['Inter'] text-[14px] text-gray-900">
                Q{question.number}
              </span>

              <span className="font-['Inter'] text-[14px] text-gray-700">
                {question.type}
              </span>

              <span className="font-['Inter'] text-[14px] text-gray-700 truncate">
                {question.correctAnswers && question.correctAnswers.length > 0
                  ? question.correctAnswers.join(", ")
                  : "(not set)"}
              </span>

              <div className="flex items-center justify-center gap-[8px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(question.tempId);
                  }}
                  className="p-[6px] hover:bg-white rounded-[4px] transition-colors"
                >
                  <Edit2 className="w-[16px] h-[16px] text-[#1977f3]" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(question.tempId);
                  }}
                  disabled={questions.length <= 1}
                  className="p-[6px] hover:bg-white rounded-[4px] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-[16px] h-[16px] text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
