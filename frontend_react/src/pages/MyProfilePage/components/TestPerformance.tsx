import {
  Award,
  BookOpen,
  CheckCircle,
  Clock3,
  Headphones,
  Target,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
  calculateAverageQuestionTypeAccuracies,
  formatLocalDateTimeArray,
  formatSecondsToTime,
  localDateTimeArrayToDate,
} from "../utils";
import {
  useGetPracticeSubmissionsByUserIdAndDays,
  useGetUserTargetBandById,
  usePutUserTargetBandById,
} from "../hooks";
import { useAuth } from "../../../contexts/AuthContext";
import { SelectV2 } from "./SelectV2";

export function TestPerformance() {
  // =========================
  // Auth
  // =========================

  const { user } = useAuth();

  const userId = user?.id;

  // =========================
  // State for selected skill tab
  // =========================

  const [selectedSkill, setSelectedSkill] = useState<"listening" | "reading">(
    "listening",
  );

  // =========================
  // Date selector options
  // =========================

  const [selectedPeriod, setSelectedPeriod] = useState<number>(1);

  const dateOptions = [
    { value: 1, label: "Today" },
    { value: 3, label: "3 days" },
    { value: 7, label: "1 week" },
    { value: 14, label: "2 weeks" },
    { value: 30, label: "1 month" },
    { value: 90, label: "3 months" },
    { value: 365, label: "1 year" },
    { value: 1000, label: "All time" },
  ];

  // =========================
  // Get practice submissions for score history chart
  // =========================

  const getPracticeSubmissionsByUserIdAndDays =
    useGetPracticeSubmissionsByUserIdAndDays();

  useEffect(() => {
    if (!userId || !selectedPeriod) return;

    getPracticeSubmissionsByUserIdAndDays.get({
      userId,
      days: selectedPeriod,
    });
  }, [userId, selectedPeriod]);

  const testResults = getPracticeSubmissionsByUserIdAndDays.practiceSubmissions;

  // =========================
  // Calculations for score history chart
  // =========================

  const listeningScoreHistory = testResults
    .filter((t) => t.practiceContent.skill === "LISTENING")
    .sort((a, b) => {
      const dateA = localDateTimeArrayToDate(a.submittedAt);
      const dateB = localDateTimeArrayToDate(b.submittedAt);
      return dateA.getTime() - dateB.getTime();
    })
    .map((t) => ({
      id: t.id,
      date: formatLocalDateTimeArray(t.submittedAt),
      correct: t.correctAnswerCount,
      incorrect: t.wrongAnswerCount,
      unanswered: t.skipAnswerCount,
      overallScore: t.correctAnswerPercentage,
      testName: t.practiceContent.title,
    }));

  const readingScoreHistory = testResults
    .filter((t) => t.practiceContent.skill === "READING")
    .sort((a, b) => {
      const dateA = localDateTimeArrayToDate(a.submittedAt);
      const dateB = localDateTimeArrayToDate(b.submittedAt);
      return dateA.getTime() - dateB.getTime();
    })
    .map((t) => ({
      id: t.id,
      date: formatLocalDateTimeArray(t.submittedAt),
      correct: t.correctAnswerCount,
      incorrect: t.wrongAnswerCount,
      unanswered: t.skipAnswerCount,
      overallScore: t.correctAnswerPercentage,
      testName: t.practiceContent.title,
    }));

  // =========================
  // Calculations for score history chart - dynamic dot size
  // =========================

  const scoreHistoryData =
    selectedSkill === "listening" ? listeningScoreHistory : readingScoreHistory;

  const pointCount = scoreHistoryData.length;

  const dotRadius =
    pointCount > 50 ? 2 : pointCount > 30 ? 3 : pointCount > 15 ? 4 : 5;

  const activeDotRadius = dotRadius + 2;

  // =========================
  // Calculations for question types accuracy
  // =========================

  const listeningQuestionTypes = calculateAverageQuestionTypeAccuracies(
    testResults,
    "LISTENING",
  );

  const readingQuestionTypes = calculateAverageQuestionTypeAccuracies(
    testResults,
    "READING",
  );

  // =========================
  // Calculations for average scores
  // =========================

  const averageListeningScore =
    listeningScoreHistory.length > 0
      ? (
          listeningScoreHistory.reduce((acc, t) => acc + t.overallScore, 0) /
          listeningScoreHistory.length
        ).toFixed(1)
      : "0.0";

  const averageReadingScore =
    readingScoreHistory.length > 0
      ? (
          readingScoreHistory.reduce((acc, t) => acc + t.overallScore, 0) /
          readingScoreHistory.length
        ).toFixed(1)
      : "0.0";

  const averageSelectedSkillScore =
    {
      listening: averageListeningScore,
      reading: averageReadingScore,
    }[selectedSkill] ?? "0.0";

  // =========================
  // Calculations for average time
  // =========================

  const calculateAverageTimeByType = (type: string) => {
    const tests = testResults.filter((t) => t.practiceContent.skill === type);

    if (tests.length === 0) return "00:00";

    const totalSeconds = tests.reduce((acc, t) => {
      return acc + (t.timeSpentSeconds ?? 0);
    }, 0);

    const averageSeconds = Math.floor(totalSeconds / tests.length);
    return formatSecondsToTime(averageSeconds);
  };

  const averageListeningTime = calculateAverageTimeByType("LISTENING");
  const averageReadingTime = calculateAverageTimeByType("READING");

  const averageSelectedSkillTime =
    {
      listening: averageListeningTime,
      reading: averageReadingTime,
    }[selectedSkill] ?? "00:00";

  // =========================
  // Get user target band
  // =========================

  const getUserTargetBandById = useGetUserTargetBandById();

  useEffect(() => {
    if (!userId) return;

    getUserTargetBandById.get({ userId });
  }, [userId]);

  const currentTargetScores = {
    listening: getUserTargetBandById.userTargetBand.targetListeningBand ?? 0,
    reading: getUserTargetBandById.userTargetBand.targetReadingBand ?? 0,
    writing: getUserTargetBandById.userTargetBand.targetWritingBand ?? 0,
    speaking: getUserTargetBandById.userTargetBand.targetSpeakingBand ?? 0,
  };

  // =========================
  // Update user target band
  // =========================

  const putUserTargetBandById = usePutUserTargetBandById();

  // =========================
  // Handlers for target score dialog
  // =========================

  const [showTargetScoreDialog, setShowTargetScoreDialog] = useState(false);

  const [targetBandForm, setTargetBandForm] = useState({
    listening: 0,
    reading: 0,
    writing: 0,
    speaking: 0,
  });

  const handleSaveTargetScores = async () => {
    if (!userId) return;

    await putUserTargetBandById.put(
      { userId },
      {
        targetListeningBand: targetBandForm.listening,
        targetReadingBand: targetBandForm.reading,
        targetWritingBand: targetBandForm.writing,
        targetSpeakingBand: targetBandForm.speaking,
      },
    );

    getUserTargetBandById.setUserTargetBand({
      userId,
      targetListeningBand: targetBandForm.listening,
      targetReadingBand: targetBandForm.reading,
      targetWritingBand: targetBandForm.writing,
      targetSpeakingBand: targetBandForm.speaking,
    });

    setShowTargetScoreDialog(false);
  };

  // =========================
  // Calculations for statistics cards
  // =========================

  const targetOverallBand = (
    (currentTargetScores.listening +
      currentTargetScores.reading +
      currentTargetScores.writing +
      currentTargetScores.speaking) /
    4
  ).toFixed(1);

  const completedTests = testResults.length;

  const averageScore =
    completedTests > 0
      ? Math.round(
          testResults.reduce(
            (sum, test) => sum + test.correctAnswerPercentage,
            0,
          ) / completedTests,
        )
      : 0;

  const highestScore =
    completedTests > 0
      ? Math.max(...testResults.map((test) => test.correctAnswerPercentage))
      : 0;

  return (
    <>
      <div className="flex items-center justify-between mb-[32px]">
        <h1 className="font-['Inter'] text-[28px] font-semibold text-gray-900">
          Test Performance
        </h1>

        {/* Date Selection Dropdown */}
        <div className="min-w-[180px]">
          <SelectV2
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            options={dateOptions}
            placeholder="Select period"
            triggerClassName="h-[40px] rounded-[10px] border border-[#CBD5E1] bg-white px-3 text-[14px] font-medium text-[#475569] shadow-sm hover:border-[#94A3B8] focus-visible:ring-2 focus-visible:ring-[#1977f3]/20"
            iconClassName="h-4 w-4 text-[#64748B] opacity-100"
          />
        </div>
      </div>

      <div className="space-y-[24px]">
        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div
            onClick={() => {
              setTargetBandForm({ ...currentTargetScores });
              setShowTargetScoreDialog(true);
            }}
            className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 cursor-pointer hover:border-[#1977f3] hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-[40px] h-[40px] rounded-full bg-blue-100 flex items-center justify-center">
                <Target className="w-[20px] h-[20px] text-[#1977f3]" />
              </div>
            </div>
            <h3 className="font-['Inter'] text-[12px] text-gray-600 mb-1">
              Target Score
            </h3>
            <p className="font-['Inter'] font-bold text-[24px] text-gray-900">
              {targetOverallBand}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-[40px] h-[40px] rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-[20px] h-[20px] text-green-600" />
              </div>
            </div>
            <h3 className="font-['Inter'] text-[12px] text-gray-600 mb-1">
              Total Completed Tests
            </h3>
            <p className="font-['Inter'] font-bold text-[24px] text-gray-900">
              {completedTests}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-[40px] h-[40px] rounded-full bg-purple-100 flex items-center justify-center">
                <Target className="w-[20px] h-[20px] text-purple-600" />
              </div>
            </div>
            <h3 className="font-['Inter'] text-[12px] text-gray-600 mb-1">
              Average Score
            </h3>
            <p className="font-['Inter'] font-bold text-[24px] text-gray-900">
              {averageScore}%
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-[40px] h-[40px] rounded-full bg-amber-100 flex items-center justify-center">
                <Award className="w-[20px] h-[20px] text-[#fcbf65]" />
              </div>
            </div>
            <h3 className="font-['Inter'] text-[12px] text-gray-600 mb-1">
              Best Score
            </h3>
            <p className="font-['Inter'] font-bold text-[24px] text-gray-900">
              {highestScore}%
            </p>
          </div>
        </div>

        {/* Score History Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Skill Tabs */}
          <div className="flex items-center gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => setSelectedSkill("listening")}
              className={`flex items-center gap-2 px-4 py-3 font-['Inter'] text-[14px] font-medium border-b-2 transition-colors ${
                selectedSkill === "listening"
                  ? "border-[#8b5cf6] text-[#8b5cf6]"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <Headphones size={16} strokeWidth={1.75} />
              Listening
            </button>

            <button
              onClick={() => setSelectedSkill("reading")}
              className={`flex items-center gap-2 px-4 py-3 font-['Inter'] text-[14px] font-medium border-b-2 transition-colors ${
                selectedSkill === "reading"
                  ? "border-[#1977f3] text-[#1977f3]"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <BookOpen size={16} strokeWidth={1.75} />
              Reading
            </button>
          </div>

          {/* Chart and Question Types Grid */}
          <div className="grid grid-cols-[1fr_320px] gap-6">
            {/* Score History Chart */}
            <div>
              <h3 className="font-['Inter'] font-semibold text-[14px] text-gray-700 mb-4">
                Score History
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={scoreHistoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    stroke="#e5e7eb"
                    tickFormatter={(value) => {
                      // Parse DD/MM/YYYY HH:MM:SS format
                      const [datePart] = value.split(" ");
                      const [day, month] = datePart.split("/");
                      return `${month}/${day}`;
                    }}
                  />
                  <YAxis
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    stroke="#e5e7eb"
                    domain={[0, 100]}
                    ticks={[0, 20, 40, 60, 80, 100]}
                    label={{
                      value: "Overall Score (%)",
                      angle: -90,
                      position: "insideLeft",
                      style: {
                        fill: "#6b7280",
                        fontSize: 12,
                        textAnchor: "middle",
                      },
                    }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                            <p className="font-['Inter'] text-[11px] font-semibold text-gray-900 mb-2">
                              {data.testName}
                            </p>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between gap-4">
                                <span className="font-['Inter'] text-[11px] text-gray-600">
                                  Overall Score:
                                </span>
                                <span className="font-['Inter'] text-[11px] font-bold text-gray-900">
                                  {data.overallScore}%
                                </span>
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                <span className="font-['Inter'] text-[11px] text-green-600">
                                  Correct:
                                </span>
                                <span className="font-['Inter'] text-[11px] font-semibold text-green-600">
                                  {data.correct}
                                </span>
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                <span className="font-['Inter'] text-[11px] text-red-600">
                                  Incorrect:
                                </span>
                                <span className="font-['Inter'] text-[11px] font-semibold text-red-600">
                                  {data.incorrect}
                                </span>
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                <span className="font-['Inter'] text-[11px] text-gray-500">
                                  Unanswered:
                                </span>
                                <span className="font-['Inter'] text-[11px] font-semibold text-gray-500">
                                  {data.unanswered}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="overallScore"
                    stroke={
                      selectedSkill === "listening" ? "#8b5cf6" : "#1977f3"
                    }
                    strokeWidth={3}
                    dot={{
                      fill:
                        selectedSkill === "listening" ? "#8b5cf6" : "#1977f3",
                      r: dotRadius,
                    }}
                    activeDot={{ r: activeDotRadius }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Question Types Accuracy */}
            <div className="border-l border-gray-200 pl-6">
              <h3 className="font-['Inter'] font-semibold text-[14px] text-gray-700 mb-4">
                Question Types
              </h3>
              <div className="space-y-3">
                {(selectedSkill === "listening"
                  ? listeningQuestionTypes
                  : readingQuestionTypes
                ).map((qt, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="font-['Inter'] text-[12px] text-gray-700 flex-1">
                      {qt.type}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-[80px] h-[6px] bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            qt.accuracy >= 80
                              ? "bg-green-500"
                              : qt.accuracy >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${qt.accuracy}%` }}
                        />
                      </div>
                      <span
                        className={`font-['Inter'] text-[12px] font-semibold w-[40px] text-right ${
                          qt.accuracy >= 80
                            ? "text-green-600"
                            : qt.accuracy >= 60
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {qt.accuracy}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Average Statistics */}
              <div className="mt-6 pt-5 border-t border-gray-200 space-y-3">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-[32px] h-[32px] bg-blue-500 rounded-full flex items-center justify-center">
                      <Trophy
                        size={17}
                        className="text-white"
                        strokeWidth={2.5}
                      />
                    </div>

                    <div>
                      <p className="font-['Inter'] text-[11px] text-gray-600 uppercase tracking-wide font-semibold">
                        Average Score
                      </p>
                      <p className="font-['Inter'] text-[24px] font-bold text-blue-600">
                        {averageSelectedSkillScore}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-[32px] h-[32px] bg-amber-500 rounded-full flex items-center justify-center">
                      <Clock3
                        size={17}
                        className="text-white"
                        strokeWidth={2.5}
                      />
                    </div>
                    <div>
                      <p className="font-['Inter'] text-[11px] text-gray-600 uppercase tracking-wide font-semibold">
                        Average Time
                      </p>
                      <p className="font-['Inter'] text-[24px] font-bold text-amber-600">
                        {averageSelectedSkillTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Target Score Dialog */}
      <Dialog
        open={showTargetScoreDialog}
        onOpenChange={setShowTargetScoreDialog}
      >
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Set Target Scores</DialogTitle>
            <DialogDescription>
              Set your target scores for each skill to track your progress.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <Label className="font-['Inter'] text-[14px] font-medium text-gray-700 mb-[8px] block">
                Listening
              </Label>
              <Input
                type="number"
                value={targetBandForm.listening}
                onChange={(e) =>
                  setTargetBandForm({
                    ...targetBandForm,
                    listening: parseFloat(e.target.value),
                  })
                }
                className="h-[44px]"
                placeholder="7.5"
                min="0"
                max="9"
                step="0.5"
              />
            </div>
            <div>
              <Label className="font-['Inter'] text-[14px] font-medium text-gray-700 mb-[8px] block">
                Reading
              </Label>
              <Input
                type="number"
                value={targetBandForm.reading}
                onChange={(e) =>
                  setTargetBandForm({
                    ...targetBandForm,
                    reading: parseFloat(e.target.value),
                  })
                }
                className="h-[44px]"
                placeholder="7.0"
                min="0"
                max="9"
                step="0.5"
              />
            </div>
            <div>
              <Label className="font-['Inter'] text-[14px] font-medium text-gray-700 mb-[8px] block">
                Writing
              </Label>
              <Input
                type="number"
                value={targetBandForm.writing}
                onChange={(e) =>
                  setTargetBandForm({
                    ...targetBandForm,
                    writing: parseFloat(e.target.value),
                  })
                }
                className="h-[44px]"
                placeholder="7.0"
                min="0"
                max="9"
                step="0.5"
              />
            </div>
            <div>
              <Label className="font-['Inter'] text-[14px] font-medium text-gray-700 mb-[8px] block">
                Speaking
              </Label>
              <Input
                type="number"
                value={targetBandForm.speaking}
                onChange={(e) =>
                  setTargetBandForm({
                    ...targetBandForm,
                    speaking: parseFloat(e.target.value),
                  })
                }
                className="h-[44px]"
                placeholder="7.0"
                min="0"
                max="9"
                step="0.5"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setShowTargetScoreDialog(false)}
              variant="outline"
              className="font-['Inter']"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveTargetScores}
              disabled={putUserTargetBandById.loading}
              className="bg-[#1977f3] hover:bg-[#1567d3] font-['Inter']"
            >
              {putUserTargetBandById.loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
