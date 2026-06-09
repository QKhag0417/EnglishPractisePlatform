import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CustomSelect } from "../../../components/ui/custom-select";
import { Button } from "../../../components/ui/button";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { SelectV2 } from "./SelectV2";
import {
  useDeletePracticeSubmissionById,
  useGetAllPracticeSubmissionsByUserId,
} from "../hooks";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router";

export function PracticeTestHistory() {
  // const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  // const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // const handleOpenDeleteDialog = (index: number) => {
  //   setDeleteIndex(index);
  //   setShowDeleteDialog(true);
  // };

  // const handleCloseDeleteDialog = () => {
  //   setDeleteIndex(null);
  //   setShowDeleteDialog(false);
  // };

  // =========================
  // Auth
  // =========================

  const { user } = useAuth();

  const userId = user?.id;

  // =========================
  // Navigation
  // =========================

  const navigate = useNavigate();

  // =========================
  // Get all practice submissions by user id
  // =========================

  const getAllPracticeSubmissionsByUserId =
    useGetAllPracticeSubmissionsByUserId();

  useEffect(() => {
    if (!userId) return;
    getAllPracticeSubmissionsByUserId.get({ userId: userId });
  }, [userId]);

  // =========================
  // Skill options
  // =========================

  const skillOptions = [
    { value: "all", label: "All Skills" },
    { value: "LISTENING", label: "Listening" },
    { value: "READING", label: "Reading" },
    { value: "WRITING", label: "Writing" },
    { value: "SPEAKING", label: "Speaking" },
  ];

  // =========================
  // Filter submissions
  // =========================

  const [skillFilter, setSkillFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSubmissions =
    getAllPracticeSubmissionsByUserId.practiceSubmissions.filter(
      (submission) => {
        const matchesSkill =
          skillFilter === "all" || submission.skill === skillFilter;

        const matchesSearch =
          searchQuery === "" ||
          submission.title.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSkill && matchesSearch;
      },
    );

  // =========================
  // Delete practice submission by id
  // =========================

  const deletePracticeSubmissionById = useDeletePracticeSubmissionById();

  // =========================
  // Handle click delete button
  // =========================

  const handleOnClickDeleteButton = async (id: string) => {
    if (!userId) return;

    await deletePracticeSubmissionById.remove({ id });
    await getAllPracticeSubmissionsByUserId.get({ userId: userId });
  };

  // =========================
  // Handle click review button
  // =========================

  const handleOnClickReviewButton = (id: string) => {
    navigate(`/test/result/${id}`);
  };

  // =========================
  // Pagination
  // =========================

  const [paginationPage, setPaginationPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSubmissions.length / itemsPerPage),
  );

  const startIndex = (paginationPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedSubmissions = filteredSubmissions.slice(startIndex, endIndex);

  useEffect(() => {
    setPaginationPage(1);
  }, [filteredSubmissions.length]);

  return (
    <>
      <h1 className="font-['Inter'] text-[28px] font-semibold text-gray-900 mb-[32px]">
        Practice Test History
      </h1>

      {/* Filters and Search */}
      <div className="flex gap-[16px] mb-[24px]">
        {/* Search Bar - 80% width */}
        <div className="w-[80%] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by exercise name or title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 font-['Inter']"
          />
        </div>

        {/* Skill Filter - 20% width */}
        <div className="w-[20%]">
          <SelectV2
            value={skillFilter}
            onChange={setSkillFilter}
            options={skillOptions}
            placeholder="Skill"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-[12px] overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-[20px] py-[14px] text-left font-['Inter'] text-[13px] font-semibold text-gray-700 uppercase w-[120px]">
                Date
              </th>
              <th className="px-[20px] py-[14px] text-left font-['Inter'] text-[13px] font-semibold text-gray-700 uppercase">
                Test name
              </th>
              <th className="px-[20px] py-[14px] text-left font-['Inter'] text-[13px] font-semibold text-gray-700 uppercase w-[100px]">
                Score
              </th>
              <th className="px-[20px] py-[14px] text-left font-['Inter'] text-[13px] font-semibold text-gray-700 uppercase w-[120px]">
                Time spent
              </th>
              <th className="px-[20px] py-[14px] text-center font-['Inter'] text-[13px] font-semibold text-gray-700 uppercase w-[160px]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedSubmissions.map((test, index) => (
              <tr
                key={test.id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="px-[20px] py-[16px] font-['Inter'] text-[14px] text-gray-900">
                  {test.submittedAt}
                </td>
                <td className="px-[20px] py-[16px]">
                  <div className="font-['Inter'] text-[14px] text-[#1977f3]">
                    {test.title}
                  </div>
                </td>
                <td className="px-[20px] py-[16px] font-['Inter'] text-[14px] text-gray-900">
                  {test.correctAnswerPercentage + "%" || "-"}
                </td>
                <td className="px-[20px] py-[16px] font-['Inter'] text-[14px] text-gray-900 whitespace-nowrap">
                  {test.timeTaken || "-"}
                </td>
                <td className="px-[20px] py-[16px]">
                  <div className="flex items-center justify-center gap-[8px]">
                    <Button
                      variant="default"
                      className="bg-[#1e3a5f] hover:bg-[#152b47] font-['Inter'] text-[13px] h-[36px]"
                      onClick={() => handleOnClickReviewButton(test.id)}
                    >
                      Review
                    </Button>
                    <button
                      onClick={() => handleOnClickDeleteButton(test.id)}
                      className="p-[8px] hover:bg-red-50 rounded-[6px] transition-colors group"
                      title="Delete test"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M2 4H3.33333H14"
                          stroke="currentColor"
                          className="stroke-red-600 group-hover:stroke-red-700"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5.33331 4.00016V2.66683C5.33331 2.31321 5.47379 1.97407 5.72384 1.72402C5.97389 1.47397 6.31302 1.3335 6.66665 1.3335H9.33331C9.68694 1.3335 10.0261 1.47397 10.2761 1.72402C10.5262 1.97407 10.6666 2.31321 10.6666 2.66683V4.00016M12.6666 4.00016V13.3335C12.6666 13.6871 12.5262 14.0263 12.2761 14.2763C12.0261 14.5264 11.6869 14.6668 11.3333 14.6668H4.66665C4.31302 14.6668 3.97389 14.5264 3.72384 14.2763C3.47379 14.0263 3.33331 13.6871 3.33331 13.3335V4.00016H12.6666Z"
                          stroke="currentColor"
                          className="stroke-red-600 group-hover:stroke-red-700"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6.66669 7.3335V11.3335"
                          stroke="currentColor"
                          className="stroke-red-600 group-hover:stroke-red-700"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.33331 7.3335V11.3335"
                          stroke="currentColor"
                          className="stroke-red-600 group-hover:stroke-red-700"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="border-t border-gray-200 bg-white px-[20px] py-[14px]">
          <div className="flex items-center justify-between gap-[16px]">
            <span className="text-[#202224] text-[14px] opacity-60 font-['Nunito_Sans']">
              Showing {filteredSubmissions.length === 0 ? 0 : startIndex + 1}-
              {Math.min(endIndex, filteredSubmissions.length)} of{" "}
              {filteredSubmissions.length}
            </span>

            <div className="flex items-center gap-[10px]">
              <span className="text-[#202224] text-[14px] opacity-60 font-['Nunito_Sans'] mr-[10px]">
                Page {paginationPage} of {totalPages}
              </span>

              <div className="flex items-center gap-[10px] bg-[#FAFBFD] border border-[#D5D5D5] rounded-[8px] px-[10px] py-[5px]">
                <button
                  onClick={() =>
                    setPaginationPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={paginationPage === 1}
                  className={`${
                    paginationPage === 1
                      ? "opacity-30 cursor-not-allowed"
                      : "opacity-60 hover:opacity-100"
                  } transition-opacity`}
                >
                  <ChevronLeft className="w-[20px] h-[20px]" />
                </button>

                <div className="w-[1px] h-[20px] bg-[#979797]" />

                <button
                  onClick={() =>
                    setPaginationPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={paginationPage === totalPages}
                  className={`${
                    paginationPage === totalPages
                      ? "opacity-30 cursor-not-allowed"
                      : "opacity-90 hover:opacity-100"
                  } transition-opacity`}
                >
                  <ChevronRight className="w-[20px] h-[20px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {/* <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={() => {
          if (deleteIndex !== null) {
            handleDeleteTest(deleteIndex);
          }
          handleCloseDeleteDialog();
        }}
        title="Delete Test"
        message="Are you sure you want to delete this test?"
      /> */}
    </>
  );
}
