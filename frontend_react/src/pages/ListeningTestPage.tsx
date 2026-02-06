import { useState, useEffect } from "react";
import { X, Volume2, Pause, Play } from "lucide-react";
import { Page } from "../App";
import { IELTSMastermindLogo } from "../components/Logo";
import { TestResultScreen } from "../components/TestResultScreen.tsx";
import { InstructionRenderer } from "../components/listening/InstructionParser.tsx";

interface ListeningTestPageProps {
  setCurrentPage: (page: Page) => void;
  exerciseId?: number;
  onLogout?: () => void;
}

interface Question {
  id: number;
  questionNumber: number;
  text: string;
  type: "multiple-choice" | "gap-filling" | "choose-two";
  options?: string[];
  answer: string | string[];
}

const emptyQuestion: Question[] = [
  {
    id: 0,
    questionNumber: 0,
    text: "",
    type: "multiple-choice",
    answer: "",
  },
];

type UserAnswers = Record<number, string | string[]>;

interface TestData {
  title: string;
  task: number;
  duration: number;
  audioUrl: string; // Audio file URL
  instructions: {
    title: string;
    timeInfo: string;
    candidateInstructions: string[];
    candidateInfo: string[];
  };
  examText: string;
  correctAnswers: { [key: number]: string };
}

const questionsSample: Question[] = [
  {
    id: 1,
    questionNumber: 1,
    text: "What is the name of the student?",
    type: "gap-filling",
    answer: "",
  },
];

// Mock data for Transport Survey exercise
const mockTestData: TestData = {
  title: "Mini Listening Practice",
  task: 2,
  duration: 12,
  audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  instructions: {
    title: "IELTS Academic Listening",
    timeInfo: "Time: Approximately 3 minutes",
    candidateInstructions: ["Answer all the questions."],
    candidateInfo: ["There are 3 questions in this test."],
  },
  examText: `
Complete the table below.

[table]
  [row][cell]Name[/cell][cell][gap:1][/cell][/row]
  [row][cell]Course[/cell][cell][gap:2][/cell][/row]
[/table]

Look at the image.

[img src="https://www.gstatic.com/webp/gallery3/1.png" alt="Sample photo" width="240"]

Choose ONE answer.

[multiple-choice n="3" pick="1"]
[option key="A"]Dog[/option]
[option key="B"]Cat[/option]
[option key="C"]Bird[/option]
[option key="D"]Bird[/option]
[/multiple-choice]

Choose [f weight="700" style="italic" color="blue" size="16"]TWO[/f] answers.

[multiple-choice n="4" pick="2"]
[option key="A"]Bus[/option]
[option key="B"]Train[/option]
[option key="C"]Taxi[/option]
[option key="D"]Bicycle[/option]
[/multiple-choice]
`.trim(),

  correctAnswers: {
    1: "Anna",
    2: "Business",
    3: "B",
  },
};

// Map to get test data by exerciseId
const getTestDataById = (id?: number): TestData => {
  return mockTestData;
};

