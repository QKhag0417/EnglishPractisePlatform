import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Footer } from "../../components/Footer";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  Clock,
  Search,
  Eye,
  CheckCircle,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { getSkillColor, getStatusColor, mapTutorStatus } from "./utils";
import {
  useGetAllPracticeSubmissions,
  useGetAllTutorUserPracticeSubmissionsByTutorId,
} from "./hooks";
import { SelectV2 } from "./components";
import { NavBarUnified } from "../../components/NavBarUnified";
import { useAuth } from "../../contexts/AuthContext";

export function TutorDashboardPage() {
  // =========================
  // Navigation
  // =========================

  const navigate = useNavigate();

  // =========================
  // Auth
  // =========================

  const { user } = useAuth();

  const tutorId = user?.id ?? "";

  // =========================
  // Get all tutor user practice submissions by tutor id
  // =========================

  const getAllTutorUserPracticeSubmissionsByTutorId =
    useGetAllTutorUserPracticeSubmissionsByTutorId();

  useEffect(() => {
    if (!tutorId) return;
    getAllTutorUserPracticeSubmissionsByTutorId.get({ tutorId });
  }, [tutorId]);

  const tutorUserPracticeSubmissions =
    getAllTutorUserPracticeSubmissionsByTutorId.tutorUserPracticeSubmissions;

  const currentTutorSubmissionStatusMap = new Map(
    tutorUserPracticeSubmissions.map((item) => [
      item.userPracticeSubmissionId,
      item.tutorStatus,
    ]),
  );

  // =========================
  // Get all practice submissions
  // =========================

  const getAllPracticeSubmissions = useGetAllPracticeSubmissions();

  useEffect(() => {
    getAllPracticeSubmissions.get({});
  }, []);

  const allSubmissions = getAllPracticeSubmissions.practiceSubmissions;

  const isActiveTutorStatus = (status?: string) => {
    return status === "IN_REVIEW" || status === "COMPLETED";
  };

  // =========================
  // Determine which submissions the current tutor can see based on their tutor status
  // =========================

  const canCurrentTutorSeeSubmission = (
    submission: (typeof allSubmissions)[number],
  ) => {
    const globalTutorStatus = submission.tutorStatus;
    const currentTutorStatus = currentTutorSubmissionStatusMap.get(
      submission.id,
    );

    if (!isActiveTutorStatus(globalTutorStatus)) {
      return true;
    }

    return isActiveTutorStatus(currentTutorStatus);
  };

  const visibleSubmissions = allSubmissions.filter(
    canCurrentTutorSeeSubmission,
  );

  // =========================
  // Skill options
  // =========================

  const skillOptions = [
    { value: "all", label: "All Skills" },
    { value: "Listening", label: "Listening" },
    { value: "Reading", label: "Reading" },
    { value: "Writing", label: "Writing" },
    { value: "Speaking", label: "Speaking" },
  ];

  // =========================
  // Status options
  // =========================

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "PENDING", label: "Pending" },
    { value: "IN_REVIEW", label: "In Review" },
    { value: "COMPLETED", label: "Completed" },
  ];

  // =========================
  // Filter submissions
  // =========================

  const [skillFilter, setSkillFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSubmissions = visibleSubmissions.filter((submission) => {
    const matchesSkill =
      skillFilter === "all" || submission.skill === skillFilter;
    const matchesStatus =
      statusFilter === "all" || submission.tutorStatus === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      submission.studentName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      submission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.studentEmail.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSkill && matchesStatus && matchesSearch;
  });

  // =========================
  // Count by status
  // =========================

  const pendingCount = visibleSubmissions.filter(
    (s) => s.tutorStatus === "PENDING",
  ).length;
  const inReviewCount = visibleSubmissions.filter(
    (s) => s.tutorStatus === "IN_REVIEW",
  ).length;
  const completedCount = visibleSubmissions.filter(
    (s) => s.tutorStatus === "COMPLETED",
  ).length;

  // =========================
  // Handle click review button
  // =========================

  const handleOnClickReviewButton = (id: string) => {
    navigate(`/test/result/${id}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <NavBarUnified />

      {/* Header Section */}
      <div className="pt-[100px] pb-[20px] px-[60px] bg-white border-b border-gray-200 flex-grow">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="mb-[24px]">
            <h1 className="font-['Inter'] text-[#1977f3] text-[36px]">
              Review Dashboard
            </h1>

            <p className="text-gray-600 text-[16px]">
              Review and manage student submissions
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-[24px] mb-[24px]">
            {/* Total Submissions */}
            <div className="bg-gray-50 rounded-[12px] p-[24px] border border-gray-200">
              <div className="flex items-center gap-[12px]">
                <div className="w-[48px] h-[48px] rounded-[10px] bg-gray-200 flex items-center justify-center">
                  <BookOpen className="w-[24px] h-[24px] text-gray-700" />
                </div>
                <div>
                  <p className="font-['Inter'] text-[12px] text-gray-500 uppercase">
                    Total
                  </p>
                  <p className="font-['Inter'] text-[28px] font-semibold text-gray-900">
                    {visibleSubmissions.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Pending */}
            <div className="bg-orange-50 rounded-[12px] p-[24px] border border-orange-200">
              <div className="flex items-center gap-[12px]">
                <div className="w-[48px] h-[48px] rounded-[10px] bg-orange-200 flex items-center justify-center">
                  <AlertCircle className="w-[24px] h-[24px] text-orange-700" />
                </div>
                <div>
                  <p className="font-['Inter'] text-[12px] text-orange-600 uppercase">
                    Pending
                  </p>
                  <p className="font-['Inter'] text-[28px] font-semibold text-orange-900">
                    {pendingCount}
                  </p>
                </div>
              </div>
            </div>

            {/* In Review */}
            <div className="bg-blue-50 rounded-[12px] p-[24px] border border-blue-200">
              <div className="flex items-center gap-[12px]">
                <div className="w-[48px] h-[48px] rounded-[10px] bg-blue-200 flex items-center justify-center">
                  <Clock className="w-[24px] h-[24px] text-blue-700" />
                </div>
                <div>
                  <p className="font-['Inter'] text-[12px] text-blue-600 uppercase">
                    In Review
                  </p>
                  <p className="font-['Inter'] text-[28px] font-semibold text-blue-900">
                    {inReviewCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Completed */}
            <div className="bg-green-50 rounded-[12px] p-[24px] border border-green-200">
              <div className="flex items-center gap-[12px]">
                <div className="w-[48px] h-[48px] rounded-[10px] bg-green-200 flex items-center justify-center">
                  <CheckCircle className="w-[24px] h-[24px] text-green-700" />
                </div>
                <div>
                  <p className="font-['Inter'] text-[12px] text-green-600 uppercase">
                    Completed
                  </p>
                  <p className="font-['Inter'] text-[28px] font-semibold text-green-900">
                    {completedCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex gap-[16px] mb-[24px]">
            {/* Search Bar - 70% width */}
            <div className="w-[70%] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by learner name or title"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 font-['Inter']"
              />
            </div>

            {/* Skill Filter - 15% width */}
            <div className="w-[15%]">
              <SelectV2
                value={skillFilter}
                onChange={setSkillFilter}
                options={skillOptions}
                placeholder="Skill"
              />
            </div>

            {/* Status Filter - 15% width */}
            <div className="w-[15%]">
              <SelectV2
                value={statusFilter}
                onChange={setStatusFilter}
                options={statusOptions}
                placeholder="Status"
              />
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-white rounded-[12px] border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[200px_100px_110px_1fr_190px_100px_120px] gap-[20px] bg-gray-50 px-[24px] py-[16px] border-b border-gray-200">
              <span className="font-['Inter'] font-semibold text-[12px] text-gray-600 uppercase">
                Learner
              </span>
              <span className="font-['Inter'] font-semibold text-[12px] text-gray-600 uppercase">
                Skill
              </span>
              <span className="font-['Inter'] font-semibold text-[12px] text-gray-600 uppercase">
                Task
              </span>
              <span className="font-['Inter'] font-semibold text-[12px] text-gray-600 uppercase">
                Title
              </span>
              <span className="font-['Inter'] font-semibold text-[12px] text-gray-600 uppercase">
                Submitted
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
              {filteredSubmissions.length === 0 ? (
                <div className="px-[24px] py-[60px] text-center">
                  <BookOpen className="w-[48px] h-[48px] text-gray-400 mx-auto mb-[16px]" />
                  <p className="font-['Inter'] text-[16px] text-gray-600 mb-[4px]">
                    No submissions found
                  </p>
                  <p className="font-['Inter'] text-[14px] text-gray-500">
                    Try adjusting your filters or search query
                  </p>
                </div>
              ) : (
                filteredSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="grid grid-cols-[200px_100px_110px_1fr_190px_100px_120px] gap-[20px] px-[24px] py-[20px] border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    {/* Learner */}
                    <div>
                      <p className="font-['Inter'] text-[14px] text-gray-900 font-medium">
                        {submission.studentName}
                      </p>
                      <p className="font-['Inter'] text-[12px] text-gray-500">
                        {submission.studentEmail}
                      </p>
                    </div>

                    {/* Skill */}
                    <div>
                      <Badge
                        className={`${getSkillColor(submission.skill)} font-['Inter'] text-[14px] w-fit px-[12px]`}
                      >
                        {submission.skill}
                      </Badge>
                    </div>

                    {/* Task */}
                    <div>
                      <p className="font-['Inter'] text-[14px] text-gray-700">
                        {submission.task}
                      </p>
                    </div>

                    {/* Title */}
                    <div className="min-w-0">
                      <p className="font-['Inter'] text-[14px] text-gray-900 line-clamp-2 break-words">
                        {submission.title}
                      </p>
                    </div>

                    {/* Submitted At */}
                    <div>
                      <p className="font-['Inter'] text-[14px] text-gray-700">
                        {submission.submittedAt}
                      </p>
                      <p className="font-['Inter'] text-[12px] text-gray-500">
                        {submission.timeTaken}
                      </p>
                    </div>

                    {/* Status */}
                    <div>
                      <Badge
                        className={`${getStatusColor(submission.tutorStatus)} font-['Inter'] text-[12px] w-fit px-[12px]`}
                      >
                        {mapTutorStatus(submission.tutorStatus)}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-center gap-[8px]">
                      <Button
                        onClick={() => handleOnClickReviewButton(submission.id)}
                        size="sm"
                        className="bg-[#1977f3] hover:bg-[#1567d3] font-['Inter']"
                      >
                        <Eye className="w-[14px] h-[14px] mr-[6px]" />
                        Review
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
