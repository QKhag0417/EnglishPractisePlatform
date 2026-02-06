import { Page } from "../App";
import { NavBarLearner } from "./NavBar";
import { Footer } from "./Footer";

interface Question {
  id: number;
  questionNumber: number;
  text: string;
  type: string;
  answer: string | string[]; // Support both string and array answers
}

interface TestResultScreenProps {
  testType: "listening" | "reading";
  questions: Question[];
  correctAnswers: { [key: number]: string };
  timeSpent: number; // in seconds
  onReturnToLibrary: () => void;
  onTakeAnotherTest: () => void;
  setCurrentPage: (page: Page) => void;
  onLogout?: () => void;
}

export function TestResultScreen({
  testType,
  questions,
  correctAnswers,
  timeSpent,
  onReturnToLibrary,
  onTakeAnotherTest,
  setCurrentPage,
  onLogout,
}: TestResultScreenProps) {
  // Helper function to normalize answer to string for comparison
  const normalizeAnswer = (answer: string | string[]): string => {
    if (Array.isArray(answer)) {
      return answer.join(",").toLowerCase();
    }
    return typeof answer === "string" ? answer.trim().toLowerCase() : "";
  };

  // Helper function to check if answer is empty
  const isAnswerEmpty = (answer: string | string[]): boolean => {
    if (Array.isArray(answer)) {
      return answer.length === 0;
    }
    return typeof answer === "string" ? !answer.trim() : true;
  };

  // Calculate results
  const totalQuestions = questions.length;
  const correctCount = questions.filter((q) => {
    const userAnswer = normalizeAnswer(q.answer);
    const correct = correctAnswers[q.questionNumber]?.toLowerCase();
    return userAnswer === correct;
  }).length;

  const wrongCount = questions.filter((q) => {
    const userAnswer = normalizeAnswer(q.answer);
    const correct = correctAnswers[q.questionNumber]?.toLowerCase();
    return !isAnswerEmpty(q.answer) && userAnswer !== correct;
  }).length;

  const skipCount = questions.filter((q) => isAnswerEmpty(q.answer)).length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

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
              {questions.map((question) => {
                const userAnswer = question.answer;
                const correctAnswer = correctAnswers[question.questionNumber];
                const isCorrect =
                  normalizeAnswer(userAnswer) === correctAnswer?.toLowerCase();
                const isEmpty = isAnswerEmpty(userAnswer);

                return (
                  <div key={question.id} className="flex items-center gap-3">
                    {/* Question Number */}
                    <span className="font-['Inter'] font-bold text-[16px] text-black w-6">
                      {question.questionNumber}
                    </span>

                    {/* User Answer or Empty */}
                    {isEmpty ? (
                      <span className="font-['Inter'] text-[14px] text-gray-400">
                        (empty)
                      </span>
                    ) : !isCorrect ? (
                      <>
                        <span className="text-[#dc3545] text-[16px]">✕</span>
                        <span className="font-['Inter'] text-[14px] text-gray-400 line-through">
                          {Array.isArray(userAnswer)
                            ? userAnswer.join(", ")
                            : userAnswer}
                        </span>
                      </>
                    ) : null}

                    {/* Correct Answer */}
                    {!isEmpty && !isCorrect && (
                      <span className="text-[#dc3545] text-[16px]">✕</span>
                    )}
                    <span
                      className={`font-['Inter'] text-[16px] ${isCorrect ? "text-black" : "text-[#28a745]"}`}
                    >
                      {correctAnswer}
                    </span>
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
