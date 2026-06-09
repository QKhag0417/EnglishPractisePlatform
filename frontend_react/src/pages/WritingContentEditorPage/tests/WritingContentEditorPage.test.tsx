import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { WritingContentEditorPage } from "../WritingContentEditorPage";
import { useWritingEditorState } from "../hooks/useWritingEditorState";

const {
  mockNavigate,
  mockUseParams,

  mockSetStatus,
  mockSetInstructions,
  mockSetTitle,
  mockSetTask,
  mockSetDurationMinutes,

  mockSetQuestionTypes,
  mockSetTopicTags,

  mockThumbnailInputClick,
  mockHandleThumbnailChange,
  mockHandleThumbnailDrop,
  mockHandleDragOver,
  mockHandleSaveThumbnail,
  mockHandleRemoveThumbnail,

  mockHandleMultiImageChange,
  mockHandleSaveImage,
  mockHandleRemoveImage,
  mockHandleCopyUrl,
  mockSetHasImageChanges,

  mockHandleSaveExit,
} = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockUseParams: vi.fn(),

  mockSetStatus: vi.fn(),
  mockSetInstructions: vi.fn(),
  mockSetTitle: vi.fn(),
  mockSetTask: vi.fn(),
  mockSetDurationMinutes: vi.fn(),

  mockSetQuestionTypes: vi.fn(),
  mockSetTopicTags: vi.fn(),

  mockThumbnailInputClick: vi.fn(),
  mockHandleThumbnailChange: vi.fn(),
  mockHandleThumbnailDrop: vi.fn(),
  mockHandleDragOver: vi.fn(),
  mockHandleSaveThumbnail: vi.fn(),
  mockHandleRemoveThumbnail: vi.fn(),

  mockHandleMultiImageChange: vi.fn(),
  mockHandleSaveImage: vi.fn(),
  mockHandleRemoveImage: vi.fn(),
  mockHandleCopyUrl: vi.fn(),
  mockSetHasImageChanges: vi.fn(),

  mockHandleSaveExit: vi.fn(),
}));

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
}));

vi.mock("../hooks/useWritingEditorState", () => ({
  useWritingEditorState: vi.fn(),
}));

vi.mock("../../../components/NavBarUnified", () => ({
  NavBarUnified: () => <div data-testid="navbar">Navbar</div>,
}));

vi.mock("../../../components/Footer", () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
}));

vi.mock("../../../components/ui/label", () => ({
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
}));

vi.mock("../../../components/ui/textarea", () => ({
  Textarea: (props: any) => <textarea {...props} />,
}));

vi.mock("../components/EditorHeader", () => ({
  EditorHeader: ({
    isEditMode,
    status,
    onStatusChange,
    onCancel,
    onSaveExit,
    disableCancel,
  }: any) => (
    <div data-testid="editor-header">
      <span>isEditMode: {String(isEditMode)}</span>
      <span>status: {status}</span>
      <span>disableCancel: {String(disableCancel)}</span>

      <button onClick={() => onStatusChange("PUBLISHED")}>Change Status</button>
      <button onClick={onCancel} disabled={disableCancel}>
        Cancel
      </button>
      <button onClick={onSaveExit}>Save Exit</button>
    </div>
  ),
}));

vi.mock("../components/QuestionTypePane", () => ({
  QuestionTypePane: ({ questionTypes, onQuestionTypesChange }: any) => (
    <div data-testid="question-type-pane">
      <span>Question Types: {questionTypes.join(", ")}</span>

      <button onClick={() => onQuestionTypesChange(["TASK_1", "TASK_2"])}>
        Change Question Types
      </button>
    </div>
  ),
}));

vi.mock("../components/TopicTagPanel", () => ({
  TopicTagPanel: ({ topicTags, onTopicTagsChange }: any) => (
    <div data-testid="topic-tag-panel">
      <span>Topic Tags: {topicTags.join(", ")}</span>

      <button onClick={() => onTopicTagsChange(["Education", "Technology"])}>
        Change Topic Tags
      </button>
    </div>
  ),
}));

