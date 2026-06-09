import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { ListeningReadingResultScreen } from "../components/ListeningReadingResultScreen";
import { useAuth } from "../../../contexts/AuthContext.tsx";

const {
  mockState,
  mockGetPracticeSubmission,
  mockGetPracticeContent,
  mockGetPracticeContentAnswers,
  mockGetPracticeSubmissionAnswers,
  mockGetUserData,
} = vi.hoisted(() => ({
  mockState: {
    submission: {
      practiceSubmissionId: "submission-123",
      practiceContentId: "content-123",
      userId: "user-123",
      timeSpentSeconds: 125,
      correctAnswerCount: 2,
      wrongAnswerCount: 1,
      skipAnswerCount: 1,
      submittedAt: "2026-01-01T10:00:00",
    },
    practiceContent: {
      title: "Mock Listening Test",
      skill: "LISTENING",
    },
    correctAnswers: [
      { orderIndex: 1, correctAnswers: ["A"] },
      { orderIndex: 2, correctAnswers: ["B"] },
      { orderIndex: 3, correctAnswers: ["C"] },
      { orderIndex: 4, correctAnswers: ["D"] },
    ],
    submissionAnswers: [
      { orderIndex: 1, answers: ["A"], result: "CORRECT" },
      { orderIndex: 2, answers: ["X"], result: "WRONG" },
      { orderIndex: 3, answers: [], result: "SKIPPED" },
      { orderIndex: 4, answers: ["D"], result: "CORRECT" },
    ],
    userData: {
      firstname: "Duy",
      lastname: "Huynh",
    },
  },

  mockGetPracticeSubmission: vi.fn(),
  mockGetPracticeContent: vi.fn(),
  mockGetPracticeContentAnswers: vi.fn(),
  mockGetPracticeSubmissionAnswers: vi.fn(),
  mockGetUserData: vi.fn(),
}));

vi.mock("../../../contexts/AuthContext.tsx", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../../components/Footer", () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
}));

vi.mock("../../../components/NavBarUnified.tsx", () => ({
  NavBarUnified: () => <div data-testid="navbar">Navbar</div>,
}));

vi.mock("../../../components/ui/badge.tsx", () => ({
  Badge: ({ children }: any) => <div data-testid="badge">{children}</div>,
}));

vi.mock("../components/index.ts", () => ({
  FeedbackSection: ({ submissionId }: { submissionId: string }) => (
    <div data-testid="feedback-section">Feedback Section - {submissionId}</div>
  ),

  ReviewListening: ({ exerciseId }: { exerciseId?: string }) => (
    <div data-testid="review-listening">Review Listening - {exerciseId}</div>
  ),

  ReviewReading: ({ exerciseId }: { exerciseId?: string }) => (
    <div data-testid="review-reading">Review Reading - {exerciseId}</div>
  ),

  TutorStatusButtons: ({
    submissionId,
    onTutorStatusChange,
  }: {
    submissionId: string;
    onTutorStatusChange: (status: string) => void;
  }) => (
    <div data-testid="tutor-status-buttons">
      Tutor Status Buttons - {submissionId}
      <button onClick={() => onTutorStatusChange("APPROVED")}>
        Mark Reviewed
      </button>
      <button onClick={() => onTutorStatusChange("PENDING")}>
        Mark Pending
      </button>
    </div>
  ),
}));

vi.mock("../utils", () => ({
  formatTime: (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  },

  indexByOrderIndex: (answers: any[] = []) =>
    answers.reduce(
      (acc, answer) => {
        acc[answer.orderIndex] = answer;
        return acc;
      },
      {} as Record<number, any>,
    ),

  mapPracticeSkill: (skill?: string) => {
    if (skill === "LISTENING") return "Listening";
    if (skill === "READING") return "Reading";
    return "";
  },

  formatLocalDateTime: (value?: string) => (value ? "01/01/2026 10:00" : ""),
}));

vi.mock("../hooks", () => ({
  useGetPracticeSubmission: () => ({
    get: mockGetPracticeSubmission,
    submission: mockState.submission,
  }),

  useGetPracticeContent: () => ({
    get: mockGetPracticeContent,
    practiceContent: mockState.practiceContent,
  }),

  useGetPracticeContentAnswers: () => ({
    get: mockGetPracticeContentAnswers,
    answers: mockState.correctAnswers,
  }),

  useGetPracticeSubmissionAnswers: () => ({
    get: mockGetPracticeSubmissionAnswers,
    answers: mockState.submissionAnswers,
  }),

  useGetUserData: () => ({
    get: mockGetUserData,
    userData: mockState.userData,
  }),
}));

