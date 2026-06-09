import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { BrowsePage } from "../BrowsePage";
import { useAuth } from "../../../contexts/AuthContext";

/**
 * ============================================================
 * Hoisted mocks
 * ============================================================
 *
 * Vitest hoists vi.mock() calls to the top of the file.
 * Therefore, any mock variables used inside vi.mock() must also
 * be created with vi.hoisted().
 *
 * mockState acts as a controllable fake state layer for all custom
 * hooks used by BrowsePage. Each test can modify mockState before
 * rendering the component to simulate different page conditions.
 */
const {
  mockNavigate,
  mockUseParams,
  mockGetExercises,
  mockGetProgresses,
  mockSetSearchQuery,
  mockSetSelectedTask,
  mockSetSelectedQuestionType,
  mockSetSelectedTopic,
  mockSetSortBy,
  mockSetPage,
  mockResetPage,
  mockExercises,
  mockState,
} = vi.hoisted(() => {
  const mockExercises = [
    {
      id: "exercise-1",
      title: "Listening Practice 1",
      skill: "LISTENING",
      task: "1",
      questionTypes: ["Multiple Choice"],
      topicTags: ["Education"],
    },
    {
      id: "exercise-2",
      title: "Listening Practice 2",
      skill: "LISTENING",
      task: "2",
      questionTypes: ["Matching"],
      topicTags: ["Science"],
    },
  ];

  return {
    mockNavigate: vi.fn(),
    mockUseParams: vi.fn(),
    mockGetExercises: vi.fn(),
    mockGetProgresses: vi.fn(),
    mockSetSearchQuery: vi.fn(),
    mockSetSelectedTask: vi.fn(),
    mockSetSelectedQuestionType: vi.fn(),
    mockSetSelectedTopic: vi.fn(),
    mockSetSortBy: vi.fn(),
    mockSetPage: vi.fn(),
    mockResetPage: vi.fn(),
    mockExercises,
    mockState: {
      exercises: mockExercises,
      currentExercises: mockExercises,
      searchQuery: "",
      selectedTask: "all",
      selectedQuestionType: "all",
      selectedTopic: "all",
      sortBy: "newest",
      page: 1,
      totalPages: 2,
      progresses: [
        {
          practiceContentId: "exercise-1",
          isBookmarked: true,
          attemptCount: 3,
        },
      ],
    },
  };
});

/**
 * ============================================================
 * External module mocks
 * ============================================================
 *
 * BrowsePage depends on routing, authentication, layout components,
 * child components, custom hooks, and utility functions.
 *
 * These are mocked so that this test file focuses only on BrowsePage
 * behavior, not on the internal implementation of its dependencies.
 */

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
}));

vi.mock("../../../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../../components/NavBarUnified", () => ({
  NavBarUnified: () => <div data-testid="navbar">Navbar</div>,
}));

vi.mock("../../../components/Footer", () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
}));

vi.mock("../components", () => ({
  /**
   * Mock ExerciseCard as a simple clickable button.
   * This allows tests to verify:
   * - exercise rendering
   * - bookmark display
   * - opening the modal when a card is clicked
   */
  ExerciseCard: ({ exercise, isBookmarked, onSelect }: any) => (
    <button data-testid="exercise-card" onClick={onSelect}>
      {exercise.title} - bookmarked: {String(isBookmarked)}
    </button>
  ),

  /**
   * Mock ExerciseModal with only the visible values that BrowsePage passes.
   * This allows tests to verify selected exercise, page type, attempt count,
   * and close behavior.
   */
  ExerciseModal: ({
    exerciseMetadata,
    pageType,
    attempCount,
    onClose,
  }: any) => (
    <div data-testid="exercise-modal">
      <p>Modal: {exerciseMetadata.title}</p>
      <p>Page Type: {pageType}</p>
      <p>Attempts: {attempCount}</p>
      <button onClick={onClose}>Close Modal</button>
    </div>
  ),
}));