vi.mock("../components/SupportingImagesBlock", () => ({
  SupportingImagesBlock: ({
    uploadedImages,
    handleMultiImageChange,
    handleSaveImage,
    handleRemoveImage,
    handleCopyUrl,
  }: any) => (
    <div data-testid="supporting-images-block">
      <span>Images Count: {uploadedImages.length}</span>

      <button onClick={handleMultiImageChange}>Change Images</button>
      <button onClick={handleSaveImage}>Save Image</button>
      <button onClick={() => handleRemoveImage("image-1")}>Remove Image</button>
      <button onClick={() => handleCopyUrl("image-url")}>Copy Url</button>
    </div>
  ),
}));

vi.mock("../components/UploadThumbnailCard", () => ({
  UploadThumbnailCard: ({
    thumbnailPreview,
    thumbnailSaved,
    onBrowseClick,
    onFileChange,
    onDrop,
    onDragOver,
    onSave,
    onRemove,
  }: any) => (
    <div data-testid="upload-thumbnail-card">
      <span>Thumbnail: {thumbnailPreview || "none"}</span>
      <span>Thumbnail Saved: {String(thumbnailSaved)}</span>

      <button onClick={onBrowseClick}>Browse Thumbnail</button>
      <button onClick={onFileChange}>Change Thumbnail</button>
      <button onClick={onDrop}>Drop Thumbnail</button>
      <button onClick={onDragOver}>Drag Thumbnail</button>
      <button onClick={onSave}>Save Thumbnail</button>
      <button onClick={onRemove}>Remove Thumbnail</button>
    </div>
  ),
}));

vi.mock("../components/ExerciseInfoCard", () => ({
  ExerciseInfoCard: ({
    title,
    onTitleChange,
    task,
    onTaskChange,
    questionTypes,
    onQuestionTypesChange,
    topicTags,
    onTopicTagsChange,
    updatedOn,
    durationMinutes,
    onDurationChange,
  }: any) => (
    <div data-testid="exercise-info-card">
      <span>Title: {title}</span>
      <span>Task: {task}</span>
      <span>Question Types: {questionTypes.join(", ")}</span>
      <span>Topic Tags: {topicTags.join(", ")}</span>
      <span>Updated On: {updatedOn}</span>
      <span>Duration: {durationMinutes}</span>

      <button onClick={() => onTitleChange("Updated Writing Title")}>
        Change Title
      </button>
      <button onClick={() => onTaskChange("TASK_2")}>Change Task</button>
      <button onClick={() => onQuestionTypesChange(["TASK_2"])}>
        Change Info Question Types
      </button>
      <button onClick={() => onTopicTagsChange(["Environment"])}>
        Change Info Topic Tags
      </button>
      <button onClick={() => onDurationChange(60)}>Change Duration</button>
    </div>
  ),
}));

const renderPage = () => render(<WritingContentEditorPage />);

const makeEditorState = (overrides: Record<string, any> = {}) => ({
  title: "Writing Practice 1",
  setTitle: mockSetTitle,

  instructions: "Initial writing instructions",
  setInstructions: mockSetInstructions,

  task: "TASK_1",
  setTask: mockSetTask,

  durationMinutes: 40,
  setDurationMinutes: mockSetDurationMinutes,

  status: "DRAFT",
  setStatus: mockSetStatus,

  questionTypes: ["TASK_1"],
  setQuestionTypes: mockSetQuestionTypes,

  topicTags: ["Education"],
  setTopicTags: mockSetTopicTags,

  thumbnailFile: null,
  setThumbnailFile: vi.fn(),

  thumbnailPreview: "thumbnail-url",
  setThumbnailPreview: vi.fn(),

  thumbnailInputRef: {
    current: {
      click: mockThumbnailInputClick,
    },
  },

  handleThumbnailChange: mockHandleThumbnailChange,
  handleThumbnailDrop: mockHandleThumbnailDrop,
  handleDragOver: mockHandleDragOver,

  displayUpdatedOn: "2026-01-01",

  updatedOn: "2026-01-01",
  setUpdatedOn: vi.fn(),

  safeRevokeObjectUrl: vi.fn(),

  handleSaveThumbnail: mockHandleSaveThumbnail,
  thumbnailSaved: true,
  handleRemoveThumbnail: mockHandleRemoveThumbnail,

  multiImageInputRef: {
    current: null,
  },

  uploadedImages: [
    {
      id: "image-1",
      url: "image-url",
    },
  ],

  handleMultiImageChange: mockHandleMultiImageChange,
  handleSaveImage: mockHandleSaveImage,
  handleRemoveImage: mockHandleRemoveImage,
  handleCopyUrl: mockHandleCopyUrl,

  hasImageChanges: false,
  setHasImageChanges: mockSetHasImageChanges,

  handleSaveExit: mockHandleSaveExit,

  ...overrides,
});

