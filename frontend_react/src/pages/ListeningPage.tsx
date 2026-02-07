import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { NavBarLearner, NavBarGuest } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ExerciseCard } from "../components/ExerciseCard";
import { ExerciseModal } from "../components/ExerciseModal";
import { ExerciseMetadata, mockExercises } from "../mocks/exercises.mock";

type ExerciseMetadaDto = {
  id: string;
  title: string;
  thumbnailUrl?: string;
  task?: string;
  questionTypeTags?: string[];
  topicTags?: string[];
  status?: string;
  updatedOn?: number[];
  questionCount?: number;
  durationMinutes?: number;
};

function localDateTimeArrayToIso(arr?: number[]): string {
  if (!arr || arr.length < 6) return "";
  const [y, m, d, hh, mm, ss, nanos = 0] = arr;
  const ms = Math.floor(nanos / 1_000_000);
  return new Date(y, m - 1, d, hh, mm, ss, ms).toISOString();
}

function parseTaskToNumbers(task?: string): number[] {
  const match = task?.match(/(\d+)/);
  return match ? [Number(match[1])] : [];
}

function mapStatus(dtoStatus?: string): string {
  switch (dtoStatus) {
    case "DRAFT":
      return "draft";

    case "PUBLISHED":
      return "published";

    default:
      return "draft";
  }
}

const dateToMillis = (v: string) => {
  const t = new Date(v).getTime();
  return Number.isFinite(t) ? t : 0;
};

const attemptsToNumber = (v: string) => {
  const n = Number(String(v).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

function mapExerciseDtoToExercise(dto: ExerciseMetadaDto): ExerciseMetadata {
  return {
    id: dto.id,
    title: dto.title ?? "",
    attempts: "0",
    image: dto.thumbnailUrl ?? "",
    task: parseTaskToNumbers(dto.task),
    questionTypes: dto.questionTypeTags ?? [],
    topics: dto.topicTags ?? [],
    status: mapStatus(dto.status),
    updated: localDateTimeArrayToIso(dto.updatedOn),
    questions: dto.questionCount ?? 0,
    duration: dto.durationMinutes ?? 0,
  };
}

function mapExerciseDtosToExercises(
  dtos: ExerciseMetadaDto[],
): ExerciseMetadata[] {
  return (dtos ?? []).map(mapExerciseDtoToExercise);
}

export function ListeningPage() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<"all" | number>("all");
  const [selectedQuestionType, setSelectedQuestionType] = useState<
    "all" | string
  >("all");
  const [selectedTopic, setSelectedTopic] = useState<"all" | string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "attempts" | "a-z" | "z-a"
  >("newest");
  const [selectedExercise, setSelectedExercise] =
    useState<ExerciseMetadata | null>(null);
  const [paginationPage, setPaginationPage] = useState(1);

  const [exercises, setExercises] = useState<ExerciseMetadata[]>(mockExercises);

  const itemsPerPage = 12;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const res = await fetch('http://localhost:8080/api/practice-content', {
  //         method: 'GET',
  //         headers: { Accept: 'application/json' },
  //         credentials: 'include',
  //       });
  //
  //       const json = await res.json();
  //       const dtos: ExerciseDto[] = Array.isArray(json) ? json : (json.data ?? []);
  //       const fetched = mapExerciseDtosToExercises(dtos);
  //
  //       setExercises(fetched);
  //     } catch (err) {
  //       console.error('Failed to fetch practice content:', err);
  //     }
  //   })();
  // }, []);

  const allQuestionTypes = useMemo(() => {
    const set = new Set<string>();
    for (const ex of exercises)
      for (const qt of ex.questionTypes ?? []) set.add(qt);
    return Array.from(set).sort();
  }, [exercises]);

  const allTopics = useMemo(() => {
    const set = new Set<string>();
    for (const ex of exercises) for (const t of ex.topics ?? []) set.add(t);
    return Array.from(set).sort();
  }, [exercises]);

  const getFilteredExercises = (
    taskFilter: "all" | number,
    questionTypeFilter: "all" | string,
    topicFilter: "all" | string,
  ) => {
    return exercises.filter((exercise) => {
      const matchesTask =
        taskFilter === "all" || exercise.task.includes(taskFilter);
      const matchesQuestionType =
        questionTypeFilter === "all" ||
        exercise.questionTypes.includes(questionTypeFilter);
      const matchesTopic =
        topicFilter === "all" || exercise.topics.includes(topicFilter);
      return matchesTask && matchesQuestionType && matchesTopic;
    });
  };

  const availableTasks = [1, 2, 3, 4].filter((task) => {
    const list = getFilteredExercises(
      task,
      selectedQuestionType,
      selectedTopic,
    );
    return list.length > 0;
  });

  const availableQuestionTypes = allQuestionTypes.filter((type) => {
    const list = getFilteredExercises(selectedTask, type, selectedTopic);
    return list.length > 0;
  });

  const availableTopics = allTopics.filter((topic) => {
    const list = getFilteredExercises(
      selectedTask,
      selectedQuestionType,
      topic,
    );
    return list.length > 0;
  });

  const handleFilterChange = () => setPaginationPage(1);

  const toggleStatus = (status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
    handleFilterChange();
  };

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      const matchesSearch = exercise.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesTask =
        selectedTask === "all" || exercise.task.includes(selectedTask);
      const matchesQuestionType =
        selectedQuestionType === "all" ||
        exercise.questionTypes.includes(selectedQuestionType);
      const matchesTopic =
        selectedTopic === "all" || exercise.topics.includes(selectedTopic);

      return (
        matchesSearch && matchesTask && matchesQuestionType && matchesTopic
      );
    });
  }, [
    exercises,
    searchQuery,
    selectedTask,
    selectedQuestionType,
    selectedTopic,
  ]);

  const sortedExercises = useMemo(() => {
    const arr = [...filteredExercises];

    switch (sortBy) {
      case "newest":
        return arr.sort(
          (a, b) => dateToMillis(b.updated) - dateToMillis(a.updated),
        );
      case "oldest":
        return arr.sort(
          (a, b) => dateToMillis(a.updated) - dateToMillis(b.updated),
        );
      case "attempts":
        return arr.sort(
          (a, b) => attemptsToNumber(b.attempts) - attemptsToNumber(a.attempts),
        );
      case "a-z":
        return arr.sort((a, b) => a.title.localeCompare(b.title));
      case "z-a":
        return arr.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return arr;
    }
  }, [filteredExercises, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedExercises.length / itemsPerPage),
  );
  const startIndex = (paginationPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExercises = sortedExercises.slice(startIndex, endIndex);

  useEffect(() => {
    if (paginationPage > totalPages) setPaginationPage(totalPages);
  }, [paginationPage, totalPages]);

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
              placeholder="Search by name or topic"
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
