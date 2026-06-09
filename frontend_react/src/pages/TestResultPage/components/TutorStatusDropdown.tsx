import { ChevronDown } from "lucide-react";
import {
  useGetTutorUserPracticeSubmissionByTutorIdAndSubmissionId,
  usePutSetTutorStatus,
  useTutorStatusDropdown,
} from "../hooks";
import { useAuth } from "../../../contexts/AuthContext";
import { useEffect } from "react";
import { mapTutorStatus } from "../utils";

type Props = {
  submissionId: string;
};

export function TutorStatusDropdown({ submissionId }: Props) {
  // =========================
  // Auth
  // =========================

  const { user } = useAuth();

  const tutorId = user?.id;

  // =========================
  // Get tutor user practice submission by tutorId and submissionId
  // =========================

  const getTutorUserPracticeSubmissionByTutorIdAndSubmissionIdParams =
    useGetTutorUserPracticeSubmissionByTutorIdAndSubmissionId();

  useEffect(() => {
    if (!submissionId || !tutorId) return;
    getTutorUserPracticeSubmissionByTutorIdAndSubmissionIdParams.get({
      tutorId,
      submissionId,
    });
  }, [submissionId, tutorId]);

  const tutorStatus =
    getTutorUserPracticeSubmissionByTutorIdAndSubmissionIdParams
      .tutorUserPracticeSubmission?.tutorStatus;

  // =========================
  // Put set tutor status
  // =========================

  const putSetTutorStatus = usePutSetTutorStatus();

  // =========================
  // Tutor status dropdown
  // =========================

  const tutorStatusDropdown = useTutorStatusDropdown();

  const handleOnClickTutorStatus = async (
    status: "PENDING" | "IN_REVIEW" | "COMPLETED",
  ) => {
    if (!tutorId || !submissionId) return;

    await putSetTutorStatus.put(
      {
        tutorId,
        submissionId,
      },
      {
        tutorStatus: status,
      },
    );

    await getTutorUserPracticeSubmissionByTutorIdAndSubmissionIdParams.get({
      tutorId,
      submissionId,
    });

    tutorStatusDropdown.setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-[16px]">
      <div className="relative">
        <button
          onClick={() => tutorStatusDropdown.setIsOpen((prev) => !prev)}
          className={`px-[16px] py-[10px] rounded-[8px] font-['Inter'] font-semibold text-[14px] border-2 flex items-center gap-[8px] transition-all min-w-[140px] justify-between ${
            tutorStatus === "PENDING"
              ? "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
              : tutorStatus === "IN_REVIEW"
                ? "bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
                : "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
          }`}
        >
          <span className="flex items-center gap-[6px]">
            {mapTutorStatus(tutorStatus)}
          </span>
          <ChevronDown
            className={`w-[16px] h-[16px] transition-transform ${tutorStatusDropdown.isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown Menu */}
        {tutorStatusDropdown.isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => tutorStatusDropdown.setIsOpen(false)}
            />

            {/* Dropdown Content */}
            <div className="absolute right-0 mt-[8px] w-[180px] bg-white rounded-[8px] shadow-lg border border-gray-200 overflow-hidden z-20">
              {(["PENDING", "IN_REVIEW", "COMPLETED"] as const).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => handleOnClickTutorStatus(status)}
                    className={`w-full px-[16px] py-[12px] text-left font-['Inter'] text-[14px] hover:bg-gray-50 transition-colors flex items-center gap-[10px] ${
                      tutorStatus === status ? "bg-gray-50" : ""
                    }`}
                  >
                    <span
                      className={`flex-1 ${
                        status === "PENDING"
                          ? "text-amber-700"
                          : status === "IN_REVIEW"
                            ? "text-blue-700"
                            : status === "COMPLETED" && "text-green-700"
                      }`}
                    >
                      {mapTutorStatus(status)}
                    </span>
                  </button>
                ),
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
