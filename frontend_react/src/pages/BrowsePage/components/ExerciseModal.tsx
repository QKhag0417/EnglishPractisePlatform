import {
  X,
  Clock,
  FileText,
  Calendar,
  CheckCircle,
  Circle,
  RotateCcw,
} from "lucide-react";
import { TagChips } from "./TagChips";
import { useNavigate } from "react-router";
import { ExerciseMetadata } from "../types";
import { buildImageUrl } from "../utils/buildImageUrl";
import { useAuth } from "../../../contexts/AuthContext";
import { formatTaskLabel } from "../utils";

interface ExerciseModalProps {
  exerciseMetadata: ExerciseMetadata;
  pageType?: "listening" | "reading" | "writing" | "speaking" | string;
  attempCount?: number;
  onClose: () => void;
}

export function ExerciseModal({
  exerciseMetadata,
  pageType,
  attempCount,
  onClose,
}: ExerciseModalProps) {
  // =========================
  // Auth
  // =========================

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // =========================
  // Learner exercise status
  // =========================

  const learnerExerciseStatus = attempCount === 0 ? "not-started" : "completed";

  const getStatusColor = () => {
    switch (learnerExerciseStatus) {
      case "completed":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = () => {
    switch (learnerExerciseStatus) {
      case "completed":
        return <CheckCircle className="w-[20px] h-[20px]" />;
      default:
        return <Circle className="w-[20px] h-[20px]" />;
    }
  };

  const getStatusText = () => {
    switch (learnerExerciseStatus) {
      case "completed":
        return "Completed";
      default:
        return "Not Started";
    }
  };

  // =========================
  // Start practice action
  // =========================

  const handleStartPractice = () => {
    if (!isLoggedIn) {
      onClose();
      navigate("/auth-prompt");
    } else {
      onClose();
      if (
        pageType === "listening" ||
        pageType === "reading" ||
        pageType === "writing"
      ) {
        navigate(`/${pageType}/introduction/${exerciseMetadata.id}`);
      } else if (pageType === "speaking") {
        navigate(`/`);
      } else {
        navigate(`/`);
      }
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-[12px] w-[800px] max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Image */}
          <div className="relative h-[300px]">
            <img
              src={buildImageUrl(exerciseMetadata.image)}
              alt={exerciseMetadata.title}
              className="w-full h-full object-cover rounded-t-[12px]"
            />
            <button
              onClick={onClose}
              className="absolute top-[16px] right-[16px] bg-white rounded-full p-[8px] hover:bg-gray-100 transition-colors"
            >
              <X className="w-[24px] h-[24px] text-black" />
            </button>
          </div>

          {/* Content */}
          <div className="p-[32px]">
            {/* Title */}
            <h2 className="font-['Inter'] font-bold text-[28px] text-black mb-[24px]">
              {exerciseMetadata.title}
            </h2>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-[24px] mb-[32px]">
              {/* Task */}
              <div>
                <p className="font-['Inter'] font-semibold text-[14px] text-gray-600 mb-[8px]">
                  Task
                </p>
                <div className="flex gap-[8px] flex-wrap">
                  <span className="px-[12px] py-[4px] bg-[#fcbf65] rounded-[6px] font-['Inter'] text-[14px] text-black">
                    {formatTaskLabel(exerciseMetadata.task)}
                  </span>
                </div>
              </div>

              {/* Question Type */}
              <div>
                <p className="font-['Inter'] font-semibold text-[14px] text-gray-600 mb-[8px]">
                  Question Type
                </p>
                <div className="flex gap-[8px] flex-wrap">
                  <TagChips
                    tags={exerciseMetadata.questionTypes}
                    colorClass="bg-gray-100"
                    popoverPosition="right"
                  />
                </div>
              </div>

              {/* Topic */}
              <div>
                <p className="font-['Inter'] font-semibold text-[14px] text-gray-600 mb-[8px]">
                  Topic
                </p>
                <div className="flex gap-[8px] flex-wrap">
                  <TagChips
                    tags={exerciseMetadata.topics}
                    colorClass="bg-blue-100"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <p className="font-['Inter'] font-semibold text-[14px] text-gray-600 mb-[8px]">
                  Status
                </p>
                <div
                  className={`flex items-center gap-[8px] ${getStatusColor()}`}
                >
                  {getStatusIcon()}
                  <span className="font-['Inter'] font-medium text-[14px]">
                    {getStatusText()}
                  </span>
                </div>
              </div>

              {/* Updated On */}
              <div>
                <p className="font-['Inter'] font-semibold text-[14px] text-gray-600 mb-[8px]">
                  Updated On
                </p>
                <div className="flex items-center gap-[8px] text-gray-700">
                  <Calendar className="w-[20px] h-[20px]" />
                  <span className="font-['Inter'] text-[14px]">
                    {exerciseMetadata.updated}
                  </span>
                </div>
              </div>

              {/* Number of Questions */}
              <div>
                <p className="font-['Inter'] font-semibold text-[14px] text-gray-600 mb-[8px]">
                  Questions
                </p>
                <div className="flex items-center gap-[8px] text-gray-700">
                  <FileText className="w-[20px] h-[20px]" />
                  <span className="font-['Inter'] text-[14px]">
                    {exerciseMetadata.questions} questions
                  </span>
                </div>
              </div>

              {/* Duration */}
              <div>
                <p className="font-['Inter'] font-semibold text-[14px] text-gray-600 mb-[8px]">
                  Duration
                </p>
                <div className="flex items-center gap-[8px] text-gray-700">
                  <Clock className="w-[20px] h-[20px]" />
                  <span className="font-['Inter'] text-[14px]">
                    {exerciseMetadata.duration} minutes
                  </span>
                </div>
              </div>

              {/* Attempts */}
              <div>
                <p className="font-['Inter'] font-semibold text-[14px] text-gray-600 mb-[8px]">
                  Attempts
                </p>
                <div className="flex items-center gap-[8px] text-gray-700">
                  <RotateCcw className="w-[20px] h-[20px]" />
                  <span className="font-['Inter'] text-[14px]">
                    {exerciseMetadata.attempts}
                  </span>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartPractice}
              className="w-full h-[56px] bg-[#fcbf65] hover:bg-[#e5ab52] rounded-[12px] font-['Inter'] font-bold text-[18px] text-black transition-colors"
            >
              {learnerExerciseStatus === "completed"
                ? "Practice Again"
                : "Start Practice"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
