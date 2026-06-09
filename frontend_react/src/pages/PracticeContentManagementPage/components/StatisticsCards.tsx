import { BookOpen, CheckCircle, FileCheck, FileClock } from "lucide-react";
import { PracticeContentMetadata } from "../types";

interface Props {
  contents: PracticeContentMetadata[];
}

export function StatisticsCards({ contents }: Props) {
  const totalContent = contents.length;
  const publishedCount = contents.filter(
    (content) => content.status === "Published",
  ).length;
  const draftCount = contents.filter(
    (content) => content.status === "Draft",
  ).length;
  const totalAttempts = contents.reduce(
    (sum, content) => sum + content.attempts,
    0,
  );

  return (
    <div className="grid grid-cols-4 gap-[24px] mb-[24px]">
      {/* Total Content */}
      <div className="bg-gray-50 rounded-[12px] p-[24px] border border-gray-200">
        <div className="flex items-center gap-[12px]">
          <div className="w-[48px] h-[48px] rounded-[10px] bg-gray-200 flex items-center justify-center">
            <BookOpen className="w-[24px] h-[24px] text-gray-700" />
          </div>
          <div>
            <p className="font-['Inter'] text-[12px] text-gray-500 uppercase">
              Total Content
            </p>
            <p className="font-['Inter'] text-[28px] font-semibold text-gray-900">
              {totalContent}
            </p>
          </div>
        </div>
      </div>

      {/* Published */}
      <div className="bg-green-50 rounded-[12px] p-[24px] border border-green-200">
        <div className="flex items-center gap-[12px]">
          <div className="w-[48px] h-[48px] rounded-[10px] bg-green-200 flex items-center justify-center">
            <CheckCircle className="w-[24px] h-[24px] text-green-700" />
          </div>
          <div>
            <p className="font-['Inter'] text-[12px] text-green-600 uppercase">
              Published
            </p>
            <p className="font-['Inter'] text-[28px] font-semibold text-green-900">
              {publishedCount}
            </p>
          </div>
        </div>
      </div>

      {/* Draft */}
      <div className="bg-orange-50 rounded-[12px] p-[24px] border border-orange-200">
        <div className="flex items-center gap-[12px]">
          <div className="w-[48px] h-[48px] rounded-[10px] bg-orange-200 flex items-center justify-center">
            <FileClock className="w-[24px] h-[24px] text-orange-700" />
          </div>
          <div>
            <p className="font-['Inter'] text-[12px] text-orange-600 uppercase">
              Draft
            </p>
            <p className="font-['Inter'] text-[28px] font-semibold text-orange-900">
              {draftCount}
            </p>
          </div>
        </div>
      </div>

      {/* Total Attempts */}
      <div className="bg-blue-50 rounded-[12px] p-[24px] border border-blue-200">
        <div className="flex items-center gap-[12px]">
          <div className="w-[48px] h-[48px] rounded-[10px] bg-blue-200 flex items-center justify-center">
            <FileCheck className="w-[24px] h-[24px] text-blue-700" />
          </div>
          <div>
            <p className="font-['Inter'] text-[12px] text-blue-600 uppercase">
              Total Attempts
            </p>
            <p className="font-['Inter'] text-[28px] font-semibold text-blue-900">
              {totalAttempts}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