const renderPage = (submissionId = "submission-123") =>
  render(<ListeningReadingResultScreen submissionId={submissionId} />);

const mockStudentUser = () => {
  vi.mocked(useAuth).mockReturnValue({
    user: {
      id: "user-123",
      role: "student",
    },
  } as any);
};

const mockTutorUser = () => {
  vi.mocked(useAuth).mockReturnValue({
    user: {
      id: "tutor-123",
      role: "tutor",
    },
  } as any);
};

const resetMockState = () => {
  Object.assign(mockState, {
    submission: {
      practiceSubmissionId: "submission-123",
      practiceContentId: "content-123",
      userId: "user-123",
      timeSpentSeconds: 125,
      correctAnswerCount: 2,
      wrongAnswerCount: 1,
      skipAnswerCount: 1,
      submittedAt: "2026-01-01T10:00:00",
    },
    practiceContent: {
      title: "Mock Listening Test",
      skill: "LISTENING",
    },
    correctAnswers: [
      { orderIndex: 1, correctAnswers: ["A"] },
      { orderIndex: 2, correctAnswers: ["B"] },
      { orderIndex: 3, correctAnswers: ["C"] },
      { orderIndex: 4, correctAnswers: ["D"] },
    ],
    submissionAnswers: [
      { orderIndex: 1, answers: ["A"], result: "CORRECT" },
      { orderIndex: 2, answers: ["X"], result: "WRONG" },
      { orderIndex: 3, answers: [], result: "SKIPPED" },
      { orderIndex: 4, answers: ["D"], result: "CORRECT" },
    ],
    userData: {
      firstname: "Duy",
      lastname: "Huynh",
    },
  });
};

