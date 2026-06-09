import { BookOpen, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { PracticeContentMetadata } from "../types";
import { getSkillColor, getStatusColor } from "../../TutorDashboardPage/utils";

interface Props {
  contents: PracticeContentMetadata[];
  onEdit: (content: PracticeContentMetadata) => void;
  onDelete: (id: string) => void;
}

export function PracticeContentTable({ contents, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-[12px] border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-[2fr_140px_120px_90px_90px_100px_100px_120px] gap-[20px] bg-gray-50 px-[24px] py-[16px] border-b border-gray-200">
        <span className="font-['Inter'] font-semibold text-[12px] text-gray-600 uppercase">
          Title
        </span>
        <span className="font-['Inter'] font-semibold text-[12px] text-gray-600 uppercase">
          Skill
        </span>
        <span className="font-['Inter'] font-semibold text-[12px] text-gray-600 uppercase">
          Updated On
        </span>
        <span className="font-['Inter'] font-semibold text-[12px] text-gray-600 uppercase">
          Questions
        </span>
        <span className="font-['Inter'] font-semibold text-[12px] text-gray-600 uppercase">
          Duration
        </span>
        <span className="font-['Inter'] font-semibold text-[12px] text-gray-600 uppercase">
          Attempts
        </span>
        <span className="font-['Inter'] font-semibold text-[12px] text-gray-600 uppercase">
          Status
        </span>
        <span className="font-['Inter'] font-semibold text-[12px] text-gray-600 uppercase text-center">
          Actions
        </span>
      </div>

      {/* Table Body */}
      <div>
        {contents.length === 0 ? (
          <div className="px-[24px] py-[60px] text-center">
            <BookOpen className="w-[48px] h-[48px] text-gray-400 mx-auto mb-[16px]" />

            <p className="font-['Inter'] text-[16px] text-gray-600 mb-[4px]">
              No content found
            </p>

            <p className="font-['Inter'] text-[14px] text-gray-500">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          contents.map((content) => (
            <div
              key={content.id}
              className="grid grid-cols-[2fr_140px_120px_90px_90px_100px_100px_120px] gap-[20px] px-[24px] py-[20px] border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
            >
              {/* Title */}
              <div className="min-w-0">
                <p
                  className="font-['Inter'] text-[14px] text-gray-900 font-medium truncate"
                  title={content.title}
                >
                  {content.title}
                </p>
              </div>

              {/* Skill */}
              <div>
                <Badge
                  className={`${getSkillColor(content.skill)} font-['Inter'] text-[14px] w-fit px-[12px]`}
                >
                  {content.skill}
                </Badge>
              </div>

              {/* Updated On */}
              <div>
                <p className="font-['Inter'] text-[14px] text-gray-700">
                  {content.updatedOn
                    ? new Date(content.updatedOn).toLocaleDateString()
                    : ""}
                </p>
              </div>

              {/* Questions */}
              <div>
                <p className="font-['Inter'] text-[14px] text-gray-700">
                  {content.questions}
                </p>
              </div>

              {/* Duration */}
              <div>
                <p className="font-['Inter'] text-[14px] text-gray-700">
                  {content.duration} min
                </p>
              </div>

              {/* Attempts */}
              <div>
                <p className="font-['Inter'] text-[14px] text-gray-700">
                  {content.attempts}
                </p>
              </div>

              {/* Status */}
              <div>
                <Badge
                  className={`${getStatusColor(content.status)} font-['Inter'] text-[14px] w-fit px-[12px]`}
                >
                  {content.status}
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-[8px]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(content)}
                  className="font-['Inter']"
                >
                  <Pencil className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(content.id)}
                  className="font-['Inter']"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
