import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { ListeningTestScreen } from "../components/ListeningTestScreen";
import { useAuth } from "../../../contexts/AuthContext.tsx";

const {
  mockNavigate,
  mockGetListeningExercise,
  mockPostUserSubmission,
  mockPostUserAnswersBulk,
  mockPostAttemptIncrement,
  mockLogActivity,
  mockGetQueuedActivities,
  mockTogglePlay,
  mockHandleSeek,
  mockHandleLoadedMetadata,
  mockHandleTimeUpdate,
  mockHandleEnded,
  mockOpenExitModal,
  mockConfirmExit,
  mockSetShowExitModal,
  mockAttemptHookArgs,
  mockState,
} = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockGetListeningExercise: vi.fn(),
  mockPostUserSubmission: vi.fn(),
  mockPostUserAnswersBulk: vi.fn(),
  mockPostAttemptIncrement: vi.fn(),
  mockLogActivity: vi.fn(),
  mockGetQueuedActivities: vi.fn(),
  mockTogglePlay: vi.fn(),
  mockHandleSeek: vi.fn(),
  mockHandleLoadedMetadata: vi.fn(),
  mockHandleTimeUpdate: vi.fn(),
  mockHandleEnded: vi.fn(),
  mockOpenExitModal: vi.fn(),
  mockConfirmExit: vi.fn(),
  mockSetShowExitModal: vi.fn(),
  mockAttemptHookArgs: vi.fn(),

  mockState: {
    exercise: {
      totalQuestions: 3,
      duration: 40,
      audioUrl: "listening-audio.mp3",
      examText: {
        title: "Listening Test",
      },
      skill: "LISTENING",
    },
    answers: {
      1: ["A"],
      2: ["B"],
      bad: ["ignored"],
    },
    secondsRemaining: 2300,
    isExpired: false,
    elapsedMs: 100000,
    audio: {
      isPlaying: false,
      currentTime: 0,
      duration: 120,
      audioProgress: 25,
    },
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
    <div data-testid="instruction-renderer">{instruction?.title}</div>
  ),
}));

vi.mock("../../../env.ts", () => ({
  API_BASE: "http://localhost:8080",
}));

vi.mock("../utils", () => ({
  formatTime: (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  },

  buildAudioUrl: (base: string, audioUrl: string) => `${base}/${audioUrl}`,
}));

