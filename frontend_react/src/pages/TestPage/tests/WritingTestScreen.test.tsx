import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { WritingTestScreen } from "../components/WritingTestScreen";
import { useAuth } from "../../../contexts/AuthContext.tsx";

const {
  mockNavigate,
  mockGetWritingExercise,
  mockPostUserSubmission,
  mockPostWritingAnswer,
  mockPostAIFeedback,
  mockPostAttemptIncrement,
  mockLogActivity,
  mockGetQueuedActivities,
  mockOnAnswerChange,
  mockOpenExitModal,
  mockConfirmExit,
  mockSetShowExitModal,
  mockAttemptHookArgs,
  mockState,
} = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockGetWritingExercise: vi.fn(),
  mockPostUserSubmission: vi.fn(),
  mockPostWritingAnswer: vi.fn(),
  mockPostAIFeedback: vi.fn(),
  mockPostAttemptIncrement: vi.fn(),
  mockLogActivity: vi.fn(),
  mockGetQueuedActivities: vi.fn(),
  mockOnAnswerChange: vi.fn(),
  mockOpenExitModal: vi.fn(),
  mockConfirmExit: vi.fn(),
  mockSetShowExitModal: vi.fn(),
  mockAttemptHookArgs: vi.fn(),

  mockState: {
    exercise: {
      duration: 60,
      examText: {
        title: "IELTS Writing Task 2",
      },
    },
    answers: {
      1: ["This is my essay answer"],
    },
    secondsRemaining: 3500,
    isExpired: false,
    elapsedMs: 100000,
    showExitModal: false,
  },
}));

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../../../contexts/AuthContext.tsx", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../../components/Logo.tsx", () => ({
  IELTSMastermindLogo: () => <div data-testid="logo">Logo</div>,
}));

vi.mock("../components/InstructionRenderer.tsx", () => ({
  InstructionRenderer: ({ instruction }: any) => (
    <div data-testid="instruction-renderer">
      {instruction?.title || "Mock Writing Task"}
    </div>
  ),
}));

vi.mock("../utils", () => ({
  formatTime: (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  },

  countWords: (text: string) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  },
}));

vi.mock("../hooks", () => ({
  useGetWritingExercise: () => ({
    get: mockGetWritingExercise,
    exercise: mockState.exercise,
  }),

  useUserAnswer: () => ({
    answers: mockState.answers,
    onAnswerChange: mockOnAnswerChange,
  }),

  useCountdownTimer: () => ({
    secondsRemaining: mockState.secondsRemaining,
    isExpired: mockState.isExpired,
    getElapsedMs: vi.fn(() => mockState.elapsedMs),
  }),

  useTestActivityLogger: () => ({
    logActivity: mockLogActivity,
    getQueuedActivities: mockGetQueuedActivities,
  }),

  usePostUserSubmission: () => ({
    post: mockPostUserSubmission,
  }),

  usePostUserPracticeWritingAnswer: () => ({
    post: mockPostWritingAnswer,
  }),

  usePostCreateWritingAIFeedback: () => ({
    post: mockPostAIFeedback,
  }),

  usePostUserPracticeContentProgressAttemptIncrement: (
    userId: string,
    exerciseId: string,
  ) => {
    mockAttemptHookArgs(userId, exerciseId);

    return {
      post: mockPostAttemptIncrement,
    };
  },

  useExitModal: () => ({
    showExitModal: mockState.showExitModal,
    openExitModal: mockOpenExitModal,
    setShowExitModal: mockSetShowExitModal,
    confirmExit: mockConfirmExit,
  }),

  useSubmitModal: vi.fn(),
}));

const renderPage = (exerciseId = "writing-123") =>
  render(<WritingTestScreen exerciseId={exerciseId} />);

const submitButton = () => screen.getByRole("button", { name: /^submit$/i });

const essayInput = () => screen.getByPlaceholderText("Type your essay here...");