vi.mock("../hooks", () => ({
  /**
   * Mock data-fetching hook.
   * BrowsePage should call get() when it mounts.
   */
  useGetPracticeContent: () => ({
    exercises: mockState.exercises,
    get: mockGetExercises,
  }),

  /**
   * Mock filter hooks.
   * These return mockState values so each test can control selected filters
   * without testing the hook logic itself.
   */
  useFilterExercisesBySkill: (exercises: any) => ({
    skillExercises: exercises ?? mockState.exercises,
  }),

  useFilterExercisesByStatus: (exercisesOrProps: any) => ({
    filteredExercises:
      exercisesOrProps?.exercises ?? exercisesOrProps ?? mockState.exercises,
  }),

  useFilterExercisesBySearch: ({ exercises }: any) => ({
    state: {
      searchQuery: mockState.searchQuery,
    },
    setters: {
      setSearchQuery: mockSetSearchQuery,
    },
    derived: {
      filteredExercises: exercises ?? [],
    },
  }),

  useFilterExercisesByTask: ({ exercises }: any) => ({
    state: {
      selectedTask: mockState.selectedTask,
    },
    setters: {
      setSelectedTask: mockSetSelectedTask,
    },
    derived: {
      filteredExercises: exercises ?? [],
      availableTasks: ["1", "2"],
    },
  }),

  useFilterExercisesByQuestionType: ({ exercises }: any) => ({
    state: {
      selectedQuestionType: mockState.selectedQuestionType,
    },
    setters: {
      setSelectedQuestionType: mockSetSelectedQuestionType,
    },
    derived: {
      filteredExercises: exercises ?? [],
      availableQuestionTypes: ["Multiple Choice", "Matching"],
    },
  }),

  useFilterExercisesByTopic: ({ exercises }: any) => ({
    state: {
      selectedTopic: mockState.selectedTopic,
    },
    setters: {
      setSelectedTopic: mockSetSelectedTopic,
    },
    derived: {
      filteredExercises: exercises ?? [],
      availableTopics: ["Education", "Science"],
    },
  }),

  /**
   * Mock sorting hook.
   * sortBy is controlled through mockState.
   */
  useExerciseSort: ({ exercises }: any) => ({
    state: {
      sortBy: mockState.sortBy,
    },
    setters: {
      setSortBy: mockSetSortBy,
    },
    derived: {
      sortedExercises: exercises ?? [],
    },
  }),

  /**
   * Mock pagination hook.
   * page, totalPages, and currentExercises are controlled through mockState.
   */
  useExercisePagination: ({ exercises }: any) => ({
    state: {
      page: mockState.page,
    },
    setters: {
      setPage: mockSetPage,
    },
    derived: {
      currentExercises: mockState.currentExercises ?? exercises ?? [],
      totalPages: mockState.totalPages,
    },
    actions: {
      resetPage: mockResetPage,
    },
  }),

  /**
   * Mock progress hook.
   * BrowsePage uses this to determine bookmark status and attempt count.
   */
  useGetUserPracticeContentProgresses: () => ({
    get: mockGetProgresses,
    progresses: mockState.progresses,
  }),
}));

vi.mock("../utils", () => ({
  /**
   * Mock utility function that converts progress list into a lookup object.
   * This keeps the test close to the real behavior used by BrowsePage.
   */
  mapUserPracticeContentProgressesByPracticeContentId: (progresses: any[]) =>
    (progresses ?? []).reduce((acc, progress) => {
      acc[progress.practiceContentId] = progress;
      return acc;
    }, {}),
}));

/**
 * ============================================================
 * Test helper functions
 * ============================================================
 *
 * These helpers keep each test short and consistent.
 * Each test should follow the same structure:
 *
 * 1. Arrange: configure mockState and mocked dependencies
 * 2. Act: render the component and simulate user actions
 * 3. Assert: verify the expected result
 */

function resetMockState() {
  Object.assign(mockState, {
    exercises: mockExercises,
    currentExercises: mockExercises,
    searchQuery: "",
    selectedTask: "all",
    selectedQuestionType: "all",
    selectedTopic: "all",
    sortBy: "newest",
    page: 1,
    totalPages: 2,
    progresses: [
      {
        practiceContentId: "exercise-1",
        isBookmarked: true,
        attemptCount: 3,
      },
    ],
  });
}