vi.mock("../hooks/index.ts", () => ({
  useGetListeningExercise: () => ({
    get: mockGetListeningExercise,
    exercise: mockState.exercise,
  }),

  useUserAnswer: () => ({
    answers: mockState.answers,
    onAnswerChange: vi.fn(),
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

  usePostUserAnswersBulk: () => ({
    post: mockPostUserAnswersBulk,
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

  useAudioPlayer: () => ({
    audioRef: { current: null },
    isPlaying: mockState.audio.isPlaying,
    currentTime: mockState.audio.currentTime,
    duration: mockState.audio.duration,
    audioProgress: mockState.audio.audioProgress,
    togglePlay: mockTogglePlay,
    handleSeek: mockHandleSeek,
    handleLoadedMetadata: mockHandleLoadedMetadata,
    handleTimeUpdate: mockHandleTimeUpdate,
    handleEnded: mockHandleEnded,
  }),

  useExitModal: () => ({
    showExitModal: mockState.showExitModal,
    openExitModal: mockOpenExitModal,
    setShowExitModal: mockSetShowExitModal,
    confirmExit: mockConfirmExit,
  }),

  useSubmitModal: vi.fn(),
}));

const renderPage = (exerciseId = "exercise-123") =>
  render(<ListeningTestScreen exerciseId={exerciseId} />);

const submitButton = () => screen.getByRole("button", { name: /^submit$/i });

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

const audioButton = () =>
  screen
    .getAllByRole("button")
    .find((button) => button.className.includes("rounded-full")) as HTMLElement;

const resetMockState = () => {
  Object.assign(mockState, {
    exercise: {
      totalQuestions: 3,
      duration: 40,
      audioUrl: "listening-audio.mp3",
      examText: {
        title: "Listening Test",
      },
      skill: "LISTENING",
    },
    answers: {
      1: ["A"],
      2: ["B"],
      bad: ["ignored"],
    },
    secondsRemaining: 2300,
    isExpired: false,
    elapsedMs: 100000,
    audio: {
      isPlaying: false,
      currentTime: 0,
      duration: 120,
      audioProgress: 25,
    },
    showExitModal: false,
  });
};

describe("ListeningTestScreen", () => {
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

    mockPostUserAnswersBulk.mockResolvedValue({
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
    test("fetches listening exercise and logs test start when exerciseId exists", async () => {
      renderPage();

      await waitFor(() => {
        expect(mockGetListeningExercise).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockLogActivity).toHaveBeenCalledWith({
          activityType: "TEST_START",
        });
      });

      expect(mockAttemptHookArgs).toHaveBeenCalledWith(
        "user-123",
        "exercise-123",
      );
    });

    test("does not fetch or log test start when exerciseId is empty", () => {
      renderPage("");

      expect(mockGetListeningExercise).not.toHaveBeenCalled();
      expect(mockLogActivity).not.toHaveBeenCalled();
    });
  });

  describe("rendering", () => {
    test("renders header, timer, audio player, questions, navigation buttons, and submit button", () => {
      const { container } = renderPage();

      expect(screen.getByTestId("logo")).toBeInTheDocument();

      expect(screen.getByText(/time remaining/i)).toBeInTheDocument();
      expect(screen.getByText("38:20")).toBeInTheDocument();

      expect(container.querySelector("audio")).toHaveAttribute(
        "src",
        "http://localhost:8080/listening-audio.mp3",
      );

      expect(screen.getByText("0:00")).toBeInTheDocument();
      expect(screen.getByText("2:00")).toBeInTheDocument();

      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuenow",
        "25",
      );

      expect(screen.getByTestId("instruction-renderer")).toHaveTextContent(
        "Listening Test",
      );

      expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();

      expect(submitButton()).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /exit test/i }),
      ).toBeInTheDocument();
    });

    test("marks answered and unanswered question buttons differently", () => {
      renderPage();

      expect(screen.getByRole("button", { name: "1" }).className).toContain(
        "bg-[#1977f3]",
      );

      expect(screen.getByRole("button", { name: "2" }).className).toContain(
        "bg-[#1977f3]",
      );

      expect(screen.getByRole("button", { name: "3" }).className).toContain(
        "bg-white",
      );
    });

    test("renders unanswered question when answer is empty string", () => {
      (mockState as any).answers = {
        1: [""],
      };

      renderPage();

      expect(screen.getByRole("button", { name: "1" }).className).toContain(
        "bg-white",
      );
    });

    test("renders audio fallback values, playing state, and rounded progress", () => {
      mockState.exercise.audioUrl = "";
      mockState.audio.isPlaying = true;
      mockState.audio.currentTime = 65;
      mockState.audio.duration = 180;
      mockState.audio.audioProgress = 49.6;

      const { container } = renderPage();

      expect(container.querySelector("audio")).toHaveAttribute(
        "src",
        "http://localhost:8080/",
      );

      expect(screen.getByText("1:05")).toBeInTheDocument();
      expect(screen.getByText("3:00")).toBeInTheDocument();

      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuenow",
        "50",
      );
    });
  });

  describe("audio behavior", () => {
    test("clicking play button toggles audio playback", async () => {
      const user = userEvent.setup();

      renderPage();

      await user.click(audioButton());

      expect(mockTogglePlay).toHaveBeenCalled();
    });

    test("clicking progress bar seeks audio", async () => {
      const user = userEvent.setup();

      renderPage();

      await user.click(screen.getByRole("progressbar"));

      expect(mockHandleSeek).toHaveBeenCalled();
    });

    test("audio element calls audio event handlers", () => {
      const { container } = renderPage();

      const audio = container.querySelector("audio") as HTMLAudioElement;

      fireEvent.loadedMetadata(audio);
      fireEvent.timeUpdate(audio);
      fireEvent.ended(audio);

      expect(mockHandleLoadedMetadata).toHaveBeenCalled();
      expect(mockHandleTimeUpdate).toHaveBeenCalled();
      expect(mockHandleEnded).toHaveBeenCalled();
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
    test("submits test, posts answers, increments attempt, and navigates to result page", async () => {
      await openSubmitModal();
      await confirmSubmit();

      await waitFor(() => {
        expect(mockPostUserSubmission).toHaveBeenCalledWith({
          userId: "user-123",
          practiceContentId: "exercise-123",
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

      expect(mockPostUserAnswersBulk).toHaveBeenCalledWith({
        userPracticeSubmissionId: "submission-123",
        answers: [
          {
            orderIndex: 1,
            answers: ["A"],
          },
          {
            orderIndex: 2,
            answers: ["B"],
          },
        ],
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
            practiceContentId: "exercise-123",
          }),
        );
      });

      expect(mockAttemptHookArgs).toHaveBeenCalledWith("", "exercise-123");
    });

    test("submits with empty submission id and empty answers when submission id and answer values are missing", async () => {
      mockPostUserSubmission.mockResolvedValue({});

      (mockState as any).answers = {
        1: undefined,
      };

      await openSubmitModal();
      await confirmSubmit();

      await waitFor(() => {
        expect(mockPostUserAnswersBulk).toHaveBeenCalledWith({
          userPracticeSubmissionId: "",
          answers: [
            {
              orderIndex: 1,
              answers: [],
            },
          ],
        });
      });

      expect(mockNavigate).toHaveBeenCalledWith("/test/result/undefined");
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