describe("WritingContentEditorPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseParams.mockReturnValue({
      exerciseId: "writing-123",
    });

    vi.mocked(useWritingEditorState).mockReturnValue(makeEditorState() as any);
  });

  describe("rendering", () => {
    test("renders editor page in edit mode with all main sections", () => {
      renderPage();

      expect(useWritingEditorState).toHaveBeenCalledWith(true, "writing-123");

      expect(screen.getByTestId("navbar")).toBeInTheDocument();
      expect(screen.getByTestId("footer")).toBeInTheDocument();

      expect(screen.getByTestId("editor-header")).toHaveTextContent(
        "isEditMode: true",
      );
      expect(screen.getByTestId("editor-header")).toHaveTextContent(
        "status: DRAFT",
      );
      expect(screen.getByTestId("editor-header")).toHaveTextContent(
        "disableCancel: false",
      );

      expect(
        screen.getByDisplayValue("Initial writing instructions"),
      ).toBeInTheDocument();

      expect(screen.getByTestId("question-type-pane")).toHaveTextContent(
        "Question Types: TASK_1",
      );

      expect(screen.getByTestId("topic-tag-panel")).toHaveTextContent(
        "Topic Tags: Education",
      );

      expect(screen.getByTestId("supporting-images-block")).toHaveTextContent(
        "Images Count: 1",
      );

      expect(screen.getByTestId("upload-thumbnail-card")).toHaveTextContent(
        "Thumbnail: thumbnail-url",
      );
      expect(screen.getByTestId("upload-thumbnail-card")).toHaveTextContent(
        "Thumbnail Saved: true",
      );

      expect(screen.getByTestId("exercise-info-card")).toHaveTextContent(
        "Title: Writing Practice 1",
      );
      expect(screen.getByTestId("exercise-info-card")).toHaveTextContent(
        "Task: TASK_1",
      );
      expect(screen.getByTestId("exercise-info-card")).toHaveTextContent(
        "Question Types: TASK_1",
      );
      expect(screen.getByTestId("exercise-info-card")).toHaveTextContent(
        "Topic Tags: Education",
      );
      expect(screen.getByTestId("exercise-info-card")).toHaveTextContent(
        "Duration: 40",
      );
    });

    test("renders editor page in create mode when exerciseId is missing", () => {
      mockUseParams.mockReturnValue({
        exerciseId: undefined,
      });

      renderPage();

      expect(screen.getByTestId("editor-header")).toHaveTextContent(
        "isEditMode: false",
      );

      expect(useWritingEditorState).toHaveBeenCalledWith(false, undefined);
    });

    test("renders empty editor state when there is no media, tags, or images", () => {
      vi.mocked(useWritingEditorState).mockReturnValue(
        makeEditorState({
          questionTypes: [],
          topicTags: [],
          thumbnailPreview: "",
          thumbnailSaved: false,
          uploadedImages: [],
          hasImageChanges: true,
        }) as any,
      );

      renderPage();

      expect(screen.getByTestId("editor-header")).toHaveTextContent(
        "disableCancel: true",
      );

      expect(screen.getByRole("button", { name: /^cancel$/i })).toBeDisabled();

      expect(screen.getByTestId("question-type-pane")).toHaveTextContent(
        "Question Types:",
      );
      expect(screen.getByTestId("topic-tag-panel")).toHaveTextContent(
        "Topic Tags:",
      );
      expect(screen.getByTestId("supporting-images-block")).toHaveTextContent(
        "Images Count: 0",
      );
      expect(screen.getByTestId("upload-thumbnail-card")).toHaveTextContent(
        "Thumbnail: none",
      );
      expect(screen.getByTestId("upload-thumbnail-card")).toHaveTextContent(
        "Thumbnail Saved: false",
      );
    });
  });

  describe("text editing", () => {
    test("updates instructions textarea", async () => {
      const user = userEvent.setup();

      renderPage();

      await user.clear(
        screen.getByDisplayValue("Initial writing instructions"),
      );

      await user.type(
        screen.getByPlaceholderText(
          "Type the shared instructions and notes layout here...",
        ),
        "Updated writing instructions",
      );

      expect(mockSetInstructions).toHaveBeenCalled();
    });
  });

  describe("header actions", () => {
    test("calls status, save exit, and cancel handlers", async () => {
      const user = userEvent.setup();

      renderPage();

      await user.click(screen.getByRole("button", { name: /change status/i }));
      expect(mockSetStatus).toHaveBeenCalledWith("PUBLISHED");

      await user.click(screen.getByRole("button", { name: /save exit/i }));
      expect(mockHandleSaveExit).toHaveBeenCalled();

      await user.click(screen.getByRole("button", { name: /^cancel$/i }));
      expect(mockNavigate).toHaveBeenCalledWith("/content-management");
    });
  });

  describe("question type and topic tag actions", () => {
    test("updates question types and topic tags from left-side panels", async () => {
      const user = userEvent.setup();

      renderPage();

      const questionTypePane = within(screen.getByTestId("question-type-pane"));
      const topicTagPanel = within(screen.getByTestId("topic-tag-panel"));

      await user.click(
        questionTypePane.getByRole("button", {
          name: /^change question types$/i,
        }),
      );

      expect(mockSetQuestionTypes).toHaveBeenCalledWith(["TASK_1", "TASK_2"]);

      await user.click(
        topicTagPanel.getByRole("button", {
          name: /^change topic tags$/i,
        }),
      );

      expect(mockSetTopicTags).toHaveBeenCalledWith([
        "Education",
        "Technology",
      ]);
    });
  });

  describe("media and image actions", () => {
    test("calls thumbnail handlers", async () => {
      const user = userEvent.setup();

      renderPage();

      await user.click(
        screen.getByRole("button", { name: /browse thumbnail/i }),
      );
      expect(mockThumbnailInputClick).toHaveBeenCalled();

      await user.click(
        screen.getByRole("button", { name: /change thumbnail/i }),
      );
      expect(mockHandleThumbnailChange).toHaveBeenCalled();

      await user.click(screen.getByRole("button", { name: /drop thumbnail/i }));
      expect(mockHandleThumbnailDrop).toHaveBeenCalled();

      await user.click(screen.getByRole("button", { name: /drag thumbnail/i }));
      expect(mockHandleDragOver).toHaveBeenCalled();

      await user.click(screen.getByRole("button", { name: /save thumbnail/i }));
      expect(mockHandleSaveThumbnail).toHaveBeenCalled();

      await user.click(
        screen.getByRole("button", { name: /remove thumbnail/i }),
      );
      expect(mockHandleRemoveThumbnail).toHaveBeenCalled();
    });

    test("calls supporting image handlers", async () => {
      const user = userEvent.setup();

      renderPage();

      await user.click(screen.getByRole("button", { name: /change images/i }));
      expect(mockHandleMultiImageChange).toHaveBeenCalled();

      await user.click(screen.getByRole("button", { name: /save image/i }));
      expect(mockHandleSaveImage).toHaveBeenCalled();

      await user.click(screen.getByRole("button", { name: /remove image/i }));
      expect(mockHandleRemoveImage).toHaveBeenCalledWith("image-1");

      await user.click(screen.getByRole("button", { name: /copy url/i }));
      expect(mockHandleCopyUrl).toHaveBeenCalledWith("image-url");
    });
  });

  describe("exercise info actions", () => {
    test("updates exercise info fields", async () => {
      const user = userEvent.setup();

      renderPage();

      const infoCard = within(screen.getByTestId("exercise-info-card"));

      await user.click(
        infoCard.getByRole("button", { name: /^change title$/i }),
      );
      expect(mockSetTitle).toHaveBeenCalledWith("Updated Writing Title");

      await user.click(
        infoCard.getByRole("button", { name: /^change task$/i }),
      );
      expect(mockSetTask).toHaveBeenCalledWith("TASK_2");

      await user.click(
        infoCard.getByRole("button", {
          name: /^change info question types$/i,
        }),
      );
      expect(mockSetQuestionTypes).toHaveBeenCalledWith(["TASK_2"]);

      await user.click(
        infoCard.getByRole("button", { name: /^change info topic tags$/i }),
      );
      expect(mockSetTopicTags).toHaveBeenCalledWith(["Environment"]);

      await user.click(
        infoCard.getByRole("button", { name: /^change duration$/i }),
      );
      expect(mockSetDurationMinutes).toHaveBeenCalledWith(60);
    });
  });
});
