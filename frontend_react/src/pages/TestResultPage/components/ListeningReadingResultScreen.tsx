import { NavBarLearner } from "../../../components/NavBar";
import { Footer } from "../../../components/Footer";
import { useAuth } from "../../../contexts/AuthContext.tsx";

import {
  formatTime,
  indexByOrderIndex,
  mapPracticeSkill,
  formatLocalDateTime,
} from "../utils";
import { useEffect } from "react";
import {
  useGetPracticeContentAnswers,
  useGetPracticeSubmission,
  useGetPracticeSubmissionAnswers,
  useGetPracticeContent,
  useGetUserData,
} from "../hooks";
import { CheckCircle, Clock, Key, Target, TrendingUp } from "lucide-react";

type Props = {
  submissionId: string;
};

export function ListeningReadingResultScreen({ submissionId }: Props) {
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
  // Get practice content answers data
  // =========================

  const getPracticeContentAnswers = useGetPracticeContentAnswers(
    practiceContentId || "",
  );

  useEffect(() => {
    if (!practiceContentId) return;
    getPracticeContentAnswers.get();
  }, [practiceContentId, getPracticeContentAnswers.get]);

  const correctAnswersByIndex: Record<number, string[]> = {};
  (getPracticeContentAnswers.answers ?? []).forEach((a) => {
    correctAnswersByIndex[a.orderIndex] = a.correctAnswers ?? [];
  });

  // =========================
  // Get practice submission answers data
  // =========================

  const getPracticeSubmissionAnswers = useGetPracticeSubmissionAnswers(
    submissionId || "",
  );

  useEffect(() => {
    if (!submissionId) return;
    getPracticeSubmissionAnswers.get();
  }, [submissionId, getPracticeSubmissionAnswers.get]);

  const submissionAnswersByIndex = indexByOrderIndex(
    getPracticeSubmissionAnswers.answers,
  );

  // =========================
  // Calculate summary data
  // =========================

  const correctCount =
    getPracticeSubmission.submission?.correctAnswerCount ?? 0;
  const wrongCount = getPracticeSubmission.submission?.wrongAnswerCount ?? 0;
  const skipCount = getPracticeSubmission.submission?.skipAnswerCount ?? 0;

  const totalQuestions = correctCount + wrongCount + skipCount;

  const percentage =
    totalQuestions === 0
      ? 0
      : Math.round((correctCount / totalQuestions) * 100);

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
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

      {/* Main Content - Add top padding to account for fixed navbar */}
      <div className="flex-1 pt-[24px] pb-[48px]">
        <div className="max-w-[1000px] mx-auto px-8 space-y-[24px] w-full">
          {/* Summary Card */}
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
            <div className="flex items-center gap-[10px] mb-[24px]">
              <TrendingUp className="w-[20px] h-[20px] text-[#f97316]" />
              <h2 className="font-['Inter'] font-semibold text-[20px] text-gray-900">
                Result
              </h2>
            </div>

            <div className="flex items-center justify-between">
              {/* Circular Progress */}
              <div className="flex items-center justify-center">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#dc3545"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - percentage / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-['Inter'] font-bold text-[32px] text-black">
                      {percentage}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex-1 ml-12 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-[8px]">
                    {" "}
                    <Clock className="w-[16px] h-[16px] text-gray-600" />
                    <span className="font-['Inter'] font-semibold text-[16px] text-gray-700">
                      Time Spent
                    </span>
                  </div>

                  <span className="font-['Inter'] font-bold text-[16px] text-black">
                    {formatTime(timeSpent)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-[8px]">
                    {" "}
                    <CheckCircle className="w-[16px] h-[16px] text-[#28a745]" />
                    <span className="font-['Inter'] font-semibold text-[16px] text-[#28a745]">
                      Correct
                    </span>
                  </div>

                  <span className="font-['Inter'] text-[16px] text-gray-700">
                    {correctCount} sections
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-[8px]">
                    {" "}
                    <Target className="w-[16px] h-[16px] text-[#dc3545]" />
                    <span className="font-['Inter'] font-semibold text-[16px] text-[#dc3545]">
                      Wrong
                    </span>
                  </div>

                  <span className="font-['Inter'] text-[16px] text-gray-700">
                    {wrongCount} sections
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-[8px]">
                    {" "}
                    <span className="w-[16px] h-[16px] flex items-center justify-center text-gray-500 font-bold">
                      ⊝
                    </span>
                    <span className="font-['Inter'] font-semibold text-[16px] text-gray-500">
                      Skip
                    </span>
                  </div>

                  <span className="font-['Inter'] text-[16px] text-gray-700">
                    {skipCount} sections
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Results Card */}
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
            <div className="flex items-center gap-[10px] mb-[24px]">
              {" "}
              <Key className="w-[20px] h-[20px] text-[#f59e0b]" />
              <h2 className="font-['Inter'] font-semibold text-[20px] text-gray-900">
                Answer Keys
              </h2>
            </div>

            {/* Question Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {Object.keys(correctAnswersByIndex)
                .map(Number)
                .sort((a, b) => a - b)
                .map((questionNumber) => {
                  const submissionAnswer =
                    submissionAnswersByIndex[questionNumber];
                  const userAnswer = submissionAnswer?.answers;
                  const correctAnswer = correctAnswersByIndex[questionNumber];

                  const result = submissionAnswer?.result ?? "SKIPPED";

                  const empty = result === "SKIPPED";
                  const correct = result === "CORRECT";
                  const wrong = result === "WRONG";

                  const formatAnswer = (v?: string | string[]) =>
                    v == null ? "" : Array.isArray(v) ? v.join(", ") : v;

                  return (
                    <div
                      key={questionNumber}
                      className="flex items-center gap-3"
                    >
                      {/* Question Number */}
                      <span className="font-['Inter'] font-bold text-[16px] text-black w-6">
                        {questionNumber}
                      </span>

                      {/* User Answer or Empty */}
                      {empty ? (
                        <span className="font-['Inter'] text-[14px] text-gray-400">
                          (empty)
                        </span>
                      ) : correct ? (
                        <>
                          <span className="text-[#28a745] text-[16px]">✓</span>
                          <span className="font-['Inter'] text-[16px] text-black">
                            {formatAnswer(correctAnswer)}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-[#dc3545] text-[16px]">✕</span>
                          <span className="font-['Inter'] text-[14px] text-gray-400 line-through">
                            {formatAnswer(userAnswer)}
                          </span>
                          <span className="font-['Inter'] text-[16px] text-[#28a745]">
                            {formatAnswer(correctAnswer)}
                          </span>
                        </>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
