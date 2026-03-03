import { NavBarLearner } from "../../components/NavBar";
import { Footer } from "../../components/Footer";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { useParams } from "react-router-dom";

import { formatTime, isAnswerCorrect, isAnswerEmpty } from "./utils";
import { use, useEffect } from "react";
import {
  useGetPracticeContentAnswers,
  useGetPracticeSubmission,
  useGetPracticeSubmissionAnswers,
} from "./hooks";

export function TestResultPage() {
  // =========================
  // Auth
  // =========================
  const { logout: onLogout } = useAuth();

  // =========================
  // Submission id from URL
  // =========================

  const { submissionId } = useParams();

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
  // Get practice submission answers data
  // =========================

  const getPracticeSubmissionAnswers = useGetPracticeSubmissionAnswers(
    submissionId || "",
  );

  useEffect(() => {
    if (!submissionId) return;
    getPracticeSubmissionAnswers.get();
  }, [submissionId, getPracticeSubmissionAnswers.get]);

  const userAnswersByIndex: Record<number, string[]> = {};
  (getPracticeSubmissionAnswers.answers ?? []).forEach((a) => {
    userAnswersByIndex[a.orderIndex] = a.answers ?? [];
  });

  // =========================
  // Get practice content answers data
  // =========================

  const practiceContentId = getPracticeSubmission.submission?.practiceContentId;

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - Using NavBarLearner */}
      <NavBarLearner onLogout={onLogout} />

      {/* Main Content - Add top padding to account for fixed navbar */}
      <div className="flex-1 pt-[66px]">
        <div className="max-w-[1000px] mx-auto p-8 space-y-6 w-full">
          {/* Summary Card */}
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
            <h2 className="font-['Inter'] font-bold text-[28px] text-[#dc3545] mb-6">
              Result
            </h2>

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
                  <span className="font-['Inter'] font-semibold text-[16px] text-gray-700">
                    Time Spent
                  </span>
                  <span className="font-['Inter'] font-bold text-[16px] text-black">
                    {formatTime(timeSpent)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-['Inter'] font-semibold text-[16px] text-[#28a745]">
                    Correct
                  </span>
                  <span className="font-['Inter'] text-[16px] text-gray-700">
                    {correctCount} sections
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-['Inter'] font-semibold text-[16px] text-[#dc3545]">
                    Wrong
                  </span>
                  <span className="font-['Inter'] text-[16px] text-gray-700">
                    {wrongCount} sections
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-['Inter'] font-semibold text-[16px] text-gray-500">
                    Skip
                  </span>
                  <span className="font-['Inter'] text-[16px] text-gray-700">
                    {skipCount} sections
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Results Card */}
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
            <h2 className="font-['Inter'] font-bold text-[28px] text-[#dc3545] mb-6">
              Result
            </h2>

            {/* Question Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {Object.keys(correctAnswersByIndex)
                .map(Number)
                .sort((a, b) => a - b)
                .map((questionNumber) => {
                  const userAnswer = userAnswersByIndex[questionNumber];
                  const correctAnswer = correctAnswersByIndex[questionNumber];

                  const empty = isAnswerEmpty(userAnswer);
                  const correct =
                    !empty && isAnswerCorrect(userAnswer, correctAnswer);

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

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center pb-8">
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-[#1977f3] hover:bg-[#1567d3] text-white rounded-lg font-['Inter'] font-semibold text-[14px] transition-colors"
            >
              Take the test again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-['Inter'] font-semibold text-[14px] transition-colors"
            >
              Return to Library
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
