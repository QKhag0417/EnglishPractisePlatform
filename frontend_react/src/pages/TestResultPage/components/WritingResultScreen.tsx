import { NavBarLearner } from "../../../components/NavBar";
import { Footer } from "../../../components/Footer";
import { useAuth } from "../../../contexts/AuthContext.tsx";
import { useEffect } from "react";
import {
  useGetPracticeContent,
  useGetPracticeSubmission,
  useGetUserData,
  useGetWritingAnswer,
} from "../hooks/index.ts";
import {
  formatLocalDateTime,
  formatTaskLabel,
  formatTimeVerbose,
  mapPracticeSkill,
} from "../utils/index.ts";
import {
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  PenSquare,
} from "lucide-react";
import { InstructionRendererSimplified } from "./InstructionRendererSimplified.tsx";

type Props = {
  submissionId: string;
};

export function WritingResultScreen({ submissionId }: Props) {
  // =========================
  // Auth
  // =========================

  const { logout: onLogout } = useAuth();

  // =========================
  // Get practice submission data
  // =========================

  const getPracticeSubmission = useGetPracticeSubmission(submissionId || "");

  useEffect(() => {
    if (!submissionId) return;
    getPracticeSubmission.get();
  }, [submissionId, getPracticeSubmission.get]);

  const timeSpent = getPracticeSubmission.submission?.timeSpentSeconds ?? 0;

  // =========================
  // Get exercise data
  // =========================

  const practiceContentId = getPracticeSubmission.submission?.practiceContentId;

  const getPracticeContent = useGetPracticeContent(practiceContentId || "");

  useEffect(() => {
    if (!practiceContentId) return;
    getPracticeContent.get();
  }, [practiceContentId, getPracticeContent.get]);

  // =========================
  // Get practice submission answers data
  // =========================

  const getWritingAnswer = useGetWritingAnswer(submissionId || "");

  useEffect(() => {
    if (!submissionId) return;
    getWritingAnswer.get();
  }, [submissionId, getWritingAnswer.get]);

  const writingAnswer = getWritingAnswer.writingAnswers?.[0];

  // =========================
  // Get user data
  // =========================

  const userId = getPracticeSubmission.submission?.userId;

  const getUserData = useGetUserData(userId || "");

  useEffect(() => {
    if (!userId) return;
    getUserData.get();
  }, [userId, getUserData.get]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header - Using NavBarLearner */}
      <NavBarLearner onLogout={onLogout} />

      {/* Header Section */}
      <div className="pt-[80px] pb-[20px] px-[60px] bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center justify-between">
            {/* Left */}
            <div>
              <div className="flex items-center gap-[12px] mb-[4px]">
                <h1 className="font-['Inter'] text-[28px] text-gray-900">
                  {getPracticeContent.practiceContent?.title}
                </h1>
              </div>
              <p className="font-['Inter'] text-[14px] text-gray-600">
                {mapPracticeSkill(getPracticeContent.practiceContent?.skill)} •{" "}
                {formatLocalDateTime(
                  getPracticeSubmission.submission?.submittedAt,
                )}
              </p>
            </div>

            {/* Right */}
            <div className="text-right">
              <p className="font-['Inter'] text-[28px] text-gray-900 mb-[4px]">
                {getUserData.userData?.firstname}{" "}
                {getUserData.userData?.lastname}
              </p>
              <p className="font-['Inter'] text-[14px] text-gray-600 leading-none">
                {getUserData.userData?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-[24px] px-[60px]">
        <div className="max-w-[1400px] mx-auto">
          {/* Test Information Cards */}
          <div className="grid grid-cols-3 gap-[24px] mb-[24px]">
            {/* Time Taken */}
            <div className="bg-white rounded-[12px] p-[24px] shadow-sm border border-gray-200">
              <div className="flex items-center gap-[12px] mb-[8px]">
                <div className="w-[40px] h-[40px] rounded-[8px] bg-blue-100 flex items-center justify-center">
                  <Clock className="w-[20px] h-[20px] text-[#1977f3]" />
                </div>
                <div>
                  <p className="font-['Inter'] text-[12px] text-gray-500 uppercase">
                    Time Taken
                  </p>
                  <p className="font-['Inter'] text-[20px] font-semibold text-gray-900">
                    {formatTimeVerbose(timeSpent)}
                  </p>
                </div>
              </div>
            </div>

            {/* Word Count */}
            <div className="bg-white rounded-[12px] p-[24px] shadow-sm border border-gray-200">
              <div className="flex items-center gap-[12px] mb-[8px]">
                <div className="w-[40px] h-[40px] rounded-[8px] bg-purple-100 flex items-center justify-center">
                  <BookOpen className="w-[20px] h-[20px] text-purple-600" />
                </div>
                <div>
                  <p className="font-['Inter'] text-[12px] text-gray-500 uppercase">
                    Word Count
                  </p>
                  <p className="font-['Inter'] text-[20px] font-semibold text-gray-900">
                    {writingAnswer?.wordCount} words
                  </p>
                </div>
              </div>
            </div>

            {/* Task Type */}
            <div className="bg-white rounded-[12px] p-[24px] shadow-sm border border-gray-200">
              <div className="flex items-center gap-[12px] mb-[8px]">
                <div className="w-[40px] h-[40px] rounded-[8px] bg-orange-100 flex items-center justify-center">
                  <CheckCircle className="w-[20px] h-[20px] text-orange-600" />
                </div>
                <div>
                  <p className="font-['Inter'] text-[12px] text-gray-500 uppercase">
                    Task Type
                  </p>
                  <p className="font-['Inter'] text-[20px] font-semibold text-gray-900">
                    {formatTaskLabel(getPracticeContent.practiceContent?.task)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-[24px]">
            {/* Task Instructions */}
            <div className="bg-white rounded-[12px] p-[32px] shadow-sm border border-gray-200 mb-[24px]">
              <div className="flex items-center gap-[10px] mb-[24px]">
                <FileText className="w-[20px] h-[20px] text-[#3b82f6]" />
                <h2 className="font-['Inter'] font-semibold text-[20px] text-gray-900">
                  Task Instructions
                </h2>
              </div>
              <div className="bg-gray-50 rounded-[8px] p-[20px] border border-gray-200">
                <InstructionRendererSimplified
                  instruction={
                    getPracticeContent.practiceContent?.instructionsParsed
                  }
                />
              </div>
            </div>

            {/* Your Answer */}
            <div className="bg-white rounded-[12px] p-[32px] shadow-sm border border-gray-200">
              <div className="flex items-center gap-[10px] mb-[24px]">
                <PenSquare className="w-[20px] h-[20px] text-[#8b5cf6]" />
                <h2 className="font-['Inter'] font-semibold text-[20px] text-gray-900">
                  Your Answer
                </h2>
              </div>
              <div className="bg-gray-50 rounded-[8px] p-[20px] border border-gray-200 max-h-[400px] overflow-y-auto">
                {writingAnswer?.essayText &&
                writingAnswer?.essayText.trim().length > 0 ? (
                  <p className="font-['Inter'] text-[14px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {writingAnswer?.essayText}
                  </p>
                ) : (
                  <p className="font-['Inter'] text-[14px] text-gray-400 italic">
                    No answer provided
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
