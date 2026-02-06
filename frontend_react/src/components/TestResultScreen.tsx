import { Page } from "../App";
import { NavBarLearner } from "./NavBar";
import { Footer } from "./Footer";
import {
  ExerciseAnswers,
  mockExerciseAnswers,
} from "../mocks/exerciseAnswers.mock";
import { useState } from "react";

interface TestResultScreenProps {
  userAnswers: Record<number, string | string[]>;
  timeSpent: number; // in seconds
  onReturnToLibrary: () => void;
  onTakeAnotherTest: () => void;
  setCurrentPage: (page: Page) => void;
  onLogout?: () => void;
}

export function TestResultScreen({
  userAnswers,
  timeSpent,
  onReturnToLibrary,
  onTakeAnotherTest,
  setCurrentPage,
  onLogout,
}: TestResultScreenProps) {
  // TODO: Fetch exercise answers based on exerciseId and learnerId
  const [exerciseAnswer, setExerciseAnswer] =
    useState<ExerciseAnswers>(mockExerciseAnswers);

  const normalizeOne = (v: string) =>
    v.trim().toLowerCase().replace(/\s+/g, " ");

  const normalizeValue = (v?: string | string[]) => {
    if (v == null) return [];
    const arr = Array.isArray(v) ? v : [v];
    return arr.map(normalizeOne).filter(Boolean);
  };

  const isAnswerEmpty = (v?: string | string[]) =>
    normalizeValue(v).length === 0;

  const isCorrect = (
    user: string | string[] | undefined,
    correct: string | string[] | undefined,
  ) => {
    const u = normalizeValue(user);
    const c = normalizeValue(correct);
    if (u.length === 0 || c.length === 0) return false;

    // If both are arrays -> treat as multi-select, require exact match (order-insensitive)
    if (Array.isArray(user) && Array.isArray(correct)) {
      if (u.length !== c.length) return false;
      const us = [...u].sort();
      const cs = [...c].sort();
      return us.every((val, i) => val === cs[i]);
    }

    // Otherwise, accept any matching option
    return u.some((ua) => c.includes(ua));
  };

  const correctAnswers = exerciseAnswer.correctAnswers;

  const totalQuestions = Object.keys(correctAnswers).length;

  let correctCount = 0;
  let wrongCount = 0;
  let skipCount = 0;

  for (const [qStr, correctVal] of Object.entries(correctAnswers)) {
    const qNum = Number(qStr);
    const userVal = userAnswers[qNum];

    if (isAnswerEmpty(userVal)) {
      skipCount += 1;
    } else if (isCorrect(userVal, correctVal)) {
      correctCount += 1;
    } else {
      wrongCount += 1;
    }
  }

  const percentage =
    totalQuestions === 0
      ? 0
      : Math.round((correctCount / totalQuestions) * 100);

  // Format time
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - Using NavBarLearner */}
      <NavBarLearner setCurrentPage={setCurrentPage} onLogout={onLogout} />

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
                    Testing time
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
              {Object.keys(correctAnswers)
                .map(Number)
                .sort((a, b) => a - b)
                .map((questionNumber) => {
                  const userAnswer = userAnswers[questionNumber];
                  const correctAnswer = correctAnswers[questionNumber];

                  const empty = isAnswerEmpty(userAnswer);
                  const correct =
                    !empty && isCorrect(userAnswer, correctAnswer);

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
              onClick={onTakeAnotherTest}
              className="px-8 py-3 bg-[#1977f3] hover:bg-[#1567d3] text-white rounded-lg font-['Inter'] font-semibold text-[14px] transition-colors"
            >
              Take the test again
            </button>
            <button
              onClick={onReturnToLibrary}
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