describe("ListeningReadingResultScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMockState();
    mockStudentUser();
  });

  describe("data loading", () => {
    test("fetches submission, content, answer keys, submission answers, and user data", async () => {
      renderPage();

      await waitFor(() => {
        expect(mockGetPracticeSubmission).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockGetPracticeContent).toHaveBeenCalled();
        expect(mockGetPracticeContentAnswers).toHaveBeenCalled();
        expect(mockGetPracticeSubmissionAnswers).toHaveBeenCalled();
        expect(mockGetUserData).toHaveBeenCalled();
      });
    });

    test("does not fetch data when submissionId and dependent ids are missing", () => {
      (mockState as any).submission = undefined;
      (mockState as any).practiceContent = undefined;
      mockState.correctAnswers = [];
      mockState.submissionAnswers = [];
      (mockState as any).userData = undefined;

      renderPage("");

      expect(mockGetPracticeSubmission).not.toHaveBeenCalled();
      expect(mockGetPracticeContent).not.toHaveBeenCalled();
      expect(mockGetPracticeContentAnswers).not.toHaveBeenCalled();
      expect(mockGetPracticeSubmissionAnswers).not.toHaveBeenCalled();
      expect(mockGetUserData).not.toHaveBeenCalled();
    });
  });

  describe("student result rendering", () => {
    test("renders listening result summary, answer keys, review section, and feedback section", () => {
      renderPage();

      expect(screen.getByTestId("navbar")).toBeInTheDocument();
      expect(screen.getByTestId("footer")).toBeInTheDocument();

      expect(screen.getByText("Mock Listening Test")).toBeInTheDocument();
      expect(screen.getByTestId("badge")).toHaveTextContent(/completed/i);

      expect(screen.getByText("Duy Huynh")).toBeInTheDocument();
      expect(screen.getByText("Listening")).toBeInTheDocument();
      expect(screen.getByText("01/01/2026 10:00")).toBeInTheDocument();

      expect(screen.getByText("Result")).toBeInTheDocument();
      expect(screen.getByText("50%")).toBeInTheDocument();

      expect(screen.getByText("Time Spent")).toBeInTheDocument();
      expect(screen.getByText("2:05")).toBeInTheDocument();

      expect(screen.getByText("Correct")).toBeInTheDocument();
      expect(screen.getByText("2 questions")).toBeInTheDocument();

      expect(screen.getByText("Wrong")).toBeInTheDocument();
      expect(screen.getAllByText("1 questions").length).toBeGreaterThanOrEqual(
        2,
      );

      expect(screen.getByText("Skip")).toBeInTheDocument();

      expect(screen.getByText("Answer Keys")).toBeInTheDocument();

      expect(screen.getByText("(empty)")).toBeInTheDocument();
      expect(screen.getByText("X")).toBeInTheDocument();
      expect(screen.getByText("B")).toBeInTheDocument();

      expect(screen.getByTestId("review-listening")).toHaveTextContent(
        "Review Listening - content-123",
      );

      expect(screen.queryByTestId("review-reading")).not.toBeInTheDocument();

      expect(screen.getByTestId("feedback-section")).toHaveTextContent(
        "Feedback Section - submission-123",
      );
    });

    test("renders reading review section when practice content skill is READING", () => {
      mockState.practiceContent = {
        title: "Mock Reading Test",
        skill: "READING",
      };

      renderPage();

      expect(screen.getByText("Mock Reading Test")).toBeInTheDocument();
      expect(screen.getByText("Reading")).toBeInTheDocument();

      expect(screen.getByTestId("review-reading")).toHaveTextContent(
        "Review Reading - content-123",
      );

      expect(screen.queryByTestId("review-listening")).not.toBeInTheDocument();
    });

    test("renders zero percentage and fallback metadata when counts and optional data are missing", () => {
      mockState.submission = {
        practiceSubmissionId: "submission-123",
        practiceContentId: "content-123",
        userId: "user-123",
        timeSpentSeconds: undefined,
        correctAnswerCount: undefined,
        wrongAnswerCount: undefined,
        skipAnswerCount: undefined,
        submittedAt: undefined,
      } as any;

      mockState.practiceContent = {
        title: undefined,
        skill: undefined,
      } as any;

      mockState.correctAnswers = [];
      mockState.submissionAnswers = [];
      mockState.userData = {
        firstname: undefined,
        lastname: undefined,
      } as any;

      renderPage();

      expect(screen.getByText("0%")).toBeInTheDocument();
      expect(screen.getByText("0:00")).toBeInTheDocument();
      expect(screen.getAllByText("0 questions").length).toBeGreaterThanOrEqual(
        3,
      );

      expect(screen.queryByTestId("review-listening")).not.toBeInTheDocument();
      expect(screen.queryByTestId("review-reading")).not.toBeInTheDocument();
      expect(screen.getByTestId("feedback-section")).toBeInTheDocument();
    });

    test("formats multiple correct answers and multiple submitted answers", () => {
      mockState.correctAnswers = [
        {
          orderIndex: 1,
          correctAnswers: ["A", "B"],
        },
      ];

      mockState.submissionAnswers = [
        {
          orderIndex: 1,
          answers: ["X", "Y"],
          result: "WRONG",
        },
      ];

      renderPage();

      expect(screen.getByText("X, Y")).toBeInTheDocument();
      expect(screen.getByText("A, B")).toBeInTheDocument();
    });
  });

  describe("tutor feedback visibility", () => {
    test("shows tutor status buttons for tutor and hides feedback while status is not selected", () => {
      mockTutorUser();

      renderPage();

      expect(screen.getByTestId("tutor-status-buttons")).toHaveTextContent(
        "Tutor Status Buttons - submission-123",
      );

      expect(screen.queryByTestId("feedback-section")).not.toBeInTheDocument();
    });

    test("shows feedback section for tutor after tutor status changes to approved", async () => {
      const user = userEvent.setup();

      mockTutorUser();

      renderPage();

      expect(screen.queryByTestId("feedback-section")).not.toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /mark reviewed/i }));

      await waitFor(() => {
        expect(screen.getByTestId("feedback-section")).toBeInTheDocument();
      });

      expect(screen.getByTestId("feedback-section")).toHaveTextContent(
        "Feedback Section - submission-123",
      );
    });

    test("keeps feedback hidden for tutor when tutor status is pending", async () => {
      const user = userEvent.setup();

      mockTutorUser();

      renderPage();

      await user.click(screen.getByRole("button", { name: /mark pending/i }));

      expect(screen.queryByTestId("feedback-section")).not.toBeInTheDocument();
    });
  });
});
