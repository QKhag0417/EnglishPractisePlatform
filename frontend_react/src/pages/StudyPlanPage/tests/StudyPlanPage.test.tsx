import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import StudyPlanPage from "../StudyPlanPage";
import { useAuth } from "../../../contexts/AuthContext";

const {
  mockAnalyticsSubmissionCountsGet,
  mockHasActiveStudyPlanGet,
  mockActiveStudyPlanGet,
  mockPostStudyPlan,
  mockRefreshStudyPlan,
  mockFinalizeStudyPlan,
  mockState,
} = vi.hoisted(() => ({
  mockAnalyticsSubmissionCountsGet: vi.fn(),
  mockHasActiveStudyPlanGet: vi.fn(),
  mockActiveStudyPlanGet: vi.fn(),
  mockPostStudyPlan: vi.fn(),
  mockRefreshStudyPlan: vi.fn(),
  mockFinalizeStudyPlan: vi.fn(),

  mockState: {
    analyticsSubmissionCounts: {
      listeningCount: 3,
      readingCount: 6,
      writingCount: 0,
      speakingCount: 0,
    },
    hasActiveStudyPlan: false,
    activeStudyPlan: null as any,
  },
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

vi.mock("../hooks", () => ({
  useGetAnalyticsSubmissionCountsByUserId: () => ({
    get: mockAnalyticsSubmissionCountsGet,
    analyticsSubmissionCounts: mockState.analyticsSubmissionCounts,
  }),

  useGetHasActiveStudyPlan: () => ({
    get: mockHasActiveStudyPlanGet,
  }),

  useGetActiveStudyPlanByUserIdAndSkill: () => ({
    get: mockActiveStudyPlanGet,
  }),

  usePostLearnerStudyPlan: () => ({
    post: mockPostStudyPlan,
  }),

  usePutRefreshStudyPlan: () => ({
    put: mockRefreshStudyPlan,
  }),

  usePutFinalizeLearnerStudyPlanById: () => ({
    put: mockFinalizeStudyPlan,
  }),
}));

vi.mock("../types", () => ({
  mapSkillTypeApiTypeToUi: (skill: string) => {
    const map: Record<string, string> = {
      LISTENING: "Listening",
      READING: "Reading",
      WRITING: "Writing",
      SPEAKING: "Speaking",
    };

    return map[skill] ?? skill;
  },

  mapDirectionApiTypeToUi: (direction: string) => {
    const map: Record<string, string> = {
      INCREASE: "Increase",
      DECREASE: "Decrease",
      MAINTAIN: "Maintain",
    };

    return map[direction] ?? direction;
  },

  mapFocusTypeApiTypeToUi: (focusType: string) => {
    const map: Record<string, string> = {
      QUESTION_TYPE: "Question Type",
      TOPIC_TAG: "Topic Tag",
    };

    return map[focusType] ?? focusType;
  },

  mapTargetMetricApiTypeToUi: (metric: string) => {
    const map: Record<string, string> = {
      ACCURACY: "Accuracy",
      SPEED: "Speed",
    };

    return map[metric] ?? metric;
  },

  mapTaskStatusApiTypeToUi: (status: string) => {
    const map: Record<string, string> = {
      COMPLETED: "Completed",
      PENDING: "Pending",
      IN_PROGRESS: "In Progress",
    };

    return map[status] ?? status;
  },
}));

vi.mock("../utils", () => ({
  getDirectionIcon: () => <span data-testid="direction-icon">Icon</span>,
  getTaskStatusColor: () => "task-status-color",
}));

vi.mock("../../ListeningContentEditorPage/types", () => ({
  mapTopicTagApiToUi: (topicTag: string) => {
    const map: Record<string, string> = {
      EDUCATION: "Education",
      SCIENCE: "Science",
    };

    return map[topicTag] ?? topicTag;
  },
}));

vi.mock("../../MyProfilePage/types", () => ({
  mapQuestionApiTypeToUi: (_skill: string, questionType: string) => {
    const map: Record<string, string> = {
      MULTIPLE_CHOICE: "Multiple Choice",
      MATCHING: "Matching",
    };

    return map[questionType] ?? questionType;
  },
}));

const activeStudyPlanMock = {
  id: "study-plan-123",
  submissionCountSinceCreation: 5,
  readyToFinalize: true,
  tasks: [
    {
      status: "COMPLETED",
      focusType: "QUESTION_TYPE",
      questionType: "MULTIPLE_CHOICE",
      topicTag: null,
      targetMetric: "ACCURACY",
      currentValue: 60,
      targetValue: 80,
      direction: "INCREASE",
      description: "Practice multiple choice questions.",
    },
    {
      status: "PENDING",
      focusType: "TOPIC_TAG",
      questionType: null,
      topicTag: "EDUCATION",
      targetMetric: "ACCURACY",
      currentValue: 40,
      targetValue: 70,
      direction: "INCREASE",
      description: "Improve education topic performance.",
    },
  ],
  strengthBlocks: [
    {
      focusType: "QUESTION_TYPE",
      questionType: "MATCHING",
      topicTag: null,
      description: "Strong matching performance.",
      explanation: "You often answer matching questions correctly.",
      evidence: "Recent submissions show high accuracy.",
      recommendedNextAction: "Maintain this skill.",
    },
  ],
  weaknessBlocks: [
    {
      focusType: "TOPIC_TAG",
      questionType: null,
      topicTag: "SCIENCE",
      description: "Science topic needs improvement.",
      explanation: "You miss science-related questions often.",
      evidence: "Recent submissions show low accuracy.",
      recommendedNextAction: "Practice science passages.",
    },
  ],
};

const emptyActiveStudyPlanMock = {
  id: "study-plan-empty",
  submissionCountSinceCreation: 0,
  readyToFinalize: false,
  tasks: [],
  strengthBlocks: [],
  weaknessBlocks: [],
};

const renderPage = () => render(<StudyPlanPage />);

const mockUser = (user: any = { id: "user-123" }) => {
  vi.mocked(useAuth).mockReturnValue({
    user,
  } as any);
};

const resetMockState = () => {
  mockState.analyticsSubmissionCounts = {
    listeningCount: 3,
    readingCount: 6,
    writingCount: 0,
    speakingCount: 0,
  };

  mockState.hasActiveStudyPlan = false;
  mockState.activeStudyPlan = null;
};

describe("StudyPlanPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMockState();
    mockUser();

    mockAnalyticsSubmissionCountsGet.mockResolvedValue(undefined);

    mockHasActiveStudyPlanGet.mockImplementation(async () => ({
      hasActiveStudyPlan: mockState.hasActiveStudyPlan,
    }));

    mockActiveStudyPlanGet.mockImplementation(
      async () => mockState.activeStudyPlan,
    );

    mockPostStudyPlan.mockResolvedValue({
      success: true,
    });

    mockRefreshStudyPlan.mockResolvedValue({
      success: true,
    });

    mockFinalizeStudyPlan.mockResolvedValue({
      success: true,
    });
  });

  describe("initial rendering and loading", () => {
    test("renders page layout, skill buttons, navbar, footer, and loads user submission counts", async () => {
      renderPage();

      expect(screen.getByTestId("navbar")).toBeInTheDocument();
      expect(screen.getByTestId("footer")).toBeInTheDocument();

      expect(screen.getByText("My Study Plan")).toBeInTheDocument();

      expect(
        screen.getByText(
          "Personalized learning path based on your performance analysis",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: "Listening" }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: "Reading" }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: "Writing" }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: "Speaking" }),
      ).toBeInTheDocument();

      await waitFor(() => {
        expect(mockAnalyticsSubmissionCountsGet).toHaveBeenCalledWith({
          userId: "user-123",
        });
      });

      await waitFor(() => {
        expect(mockHasActiveStudyPlanGet).toHaveBeenCalledWith({
          userId: "user-123",
          skill: "LISTENING",
        });
      });
    });

    test("does not load study plan data when user is missing", () => {
      mockUser(null);

      renderPage();

      expect(mockAnalyticsSubmissionCountsGet).not.toHaveBeenCalled();
      expect(mockHasActiveStudyPlanGet).not.toHaveBeenCalled();
      expect(mockActiveStudyPlanGet).not.toHaveBeenCalled();
    });
  });

  describe("study plan requirement states", () => {
    test("shows requirement banner and disables enable button when selected skill has too few submissions", () => {
      renderPage();

      expect(
        screen.getByText(/Complete More Listening Submissions/i),
      ).toBeInTheDocument();

      expect(screen.getByText(/3\/5/i)).toBeInTheDocument();

      expect(
        screen.getByText(/Complete 2 more submissions/i),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /enable study plan/i }),
      ).toBeDisabled();
    });

    test("shows ready banner and enables button when selected skill has enough submissions", async () => {
      const user = userEvent.setup();

      renderPage();

      await user.click(screen.getByRole("button", { name: "Reading" }));

      expect(
        await screen.findByText(/Ready to Enable Your Reading Study Plan/i),
      ).toBeInTheDocument();

      expect(screen.getByText(/Requirements met/i)).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /enable study plan/i }),
      ).not.toBeDisabled();

      await waitFor(() => {
        expect(mockHasActiveStudyPlanGet).toHaveBeenCalledWith({
          userId: "user-123",
          skill: "READING",
        });
      });
    });

    test("changes selected skill and shows the correct requirement banner", async () => {
      const user = userEvent.setup();

      renderPage();

      await user.click(screen.getByRole("button", { name: "Writing" }));

      expect(
        screen.getByText(/Complete More Writing Submissions/i),
      ).toBeInTheDocument();

      expect(screen.getByText(/0\/5/i)).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /enable study plan/i }),
      ).toBeDisabled();
    });

    test("treats missing analytics submission counts as zero", () => {
      mockState.analyticsSubmissionCounts = {} as any;

      renderPage();

      expect(
        screen.getByText(/Complete More Listening Submissions/i),
      ).toBeInTheDocument();

      expect(screen.getByText(/0\/5/i)).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /enable study plan/i }),
      ).toBeDisabled();
    });

    test("renders singular submission text when only one more submission is needed", () => {
      mockState.analyticsSubmissionCounts = {
        listeningCount: 4,
        readingCount: 0,
        writingCount: 0,
        speakingCount: 0,
      };

      renderPage();

      expect(screen.getByText(/4\/5/i)).toBeInTheDocument();
      expect(screen.getByText(/Complete 1 more/i)).toBeInTheDocument();
      expect(document.body).toHaveTextContent("submission to unlock");
    });
  });

  describe("has active study plan loading", () => {
    test("handles undefined hasActiveStudyPlan response as false", async () => {
      mockHasActiveStudyPlanGet.mockResolvedValue(undefined);

      renderPage();

      await waitFor(() => {
        expect(mockHasActiveStudyPlanGet).toHaveBeenCalledWith({
          userId: "user-123",
          skill: "LISTENING",
        });
      });

      expect(screen.queryByText("Active Tasks")).not.toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /enable study plan/i }),
      ).toBeInTheDocument();
    });
  });

  describe("enable study plan flow", () => {
    test("enables study plan and renders active plan sections", async () => {
      const user = userEvent.setup();

      renderPage();

      await user.click(screen.getByRole("button", { name: "Reading" }));

      expect(
        await screen.findByText(/Ready to Enable Your Reading Study Plan/i),
      ).toBeInTheDocument();

      mockState.hasActiveStudyPlan = true;
      mockState.activeStudyPlan = activeStudyPlanMock;

      await user.click(
        screen.getByRole("button", { name: /enable study plan/i }),
      );

      await waitFor(() => {
        expect(mockPostStudyPlan).toHaveBeenCalledWith({
          learnerId: "user-123",
          skill: "READING",
        });
      });

      await waitFor(() => {
        expect(mockActiveStudyPlanGet).toHaveBeenCalledWith({
          userId: "user-123",
          skill: "READING",
        });
      });

      expect(screen.getByText("Finalize Study Plan")).toBeInTheDocument();

      expect(screen.getByText("Active Tasks")).toBeInTheDocument();
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Task 2")).toBeInTheDocument();

      expect(
        screen.getByText("Practice multiple choice questions."),
      ).toBeInTheDocument();

      expect(
        screen.getByText("Improve education topic performance."),
      ).toBeInTheDocument();

      expect(screen.getByText("Strength Blocks")).toBeInTheDocument();

      expect(
        screen.getByText("Strong matching performance."),
      ).toBeInTheDocument();

      expect(screen.getByText("Weakness Blocks")).toBeInTheDocument();

      expect(
        screen.getByText("Science topic needs improvement."),
      ).toBeInTheDocument();
    });

    test("does not fetch active plan after enabling when backend still says there is no active plan", async () => {
      const user = userEvent.setup();

      renderPage();

      await user.click(screen.getByRole("button", { name: "Reading" }));

      expect(
        await screen.findByText(/Ready to Enable Your Reading Study Plan/i),
      ).toBeInTheDocument();

      mockState.hasActiveStudyPlan = false;

      await user.click(
        screen.getByRole("button", { name: /enable study plan/i }),
      );

      await waitFor(() => {
        expect(mockPostStudyPlan).toHaveBeenCalledWith({
          learnerId: "user-123",
          skill: "READING",
        });
      });

      expect(screen.queryByText("Active Tasks")).not.toBeInTheDocument();
    });

    test("does not enable study plan when user is missing", async () => {
      const user = userEvent.setup();

      mockUser(null);

      renderPage();

      await user.click(screen.getByRole("button", { name: "Reading" }));

      expect(
        await screen.findByText(/Ready to Enable Your Reading Study Plan/i),
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole("button", { name: /enable study plan/i }),
      );

      expect(mockPostStudyPlan).not.toHaveBeenCalled();
      expect(mockActiveStudyPlanGet).not.toHaveBeenCalled();
    });

    test("does not fetch active plan when enable response is undefined", async () => {
      const user = userEvent.setup();

      mockHasActiveStudyPlanGet.mockResolvedValue(undefined);

      renderPage();

      await user.click(screen.getByRole("button", { name: "Reading" }));

      expect(
        await screen.findByText(/Ready to Enable Your Reading Study Plan/i),
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole("button", { name: /enable study plan/i }),
      );

      await waitFor(() => {
        expect(mockPostStudyPlan).toHaveBeenCalledWith({
          learnerId: "user-123",
          skill: "READING",
        });
      });

      expect(screen.queryByText("Active Tasks")).not.toBeInTheDocument();
    });
  });

  describe("active study plan rendering", () => {
    test("loads and renders active study plan when backend says plan already exists", async () => {
      mockState.hasActiveStudyPlan = true;
      mockState.activeStudyPlan = activeStudyPlanMock;

      renderPage();

      await waitFor(() => {
        expect(mockActiveStudyPlanGet).toHaveBeenCalledWith({
          userId: "user-123",
          skill: "LISTENING",
        });
      });

      expect(screen.getByText("Finalize Study Plan")).toBeInTheDocument();

      expect(screen.getByText("Active Tasks")).toBeInTheDocument();
      expect(screen.getByText("Strength Blocks")).toBeInTheDocument();
      expect(screen.getByText("Weakness Blocks")).toBeInTheDocument();

      expect(screen.getByText("50%")).toBeInTheDocument();
      expect(screen.getByText("1/2 tasks")).toBeInTheDocument();

      expect(screen.getByText("Multiple Choice")).toBeInTheDocument();
      expect(screen.getByText("Education")).toBeInTheDocument();
      expect(screen.getAllByText("Accuracy").length).toBeGreaterThanOrEqual(2);
      expect(screen.getAllByText("Increase").length).toBeGreaterThanOrEqual(2);
    });

    test("renders empty active plan with zero task completion", async () => {
      mockState.hasActiveStudyPlan = true;
      mockState.activeStudyPlan = emptyActiveStudyPlanMock;

      renderPage();

      await waitFor(() => {
        expect(screen.getByText("Finalize Study Plan")).toBeInTheDocument();
      });

      expect(screen.getByText("Active Tasks")).toBeInTheDocument();
      expect(screen.getByText("Strength Blocks")).toBeInTheDocument();
      expect(screen.getByText("Weakness Blocks")).toBeInTheDocument();

      expect(screen.getByText("0%")).toBeInTheDocument();
      expect(screen.getByText("0/0 tasks")).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /finalize study plan/i }),
      ).toBeDisabled();
    });

    test("renders completed finalization requirements when task completion is at least 75 percent", async () => {
      mockState.hasActiveStudyPlan = true;
      mockState.activeStudyPlan = {
        ...activeStudyPlanMock,
        submissionCountSinceCreation: 5,
        tasks: [
          {
            status: "COMPLETED",
            focusType: "QUESTION_TYPE",
            questionType: "MULTIPLE_CHOICE",
            topicTag: null,
            targetMetric: "ACCURACY",
            currentValue: 80,
            targetValue: 90,
            direction: "INCREASE",
            description: "Complete high priority accuracy task.",
          },
        ],
      };

      renderPage();

      await waitFor(() => {
        expect(screen.getByText("Active Tasks")).toBeInTheDocument();
      });

      expect(screen.getByText("100%")).toBeInTheDocument();
      expect(screen.getByText("1/1 tasks")).toBeInTheDocument();

      expect(
        screen.getByText("Complete high priority accuracy task."),
      ).toBeInTheDocument();
    });

    test("renders topic-tag strength and question-type weakness focus keys", async () => {
      mockState.hasActiveStudyPlan = true;
      mockState.activeStudyPlan = {
        ...activeStudyPlanMock,
        strengthBlocks: [
          {
            focusType: "TOPIC_TAG",
            questionType: null,
            topicTag: "SCIENCE",
            description: "Strong science topic performance.",
            explanation: "Science topic answers are consistent.",
            evidence: "Science evidence.",
            recommendedNextAction: "Keep practicing science topics.",
          },
        ],
        weaknessBlocks: [
          {
            focusType: "QUESTION_TYPE",
            questionType: "MATCHING",
            topicTag: null,
            description: "Matching questions need improvement.",
            explanation: "Matching answers are often incorrect.",
            evidence: "Matching evidence.",
            recommendedNextAction: "Practice matching questions.",
          },
        ],
      };

      renderPage();

      await waitFor(() => {
        expect(screen.getByText("Strength Blocks")).toBeInTheDocument();
      });

      expect(
        screen.getByText("Strong science topic performance."),
      ).toBeInTheDocument();

      expect(
        screen.getByText("Matching questions need improvement."),
      ).toBeInTheDocument();

      expect(screen.getByText("Science")).toBeInTheDocument();
      expect(screen.getByText("Matching")).toBeInTheDocument();
    });
  });

  describe("refresh and finalize actions", () => {
    test("refreshes active study plan status", async () => {
      const user = userEvent.setup();

      mockState.hasActiveStudyPlan = true;
      mockState.activeStudyPlan = activeStudyPlanMock;

      renderPage();

      await waitFor(() => {
        expect(screen.getByText("Active Tasks")).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: /refresh/i }));

      await waitFor(() => {
        expect(mockRefreshStudyPlan).toHaveBeenCalledWith({
          userId: "user-123",
          skill: "LISTENING",
        });
      });

      await waitFor(() => {
        expect(mockActiveStudyPlanGet).toHaveBeenCalledWith({
          userId: "user-123",
          skill: "LISTENING",
        });
      });
    });

    test("finalizes active study plan", async () => {
      const user = userEvent.setup();

      mockState.hasActiveStudyPlan = true;
      mockState.activeStudyPlan = activeStudyPlanMock;

      renderPage();

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /finalize study plan/i }),
        ).toBeInTheDocument();
      });

      expect(
        screen.getByRole("button", { name: /finalize study plan/i }),
      ).not.toBeDisabled();

      await user.click(
        screen.getByRole("button", { name: /finalize study plan/i }),
      );

      await waitFor(() => {
        expect(mockFinalizeStudyPlan).toHaveBeenCalledWith({
          studyPlanId: "study-plan-123",
        });
      });

      await waitFor(() => {
        expect(mockHasActiveStudyPlanGet).toHaveBeenCalledWith({
          userId: "user-123",
          skill: "LISTENING",
        });
      });
    });

    test("does not finalize when active study plan is not ready", async () => {
      const user = userEvent.setup();

      mockState.hasActiveStudyPlan = true;
      mockState.activeStudyPlan = {
        ...activeStudyPlanMock,
        readyToFinalize: false,
      };

      renderPage();

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /finalize study plan/i }),
        ).toBeDisabled();
      });

      await user.click(
        screen.getByRole("button", { name: /finalize study plan/i }),
      );

      expect(mockFinalizeStudyPlan).not.toHaveBeenCalled();
    });

    test("does not finalize when active study plan id is missing", async () => {
      const user = userEvent.setup();

      mockState.hasActiveStudyPlan = true;
      mockState.activeStudyPlan = {
        ...activeStudyPlanMock,
        id: undefined,
        readyToFinalize: true,
      };

      renderPage();

      const finalizeButton = await screen.findByRole("button", {
        name: /finalize study plan/i,
      });

      expect(finalizeButton).not.toBeDisabled();

      await user.click(finalizeButton);

      expect(mockFinalizeStudyPlan).not.toHaveBeenCalled();
    });

    test("handles undefined hasActiveStudyPlan response after finalize", async () => {
      const user = userEvent.setup();

      mockState.hasActiveStudyPlan = true;
      mockState.activeStudyPlan = activeStudyPlanMock;

      mockHasActiveStudyPlanGet
        .mockResolvedValueOnce({
          hasActiveStudyPlan: true,
        })
        .mockResolvedValueOnce(undefined);

      mockActiveStudyPlanGet.mockResolvedValue(activeStudyPlanMock);

      renderPage();

      const finalizeButton = await screen.findByRole("button", {
        name: /finalize study plan/i,
      });

      await user.click(finalizeButton);

      await waitFor(() => {
        expect(mockFinalizeStudyPlan).toHaveBeenCalledWith({
          studyPlanId: "study-plan-123",
        });
      });
    });
  });
});
