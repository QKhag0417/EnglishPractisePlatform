import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Footer } from "../../components/Footer";
import { useAuth } from "../../contexts/AuthContext";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ExerciseCard, ExerciseModal } from "./components";
import {
  useExercisePagination,
  useExerciseSort,
  useGetPracticeContent,
  useFilterExercisesBySkill,
  useFilterExercisesBySearch,
  useFilterExercisesByTask,
  useFilterExercisesByQuestionType,
  useFilterExercisesByTopic,
  useFilterExercisesByStatus,
  useGetUserPracticeContentProgresses,
} from "./hooks";
import { ExerciseMetadata } from "./types";
import { mapUserPracticeContentProgressesByPracticeContentId } from "./utils";
import { NavBarUnified } from "../../components/NavBarUnified";

const SKILL_ALLOWED = new Set(["listening", "reading", "writing", "speaking"]);

// TODO: We need to implement publish/draft, learner exercise status, bookmark, attempts

export function BrowsePage() {
  // =========================
  // Auth
  // =========================
  const { isLoggedIn, logout, user } = useAuth();

  // =========================
  // Navigation
  // =========================

  const navigate = useNavigate();

  // =========================
  // Page route param
  // =========================
  const { skill } = useParams();

  useEffect(() => {
    if (!SKILL_ALLOWED.has((skill ?? "").toLowerCase())) {
      navigate("/", { replace: true });
    }
  }, [skill, navigate]);

  // =========================
  // Get practice content
  // =========================
  const { exercises, get: getExercises } = useGetPracticeContent();

  useEffect(() => {
    void getExercises();
  }, [getExercises]);

  // =========================
  // Filter exercises by skill
  // =========================

  const { skillExercises: filteredExercisesBySkill } =
    useFilterExercisesBySkill(exercises, skill);

  // =========================
  // Filter exercises by status
  // =========================

  const { filteredExercises: filteredExercisesByStatus } =
    useFilterExercisesByStatus(filteredExercisesBySkill);

  // =========================
  // Filter exercises by search
  // =========================

  const search = useFilterExercisesBySearch({
    exercises: filteredExercisesByStatus,
  });

  const searchQuery = search.state.searchQuery;
  const setSearchQuery = search.setters.setSearchQuery;

  // =========================
  // Filter exercises by task
  // =========================

  const task = useFilterExercisesByTask({
    exercises: search.derived.filteredExercises,
  });

  const selectedTask = task.state.selectedTask;
  const setSelectedTask = task.setters.setSelectedTask;
  const availableTasks = task.derived.availableTasks;

  // =========================
  // Filter exercises by question type
  // =========================

  const questionType = useFilterExercisesByQuestionType({
    exercises: task.derived.filteredExercises,
  });

  const selectedQuestionType = questionType.state.selectedQuestionType;
  const setSelectedQuestionType = questionType.setters.setSelectedQuestionType;
  const availableQuestionTypes = questionType.derived.availableQuestionTypes;

  // =========================
  // Filter exercises by topic
  // =========================

  const topic = useFilterExercisesByTopic({
    exercises: questionType.derived.filteredExercises,
  });

  const selectedTopic = topic.state.selectedTopic;
  const setSelectedTopic = topic.setters.setSelectedTopic;
  const availableTopics = topic.derived.availableTopics;

  // =========================
  // Sort exercises
  // =========================

  const sort = useExerciseSort({
    exercises: topic.derived.filteredExercises,
  });

  const sortBy = sort.state.sortBy;
  const setSortBy = sort.setters.setSortBy;
  const sortedExercises = sort.derived.sortedExercises;

  // =========================
  // Paginate exercises
  // =========================

  const itemsPerPage = 12;

  const pagination = useExercisePagination({
    exercises: sort.derived.sortedExercises,
    itemsPerPage,
  });

  const handleFilterChange = () => pagination.actions.resetPage();

  const currentExercises = pagination.derived.currentExercises;

  const paginationPage = pagination.state.page;
  const setPaginationPage = pagination.setters.setPage;
  const totalPages = pagination.derived.totalPages;

  const startIndex = (paginationPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // =========================
  // Selected exercise for modal
  // =========================

  const [selectedExercise, setSelectedExercise] =
    useState<ExerciseMetadata | null>(null);

  // =========================
  // Get user practice content progresses to determine exercise status for each exercise card
  // =========================

  const userId = user?.id ?? "";

  const getUserPracticeContentProgresses =
    useGetUserPracticeContentProgresses(userId);

  useEffect(() => {
    if (!userId) return;
    getUserPracticeContentProgresses.get();
  }, [userId, getUserPracticeContentProgresses.get]);

  const userPracticeContentProgresses =
    mapUserPracticeContentProgressesByPracticeContentId(
      getUserPracticeContentProgresses.progresses,
    );

  return (
    <div className="bg-white min-h-screen">
      <NavBarUnified />

      <div className="pt-[90px] px-[30px] pb-[30px]">
        {/* Search Feature */}
        <div className="flex gap-[10px] mb-[20px]">
          <div className="flex-1 relative">
            <input
              id="browse-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleFilterChange();
              }}
              placeholder="Search by name"
              className="w-full h-[38px] px-[40px] border border-[rgba(0,0,0,0.3)] rounded-[8px] focus:outline-none focus:border-[#fcbf65]"
            />
            <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-black" />
            {searchQuery && (
              <button
                id="browse-search-clear-button"
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  handleFilterChange();
                }}
                className="absolute right-[12px] top-1/2 -translate-y-1/2"
              >
                <X className="w-[18px] h-[18px] text-black" />
              </button>
            )}
          </div>
          <button
            id="browse-search-button"
            type="button"
            className="h-[38px] px-[20px] bg-white border-2 border-[#fcbf65] rounded-[12px] text-[#fcbf65] hover:bg-[#fcbf65] hover:text-white transition-colors"
          >
            Search
          </button>
        </div>

        {/* Task Filter */}
        <div className="bg-[rgba(119,203,242,0.12)] border border-[rgba(0,0,0,0.11)] rounded-[10px] p-[18px] mb-[12px]">
          <div className="flex items-center gap-[10px] flex-wrap">
            <span className="font-['Inter'] font-bold text-[13px]">Task</span>
            <button
              id="browse-task-button-0"
              type="button"
              onClick={() => {
                setSelectedTask("all");
                handleFilterChange();
              }}
              className={`px-[12px] py-[2px] rounded-[4px] border border-black text-[11px] ${
                selectedTask === "all" ? "bg-[#fcbf65]" : "bg-white"
              }`}
            >
              All
            </button>
            {availableTasks.map((task, index) => (
              <button
                key={task}
                id={`browse-task-button-${index + 1}`}
                type="button"
                onClick={() => {
                  setSelectedTask(task);
                  handleFilterChange();
                }}
                className={`px-[12px] py-[2px] rounded-[4px] border border-black text-[11px] ${
                  selectedTask === task ? "bg-[#fcbf65]" : "bg-white"
                }`}
              >
                Task {task}
              </button>
            ))}
          </div>
        </div>

        {/* Question Type Filter */}
        <div className="bg-[rgba(119,203,242,0.12)] border border-[rgba(0,0,0,0.11)] rounded-[10px] p-[18px] mb-[12px]">
          <div className="flex items-center gap-[10px] flex-wrap">
            <span className="font-['Inter'] font-bold text-[13px]">
              Question type
            </span>
            <button
              id="browse-question-type-button-0"
              type="button"
              onClick={() => {
                setSelectedQuestionType("all");
                handleFilterChange();
              }}
              className={`px-[12px] py-[2px] rounded-[4px] border border-black text-[11px] ${
                selectedQuestionType === "all" ? "bg-[#fcbf65]" : "bg-white"
              }`}
            >
              All
            </button>
            {availableQuestionTypes.map((type, index) => (
              <button
                key={type}
                id={`browse-question-type-button-${index + 1}`}
                type="button"
                onClick={() => {
                  setSelectedQuestionType(type);
                  handleFilterChange();
                }}
                className={`px-[12px] py-[2px] rounded-[4px] border border-black text-[11px] whitespace-nowrap ${
                  selectedQuestionType === type ? "bg-[#fcbf65]" : "bg-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Filter */}
        <div className="bg-[rgba(119,203,242,0.12)] border border-[rgba(0,0,0,0.11)] rounded-[10px] p-[18px] mb-[20px]">
          <div className="flex items-center gap-[10px] flex-wrap">
            <span className="font-['Inter'] font-bold text-[13px]">Topic</span>
            <button
              id="browse-topic-button-0"
              type="button"
              onClick={() => {
                setSelectedTopic("all");
                handleFilterChange();
              }}
              className={`px-[12px] py-[2px] rounded-[4px] border border-black text-[11px] ${
                selectedTopic === "all" ? "bg-[#fcbf65]" : "bg-white"
              }`}
            >
              All
            </button>
            {availableTopics.map((topic, index) => (
              <button
                key={topic}
                id={`browse-topic-button-${index + 1}`}
                type="button"
                onClick={() => {
                  setSelectedTopic(topic);
                  handleFilterChange();
                }}
                className={`px-[12px] py-[2px] rounded-[4px] border border-black text-[11px] whitespace-nowrap ${
                  selectedTopic === topic ? "bg-[#fcbf65]" : "bg-white"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-[30px]">
          {/* Sidebar */}
          <div className="w-[158px] bg-[rgba(119,203,242,0.12)] border border-[rgba(0,0,0,0.11)] rounded-[10px] p-[18px] self-start">
            {/* Status
            <div className="mb-[20px]">
              <h3 className="font-['Inter'] font-bold text-[13px] mb-[12px]">
                Status
              </h3>

              <label className="flex items-center gap-[8px] mb-[8px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedStatus.includes("not-started")}
                  onChange={() => toggleStatus("not-started")}
                  className="w-[16px] h-[16px] rounded-[3px] border-[#b3b3b3]"
                />
                <span className="font-['Inter'] text-[12px] text-[rgba(0,0,0,0.47)]">
                  Not started
                </span>
              </label>

              <label className="flex items-center gap-[8px] mb-[8px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedStatus.includes("in-progress")}
                  onChange={() => toggleStatus("in-progress")}
                  className="w-[16px] h-[16px] rounded-[3px] border-[#b3b3b3]"
                />
                <span className="font-['Inter'] text-[12px] text-[rgba(0,0,0,0.47)]">
                  In progress
                </span>
              </label>

              <label className="flex items-center gap-[8px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedStatus.includes("completed")}
                  onChange={() => toggleStatus("completed")}
                  className="w-[16px] h-[16px] rounded-[3px] border-[#b3b3b3]"
                />
                <span className="font-['Inter'] text-[12px] text-[rgba(0,0,0,0.47)]">
                  Completed
                </span>
              </label>
            </div>

            <div className="border-t border-black mb-[20px]" /> */}

            {/* Sort By */}
            <div>
              <h3 className="font-['Inter'] font-bold text-[13px] mb-[12px]">
                Sort By
              </h3>

              <label className="flex items-center gap-[8px] mb-[8px] cursor-pointer">
                <input
                  id="browse-sort-radio-1"
                  type="radio"
                  checked={sortBy === "newest"}
                  onChange={() => {
                    setSortBy("newest");
                    handleFilterChange();
                  }}
                  name="sort"
                  className="w-[16px] h-[16px]"
                />
                <span className="font-['Inter'] text-[12px] text-[rgba(0,0,0,0.47)]">
                  Newest
                </span>
              </label>

              <label className="flex items-center gap-[8px] mb-[8px] cursor-pointer">
                <input
                  id="browse-sort-radio-2"
                  type="radio"
                  checked={sortBy === "oldest"}
                  onChange={() => {
                    setSortBy("oldest");
                    handleFilterChange();
                  }}
                  name="sort"
                  className="w-[16px] h-[16px]"
                />
                <span className="font-['Inter'] text-[12px] text-[rgba(0,0,0,0.47)]">
                  Oldest
                </span>
              </label>

              <label className="flex items-center gap-[8px] mb-[8px] cursor-pointer">
                <input
                  id="browse-sort-radio-3"
                  type="radio"
                  checked={sortBy === "attempts"}
                  onChange={() => {
                    setSortBy("attempts");
                    handleFilterChange();
                  }}
                  name="sort"
                  className="w-[16px] h-[16px]"
                />
                <span className="font-['Inter'] text-[12px] text-[rgba(0,0,0,0.47)]">
                  Most attempts
                </span>
              </label>

              <label className="flex items-center gap-[8px] mb-[8px] cursor-pointer">
                <input
                  id="browse-sort-radio-4"
                  type="radio"
                  checked={sortBy === "a-z"}
                  onChange={() => {
                    setSortBy("a-z");
                    handleFilterChange();
                  }}
                  name="sort"
                  className="w-[16px] h-[16px]"
                />
                <span className="font-['Inter'] text-[12px] text-[rgba(0,0,0,0.47)]">
                  A → Z
                </span>
              </label>

              <label className="flex items-center gap-[8px] cursor-pointer">
                <input
                  id="browse-sort-radio-5"
                  type="radio"
                  checked={sortBy === "z-a"}
                  onChange={() => {
                    setSortBy("z-a");
                    handleFilterChange();
                  }}
                  name="sort"
                  className="w-[16px] h-[16px]"
                />
                <span className="font-['Inter'] text-[12px] text-[rgba(0,0,0,0.47)]">
                  Z → A
                </span>
              </label>
            </div>
          </div>

          {/* Exercise Grid */}
          <div className="flex-1">
            <div
              id="browse-exercise-grid"
              className="grid grid-cols-4 gap-x-[20px] gap-y-[30px]"
            >
              {currentExercises.map((exercise, index) => (
                <div key={exercise.id} id={`browse-exercise-card-${index + 1}`}>
                  <ExerciseCard
                    exercise={exercise}
                    isBookmarked={
                      userPracticeContentProgresses[exercise.id]
                        ?.isBookmarked ?? false
                    }
                    onSelect={() => setSelectedExercise(exercise)}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-[30px]">
              <span
                id="browse-pagination-summary"
                className="text-[#202224] text-[14px] opacity-60 font-['Nunito_Sans']"
              >
                Showing {sortedExercises.length === 0 ? 0 : startIndex + 1}-
                {Math.min(endIndex, sortedExercises.length)} of{" "}
                {sortedExercises.length}
              </span>

              <div className="flex items-center gap-[10px]">
                <span
                  id="browse-pagination-page-indicator"
                  className="text-[#202224] text-[14px] opacity-60 font-['Nunito_Sans'] mr-[10px]"
                >
                  Page {paginationPage} of {totalPages}
                </span>
                <div className="flex items-center gap-[10px] bg-[#FAFBFD] border border-[#D5D5D5] rounded-[8px] px-[10px] py-[5px]">
                  <button
                    id="browse-pagination-button-previous"
                    type="button"
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
                    id="browse-pagination-button-next"
                    type="button"
                    onClick={() =>
                      setPaginationPage((prev) =>
                        Math.min(totalPages, prev + 1),
                      )
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
      </div>

      <Footer />

      {/* Exercise Modal */}
      {selectedExercise && (
        <div id="browse-exercise-modal">
          <ExerciseModal
            exerciseMetadata={selectedExercise}
            pageType={skill}
            attempCount={
              userPracticeContentProgresses[selectedExercise.id]
                ?.attemptCount ?? 0
            }
            onClose={() => setSelectedExercise(null)}
          />
        </div>
      )}
    </div>
  );
}