export function ListeningTestPage({
  setCurrentPage,
  exerciseId,
  onLogout,
}: ListeningTestPageProps) {
  const testData = getTestDataById(exerciseId);
  const [testState, setTestState] = useState<
    "instruction" | "test" | "results"
  >("instruction");
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [timeRemaining, setTimeRemaining] = useState(testData.duration * 60);
  const [testStartTime, setTestStartTime] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [currentPart, setCurrentPart] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const audioRef = useState<HTMLAudioElement | null>(null)[0];

  // Delete
  useEffect(() => {
    console.log("answers updated:", answers);
  }, [answers]);

  // Timer countdown
  useEffect(() => {
    if (testState === "test" && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowSubmitModal(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [testState, timeRemaining]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartTest = () => {
    setTestState("test");
    setTestStartTime(Date.now());
  };

  const handleExitTest = () => {
    setShowExitModal(true);
  };

  const handleConfirmExit = () => {
    setCurrentPage("listening");
  };

  const handleAnswerChange = (questionId: number, value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = () => {
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = () => {
    // Close modal immediately
    setShowSubmitModal(false);
    // Calculate time spent and show results
    const spent = Math.floor((Date.now() - testStartTime) / 1000);
    setTimeSpent(spent);
    setTestState("results");
  };

  const handleQuestionNavigation = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  // Instruction Screen
  if (testState === "instruction") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-lg max-w-[900px] w-full p-12">
          <h1 className="text-[32px] font-bold text-[#1977f3] mb-6">
            {getTestDataById(exerciseId).instructions.title}
          </h1>

          <p className="text-[18px] text-gray-600 mb-8">
            <span className="font-bold">Time: Approximately 12 minutes</span>
          </p>

          <div className="mb-8">
            <h2 className="text-[20px] font-bold text-black mb-4">
              INSTRUCTIONS TO CANDIDATES
            </h2>
            <ul className="list-disc list-inside space-y-3 text-[16px] text-gray-700">
              {getTestDataById(
                exerciseId,
              ).instructions.candidateInstructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-[20px] font-bold text-black mb-4">
              INFORMATION FOR CANDIDATES
            </h2>
            <ul className="list-disc list-inside space-y-3 text-[16px] text-gray-700">
              <li>
                <span className="font-bold">There are 10 questions</span> in
                this test.
              </li>
              <li>Each question carries one mark.</li>
              <li>You will hear the recording once.</li>
              <li>
                For this part of the test there will be time for you to look
                through the questions and time for you to check your answers.
              </li>
            </ul>
          </div>

          <p className="text-center text-[16px] text-gray-700 font-medium mb-6">
            Do not click 'Start test' until you are told to do so.
          </p>

          <div className="flex justify-center">
            <button
              onClick={handleStartTest}
              className="bg-[#dc3545] hover:bg-[#c82333] text-white px-12 py-3 rounded-lg font-semibold text-[18px] transition-colors"
            >
              Start test
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (testState === "results") {
    return (
      <TestResultScreen
        testType="listening"
        questions={emptyQuestion}
        correctAnswers={getTestDataById(exerciseId).correctAnswers}
        timeSpent={timeSpent}
        onReturnToLibrary={() => setCurrentPage("listening")}
        onTakeAnotherTest={() => {
          // Reset test state with proper answer types
          // setAnswers(questionsSample);
          setTimeRemaining(getTestDataById(exerciseId).duration * 60);
          setTestState("instruction");
          setTestStartTime(0);
          setTimeSpent(0);
        }}
        setCurrentPage={setCurrentPage}
        onLogout={onLogout}
      />
    );
  }

  // Test Screen
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#1977f3] px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-8">
          <IELTSMastermindLogo setCurrentPage={setCurrentPage} />
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <span className="text-[16px] text-white font-medium">
              Time remaining
            </span>
            <div className="bg-white px-5 py-2 rounded-md">
              <span className="text-[18px] font-bold text-[#1977f3]">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          <button
            onClick={handleExitTest}
            className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-md font-medium text-[16px] transition-colors"
          >
            Exit test
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-8 py-8">
        {/* Audio Player - Moved to top */}
        <div className="bg-[#f5f5dc] border border-gray-300 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-[#fcbf65] hover:bg-[#e5ab52] text-white p-3 rounded-full transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>

              <Volume2 className="w-6 h-6 text-gray-600" />
            </div>

            <div className="text-[16px] text-gray-600">
              <span className="font-medium">00:00</span> / <span>05:30</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-300 rounded-full h-2 cursor-pointer">
            <div
              className="bg-[#fcbf65] h-2 rounded-full transition-all"
              style={{ width: `${audioProgress}%` }}
            />
          </div>
        </div>

        {/* Questions Section */}
        <div className="bg-white border border-gray-300 rounded-lg p-8 mb-6">
          <h3 className="text-[20px] font-bold text-black mb-2">
            Part {getTestDataById(exerciseId).task}
          </h3>

          {/* Render exam text */}
          <InstructionRenderer
            instruction={getTestDataById(exerciseId).examText}
            userAnswers={answers}
            onAnswerChange={handleAnswerChange}
          />
        </div>

        {/* Question Navigation and Submit Button */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          {/* <div className="flex items-center gap-3 flex-wrap">
            {answers.map((_, index) => {
              const answer = answers[index].answer;
              const isAnswered = Array.isArray(answer)
                ? answer.length > 0
                : answer !== "";
              return (
                <button
                  key={index}
                  onClick={() => handleQuestionNavigation(index)}
                  className={`w-12 h-12 rounded border-2 font-medium text-[16px] transition-colors ${
                    currentQuestionIndex === index
                      ? "bg-[#dc3545] text-white border-[#dc3545]"
                      : isAnswered
                        ? "bg-[#1977f3] text-white border-[#1977f3]"
                        : "bg-white text-gray-700 border-gray-400 hover:border-[#1977f3]"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div> */}

          <button
            onClick={handleSubmit}
            className="bg-[#fcbf65] hover:bg-[#e5ab52] text-black px-10 py-3 rounded-lg font-bold text-[18px] transition-colors"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-[500px] w-full mx-4 shadow-2xl">
            <h2 className="font-['Inter'] font-bold text-[24px] mb-4 text-black">
              Submit Test?
            </h2>
            <p className="font-['Inter'] text-[16px] text-gray-700 mb-6">
              {timeRemaining === 0
                ? "Time is up! Your test will be submitted automatically."
                : "Are you sure you want to submit your test? You cannot change your answers after submission."}
            </p>
            <div className="flex gap-4">
              {timeRemaining > 0 && (
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-['Inter'] font-semibold hover:bg-gray-100 transition-colors"
                >
                  Continue Test
                </button>
              )}
              <button
                onClick={handleConfirmSubmit}
                className="flex-1 px-6 py-3 bg-[#1977f3] hover:bg-[#1567d3] text-white rounded-lg font-['Inter'] font-bold transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-[500px] w-full mx-4 shadow-2xl">
            <h2 className="font-['Inter'] font-bold text-[24px] mb-4 text-black">
              Exit Test?
            </h2>
            <p className="font-['Inter'] text-[16px] text-gray-700 mb-6">
              Are you sure you want to exit the test? Your answers will not be
              saved.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-['Inter'] font-semibold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmExit}
                className="flex-1 px-6 py-3 bg-[#dc3545] hover:bg-[#c82333] text-white rounded-lg font-['Inter'] font-bold transition-colors"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