const openSubmitModal = async () => {
  const user = userEvent.setup();

  renderPage();

  await user.click(submitButton());

  return user;
};

const confirmSubmit = async () => {
  const submitButtons = screen.getAllByRole("button", {
    name: /^submit$/i,
  });

  await userEvent.setup().click(submitButtons[submitButtons.length - 1]);
};

const resetMockState = () => {
  Object.assign(mockState, {
    exercise: {
      duration: 60,
      examText: {
        title: "IELTS Writing Task 2",
      },
    },
    answers: {
      1: ["This is my essay answer"],
    },
    secondsRemaining: 3500,
    isExpired: false,
    elapsedMs: 100000,
    showExitModal: false,
  });
};

describe("WritingTestScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMockState();

    vi.mocked(useAuth).mockReturnValue({
      user: {
        id: "user-123",
      },
    } as any);

    mockPostUserSubmission.mockResolvedValue({
      practiceSubmissionId: "submission-123",
    });

    mockPostWritingAnswer.mockResolvedValue({
      success: true,
    });

    mockPostAIFeedback.mockResolvedValue({
      success: true,
    });

    mockPostAttemptIncrement.mockResolvedValue({
      success: true,
    });

    mockGetQueuedActivities.mockReturnValue([
      {
        activityType: "TEST_START",
      },
      {
        activityType: "TEST_SUBMIT",
      },
    ]);
  });

  describe("initial loading", () => {
    test("fetches writing exercise and logs test start when exerciseId exists", async () => {
      renderPage();

      await waitFor(() => {
        expect(mockGetWritingExercise).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockLogActivity).toHaveBeenCalledWith({
          activityType: "TEST_START",
        });
      });

      expect(mockAttemptHookArgs).toHaveBeenCalledWith(
        "user-123",
        "writing-123",
      );
    });

    test("does not fetch or log test start when exerciseId is empty", () => {
      renderPage("");

      expect(mockGetWritingExercise).not.toHaveBeenCalled();
      expect(mockLogActivity).not.toHaveBeenCalled();
    });
  });

  describe("rendering", () => {
    test("renders timer, writing task, textarea, word count, exit button, and submit button", () => {
      renderPage();

      expect(screen.getByTestId("logo")).toBeInTheDocument();

      expect(screen.getByText(/time remaining/i)).toBeInTheDocument();
      expect(screen.getByText("58:20")).toBeInTheDocument();

      expect(screen.getByTestId("instruction-renderer")).toHaveTextContent(
        "IELTS Writing Task 2",
      );

      expect(essayInput()).toBeInTheDocument();
      expect(essayInput()).toHaveValue("This is my essay answer");

      expect(screen.getByText(/words count/i)).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /exit test/i }),
      ).toBeInTheDocument();

      expect(submitButton()).toBeInTheDocument();
    });

    test("renders empty essay and zero word count when there is no answer", () => {
      mockState.answers = {};

      renderPage();

      expect(essayInput()).toHaveValue("");
      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });

  describe("answer behavior", () => {
    test("calls onAnswerChange when user types in textarea", async () => {
      const user = userEvent.setup();

      renderPage();

      await user.type(essayInput(), " more text");

      expect(mockOnAnswerChange).toHaveBeenCalled();
      expect(mockOnAnswerChange).toHaveBeenCalledWith(1, expect.any(Array));
    });
  });

  describe("submit modal", () => {
    test("opens submit confirmation modal when Submit is clicked", async () => {
      await openSubmitModal();

      expect(screen.getByText("Submit Test?")).toBeInTheDocument();

      expect(
        screen.getByText(/are you sure you want to submit your test/i),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /continue test/i }),
      ).toBeInTheDocument();
    });

    test("closes submit confirmation modal when Continue Test is clicked", async () => {
      const user = await openSubmitModal();

      await user.click(screen.getByRole("button", { name: /continue test/i }));

      expect(screen.queryByText("Submit Test?")).not.toBeInTheDocument();
    });

    test("opens submit modal automatically when time expires", async () => {
      mockState.secondsRemaining = 0;
      mockState.isExpired = true;

      renderPage();

      await waitFor(() => {
        expect(screen.getByText("Submit Test?")).toBeInTheDocument();
      });

      expect(screen.getByText(/time is up/i)).toBeInTheDocument();

      expect(
        screen.queryByRole("button", { name: /continue test/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("submit flow", () => {
    test("submits writing answer, creates AI feedback, increments attempt, and navigates to result page", async () => {
      await openSubmitModal();
      await confirmSubmit();

      await waitFor(() => {
        expect(mockPostUserSubmission).toHaveBeenCalledWith({
          userId: "user-123",
          practiceContentId: "writing-123",
          timeSpentSeconds: 100,
          learnerTestActivities: [
            {
              activityType: "TEST_START",
            },
            {
              activityType: "TEST_SUBMIT",
            },
          ],
        });
      });

      expect(mockLogActivity).toHaveBeenCalledWith({
        activityType: "TEST_SUBMIT",
      });

      expect(mockPostWritingAnswer).toHaveBeenCalledWith({
        userPracticeSubmissionId: "submission-123",
        orderIndex: "1",
        essayText: "This is my essay answer",
      });

      expect(mockPostAIFeedback).toHaveBeenCalledWith({
        submissionId: "submission-123",
      });

      expect(mockPostAttemptIncrement).toHaveBeenCalled();

      expect(mockNavigate).toHaveBeenCalledWith("/test/result/submission-123");
    });

    test("submits with empty userId when user is missing", async () => {
      vi.mocked(useAuth).mockReturnValue({
        user: null,
      } as any);

      await openSubmitModal();
      await confirmSubmit();

      await waitFor(() => {
        expect(mockPostUserSubmission).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: "",
            practiceContentId: "writing-123",
          }),
        );
      });

      expect(mockAttemptHookArgs).toHaveBeenCalledWith("", "writing-123");
    });

    test("submits with empty submission id when submission id is missing", async () => {
      mockPostUserSubmission.mockResolvedValue({});

      await openSubmitModal();
      await confirmSubmit();

      await waitFor(() => {
        expect(mockPostWritingAnswer).toHaveBeenCalledWith({
          userPracticeSubmissionId: "",
          orderIndex: "1",
          essayText: "This is my essay answer",
        });
      });

      expect(mockPostAIFeedback).toHaveBeenCalledWith({
        submissionId: "",
      });

      expect(mockNavigate).toHaveBeenCalledWith("/test/result/undefined");
    });

    test("submits empty essay text when no writing answer exists", async () => {
      mockState.answers = {};

      await openSubmitModal();
      await confirmSubmit();

      await waitFor(() => {
        expect(mockPostWritingAnswer).toHaveBeenCalledWith(
          expect.objectContaining({
            essayText: "",
          }),
        );
      });
    });
  });

  describe("exit modal", () => {
    test("clicking Exit test opens exit modal", async () => {
      const user = userEvent.setup();

      renderPage();

      await user.click(screen.getByRole("button", { name: /exit test/i }));

      expect(mockOpenExitModal).toHaveBeenCalled();
    });

    test("renders exit modal and cancels exit", async () => {
      const user = userEvent.setup();

      mockState.showExitModal = true;

      renderPage();

      expect(screen.getByText("Exit Test?")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /cancel/i }));

      expect(mockSetShowExitModal).toHaveBeenCalledWith(false);
    });

    test("confirms exit from exit modal", async () => {
      const user = userEvent.setup();

      mockState.showExitModal = true;

      renderPage();

      await user.click(screen.getByRole("button", { name: /^exit$/i }));

      expect(mockConfirmExit).toHaveBeenCalled();
    });
  });
});