function mockValidRoute() {
  mockUseParams.mockReturnValue({
    skill: "listening",
  });
}

function mockInvalidRoute() {
  mockUseParams.mockReturnValue({
    skill: "invalid-skill",
  });
}

function mockMissingRoute() {
  mockUseParams.mockReturnValue({
    skill: undefined,
  });
}

function mockAuthenticatedUser() {
  vi.mocked(useAuth).mockReturnValue({
    isLoggedIn: true,
    logout: vi.fn(),
    user: {
      id: "user-123",
    },
  } as any);
}

function mockAnonymousUser() {
  vi.mocked(useAuth).mockReturnValue({
    isLoggedIn: false,
    logout: vi.fn(),
    user: null,
  } as any);
}

function renderBrowsePage() {
  return render(<BrowsePage />);
}

function getPaginationButtons() {
  const buttons = screen.getAllByRole("button");

  return {
    previousButton: buttons[buttons.length - 2],
    nextButton: buttons[buttons.length - 1],
  };
}

/**
 * ============================================================
 * Test suite
 * ============================================================
 */

describe("BrowsePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    resetMockState();
    mockValidRoute();
    mockAuthenticatedUser();

    /**
     * BrowsePage passes updater functions to setPage:
     *
     * setPaginationPage((prev) => Math.max(1, prev - 1))
     * setPaginationPage((prev) => Math.min(totalPages, prev + 1))
     *
     * This mock implementation allows the test to inspect and execute
     * those updater functions.
     */
    mockSetPage.mockImplementation((value: any) => {
      if (typeof value === "function") {
        return value(mockState.page);
      }

      return value;
    });
  });

  describe("initial rendering and data loading", () => {
    test("renders the main browse page layout and loads exercise data", async () => {
      // Arrange + Act
      renderBrowsePage();

      // Assert: layout components
      expect(screen.getByTestId("navbar")).toBeInTheDocument();
      expect(screen.getByTestId("footer")).toBeInTheDocument();

      // Assert: search and filters
      expect(screen.getByPlaceholderText("Search by name")).toBeInTheDocument();
      expect(screen.getByText("Task")).toBeInTheDocument();
      expect(screen.getByText("Question type")).toBeInTheDocument();
      expect(screen.getByText("Topic")).toBeInTheDocument();
      expect(screen.getByText("Sort By")).toBeInTheDocument();

      // Assert: exercise cards and bookmark state
      expect(
        screen.getByText("Listening Practice 1 - bookmarked: true"),
      ).toBeInTheDocument();

      expect(
        screen.getByText("Listening Practice 2 - bookmarked: false"),
      ).toBeInTheDocument();

      // Assert: pagination text
      expect(screen.getByText("Showing 1-2 of 2")).toBeInTheDocument();
      expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();

      // Assert: effects are called after render
      await waitFor(() => {
        expect(mockGetExercises).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockGetProgresses).toHaveBeenCalled();
      });
    });
  });

  describe("route validation", () => {
    test("redirects to home when the skill route param is invalid", () => {
      // Arrange
      mockInvalidRoute();

      // Act
      renderBrowsePage();

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });

    test("redirects to home when the skill route param is missing", () => {
      // Arrange
      mockMissingRoute();

      // Act
      renderBrowsePage();

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });
  });

  describe("search behavior", () => {
    test("updates the search query and resets pagination", () => {
      // Arrange
      renderBrowsePage();

      // Act
      fireEvent.change(screen.getByPlaceholderText("Search by name"), {
        target: {
          value: "listening",
        },
      });

      // Assert
      expect(mockSetSearchQuery).toHaveBeenCalledWith("listening");
      expect(mockResetPage).toHaveBeenCalled();
    });

    test("clears the search query and resets pagination", async () => {
      // Arrange
      const user = userEvent.setup();
      mockState.searchQuery = "listening";

      renderBrowsePage();

      const input = screen.getByPlaceholderText("Search by name");
      const clearButton = input.parentElement?.querySelector("button");

      // Act
      expect(clearButton).toBeInTheDocument();
      await user.click(clearButton as HTMLElement);

      // Assert
      expect(mockSetSearchQuery).toHaveBeenCalledWith("");
      expect(mockResetPage).toHaveBeenCalled();
    });
  });

  describe("filter behavior", () => {
    test("clicking all filter buttons resets filters and pagination", async () => {
      // Arrange
      const user = userEvent.setup();

      mockState.selectedTask = "1";
      mockState.selectedQuestionType = "Multiple Choice";
      mockState.selectedTopic = "Education";

      renderBrowsePage();

      const allButtons = screen.getAllByRole("button", { name: "All" });

      // Act + Assert: task filter
      await user.click(allButtons[0]);
      expect(mockSetSelectedTask).toHaveBeenCalledWith("all");

      // Act + Assert: question type filter
      await user.click(allButtons[1]);
      expect(mockSetSelectedQuestionType).toHaveBeenCalledWith("all");

      // Act + Assert: topic filter
      await user.click(allButtons[2]);
      expect(mockSetSelectedTopic).toHaveBeenCalledWith("all");

      // Assert: every filter change resets pagination
      expect(mockResetPage).toHaveBeenCalledTimes(3);
    });

    test("clicking specific filter values calls the correct handlers", async () => {
      // Arrange
      const user = userEvent.setup();

      renderBrowsePage();

      // Act + Assert: task filter
      await user.click(screen.getByRole("button", { name: "Task 1" }));
      expect(mockSetSelectedTask).toHaveBeenCalledWith("1");

      // Act + Assert: question type filter
      await user.click(screen.getByRole("button", { name: "Multiple Choice" }));
      expect(mockSetSelectedQuestionType).toHaveBeenCalledWith(
        "Multiple Choice",
      );

      // Act + Assert: topic filter
      await user.click(screen.getByRole("button", { name: "Education" }));
      expect(mockSetSelectedTopic).toHaveBeenCalledWith("Education");

      // Assert: every filter change resets pagination
      expect(mockResetPage).toHaveBeenCalledTimes(3);
    });

    test("renders selected filter states", () => {
      // Arrange
      mockState.selectedTask = "1";
      mockState.selectedQuestionType = "Multiple Choice";
      mockState.selectedTopic = "Education";
      mockState.sortBy = "z-a";

      // Act
      renderBrowsePage();

      // Assert: selected filters use highlighted style
      expect(
        screen.getByRole("button", { name: "Task 1" }).className,
      ).toContain("bg-[#fcbf65]");

      expect(
        screen.getByRole("button", { name: "Multiple Choice" }).className,
      ).toContain("bg-[#fcbf65]");

      expect(
        screen.getByRole("button", { name: "Education" }).className,
      ).toContain("bg-[#fcbf65]");

      // Assert: selected sort radio is checked
      expect(screen.getByLabelText("Z → A")).toBeChecked();
    });
  });

  describe("sorting behavior", () => {
    test("clicking sort options calls setSortBy and resets pagination", async () => {
      // Arrange
      const user = userEvent.setup();

      /**
       * Make every radio button initially unchecked.
       * If a radio is already checked, clicking it again will not trigger onChange.
       */
      mockState.sortBy = "";

      renderBrowsePage();

      // Act + Assert: newest
      await user.click(screen.getByLabelText("Newest"));
      expect(mockSetSortBy).toHaveBeenCalledWith("newest");

      // Act + Assert: oldest
      await user.click(screen.getByLabelText("Oldest"));
      expect(mockSetSortBy).toHaveBeenCalledWith("oldest");

      // Act + Assert: most attempts
      await user.click(screen.getByLabelText("Most attempts"));
      expect(mockSetSortBy).toHaveBeenCalledWith("attempts");

      // Act + Assert: A-Z
      await user.click(screen.getByLabelText("A → Z"));
      expect(mockSetSortBy).toHaveBeenCalledWith("a-z");

      // Act + Assert: Z-A
      await user.click(screen.getByLabelText("Z → A"));
      expect(mockSetSortBy).toHaveBeenCalledWith("z-a");

      // Assert: each sort change resets pagination
      expect(mockResetPage).toHaveBeenCalledTimes(5);
    });
  });

  describe("exercise modal behavior", () => {
    test("opens and closes the exercise modal with existing progress", async () => {
      // Arrange
      const user = userEvent.setup();

      renderBrowsePage();

      // Act: open modal
      await user.click(
        screen.getByText("Listening Practice 1 - bookmarked: true"),
      );

      // Assert: modal receives selected exercise and progress
      expect(screen.getByTestId("exercise-modal")).toBeInTheDocument();
      expect(
        screen.getByText("Modal: Listening Practice 1"),
      ).toBeInTheDocument();
      expect(screen.getByText("Page Type: listening")).toBeInTheDocument();
      expect(screen.getByText("Attempts: 3")).toBeInTheDocument();

      // Act: close modal
      await user.click(screen.getByRole("button", { name: /close modal/i }));

      // Assert
      expect(screen.queryByTestId("exercise-modal")).not.toBeInTheDocument();
    });

    test("opens the exercise modal with default attempt count when progress does not exist", async () => {
      // Arrange
      const user = userEvent.setup();

      renderBrowsePage();

      // Act
      await user.click(
        screen.getByText("Listening Practice 2 - bookmarked: false"),
      );

      // Assert
      expect(screen.getByTestId("exercise-modal")).toBeInTheDocument();
      expect(
        screen.getByText("Modal: Listening Practice 2"),
      ).toBeInTheDocument();
      expect(screen.getByText("Attempts: 0")).toBeInTheDocument();
    });
  });

  describe("pagination behavior", () => {
    test("pagination buttons call setPage updater functions", async () => {
      // Arrange
      const user = userEvent.setup();

      mockState.page = 2;
      mockState.totalPages = 3;

      renderBrowsePage();

      const { previousButton, nextButton } = getPaginationButtons();

      // Act
      await user.click(previousButton);
      await user.click(nextButton);

      // Assert: setPage receives updater functions
      expect(mockSetPage).toHaveBeenCalledTimes(2);

      const previousUpdater = mockSetPage.mock.calls[0][0];
      const nextUpdater = mockSetPage.mock.calls[1][0];

      // Assert: updater functions calculate the expected next page
      expect(previousUpdater(2)).toBe(1);
      expect(nextUpdater(2)).toBe(3);
    });

    test("disables previous pagination button on the first page", () => {
      // Arrange
      mockState.page = 1;
      mockState.totalPages = 2;

      // Act
      renderBrowsePage();

      const { previousButton, nextButton } = getPaginationButtons();

      // Assert
      expect(previousButton).toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });

    test("disables next pagination button on the last page", () => {
      // Arrange
      mockState.page = 2;
      mockState.totalPages = 2;

      // Act
      renderBrowsePage();

      const { previousButton, nextButton } = getPaginationButtons();

      // Assert
      expect(previousButton).not.toBeDisabled();
      expect(nextButton).toBeDisabled();
    });
  });

  describe("empty and unauthenticated states", () => {
    test("renders empty exercise result correctly", () => {
      // Arrange
      mockState.exercises = [];
      mockState.currentExercises = [];
      mockState.page = 1;
      mockState.totalPages = 1;
      mockState.progresses = [];

      // Act
      renderBrowsePage();

      // Assert
      expect(screen.queryAllByTestId("exercise-card")).toHaveLength(0);
      expect(screen.getByText("Showing 0-0 of 0")).toBeInTheDocument();
      expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
    });

    test("does not fetch user practice progresses when user is missing", async () => {
      // Arrange
      mockAnonymousUser();

      // Act
      renderBrowsePage();

      // Assert: exercises are still fetched
      await waitFor(() => {
        expect(mockGetExercises).toHaveBeenCalled();
      });

      // Assert: user progress is not fetched because userId is empty
      expect(mockGetProgresses).not.toHaveBeenCalled();
    });
  });
});
