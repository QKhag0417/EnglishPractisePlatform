import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { NavBarLearner, NavBarGuest } from "../../components/NavBar";
import { Footer } from "../../components/Footer";
import { useAuth } from "../../contexts/AuthContext";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ExerciseCard } from "../../components/ExerciseCard";
import { ExerciseModal } from "../../components/ExerciseModal";
import { ExerciseMetadata, mockExercises } from "../../mocks/exercises.mock";
import { API_BASE } from "../../env";
import {
  useExerciseFilters,
  useExercisePagination,
  useExerciseSort,
  usePracticeContent,
} from "./hooks";

export function ListeningPage() {
  // =========================
  // Auth + navigation actions
  // =========================
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // useEffect(() => {
  //   if (!isLoggedIn) navigate("/");
  // }, [isLoggedIn, navigate]);

  // =========================
  // Data fetching (load exercises metadata)
  // =========================
  const { exercises, loading, error, refetch } = usePracticeContent({
    // apiBase: API_BASE + "error", // to test mock state
    apiBase: API_BASE,
    initialExercises: mockExercises,
  });

  // =========================
  // Compose 3 hooks directly
  // filters -> sort -> pagination
  // =========================
  const itemsPerPage = 12;

  const filters = useExerciseFilters({ exercises });
  const sort = useExerciseSort({
    exercises: filters.derived.filteredExercises,
  });
  const pagination = useExercisePagination({
    exercises: sort.derived.sortedExercises,
    itemsPerPage,
  });

  // =========================
  // UI-only state
  // =========================
  const [selectedExercise, setSelectedExercise] =
    useState<ExerciseMetadata | null>(null);

  // =========================
  // Reset page when filters/sort change
  // (your JSX already calls this after setX)
  // =========================
  const handleFilterChange = () => pagination.actions.resetPage();

  // =========================
  // Aliases to keep your JSX unchanged
  // =========================
  const searchQuery = filters.state.searchQuery;
  const setSearchQuery = filters.setters.setSearchQuery;

  const selectedTask = filters.state.selectedTask;
  const setSelectedTask = filters.setters.setSelectedTask;

  const selectedQuestionType = filters.state.selectedQuestionType;
  const setSelectedQuestionType = filters.setters.setSelectedQuestionType;

  const selectedTopic = filters.state.selectedTopic;
  const setSelectedTopic = filters.setters.setSelectedTopic;

  const sortBy = sort.state.sortBy;
  const setSortBy = sort.setters.setSortBy;

  const availableTasks = filters.derived.availableTasks;
  const availableQuestionTypes = filters.derived.availableQuestionTypes;
  const availableTopics = filters.derived.availableTopics;

  const sortedExercises = sort.derived.sortedExercises;
  const currentExercises = pagination.derived.currentExercises;

  const paginationPage = pagination.state.page;
  const setPaginationPage = pagination.setters.setPage;
  const totalPages = pagination.derived.totalPages;

  const startIndex = (paginationPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return (
    <div className="bg-white min-h-screen">
      {isLoggedIn ? <NavBarLearner onLogout={handleLogout} /> : <NavBarGuest />}

      <div className="pt-[90px] px-[30px] pb-[30px]">
        {/* Search Feature */}
        <div className="flex gap-[10px] mb-[20px]">
          <div className="flex-1 relative">
            <input
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
          <button className="h-[38px] px-[20px] bg-white border-2 border-[#fcbf65] rounded-[12px] text-[#fcbf65] hover:bg-[#fcbf65] hover:text-white transition-colors">
            Search
          </button>
        </div>

        {/* Task Filter */}
        <div className="bg-[rgba(119,203,242,0.12)] border border-[rgba(0,0,0,0.11)] rounded-[10px] p-[18px] mb-[12px]">
          <div className="flex items-center gap-[10px] flex-wrap">
            <span className="font-['Inter'] font-bold text-[13px]">Task</span>
            <button
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
            {availableTasks.map((task) => (
              <button
                key={task}
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
            {availableQuestionTypes.map((type) => (
              <button
                key={type}
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
            {availableTopics.map((topic) => (
              <button
                key={topic}
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
            <div className="grid grid-cols-4 gap-x-[20px] gap-y-[30px]">
              {currentExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onSelect={() => setSelectedExercise(exercise)}
                  isLoggedIn={isLoggedIn}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-[30px]">
              <span className="text-[#202224] text-[14px] opacity-60 font-['Nunito_Sans']">
                Showing {sortedExercises.length === 0 ? 0 : startIndex + 1}-
                {Math.min(endIndex, sortedExercises.length)} of{" "}
                {sortedExercises.length}
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
        <ExerciseModal
          exerciseMetadata={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onStart={() => setSelectedExercise(null)}
          isLoggedIn={isLoggedIn}
          pageType="listening"
        />
      )}
    </div>
  );
}
