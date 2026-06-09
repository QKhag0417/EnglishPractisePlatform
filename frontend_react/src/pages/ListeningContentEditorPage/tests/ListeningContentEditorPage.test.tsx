import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { ListeningContentEditorPage } from "../ListeningContentEditorPage";
import { useListeningEditorState } from "../hooks/useListeningEditorState";

const {
  mockNavigate,
  mockUseParams,

  mockSetStatus,
  mockSetInstructions,
  mockSetTranscript,
  mockSetTitle,
  mockSetTask,
  mockSetDurationMinutes,

  mockSetSelectedQuestionTempId,
  mockAddNewQuestion,
  mockDeleteQuestion,
  mockHandleSaveQuestion,
  mockHandleCancelQuestion,

  mockSetQuestionType,
  mockSetTopicTag,
  mockSetCorrectAnswers,
  mockSetNewAnswerInput,
  mockMarkAsUnsaved,

  mockSetQuestionTypeTags,
  mockSetTopicTags,

  mockThumbnailInputClick,
  mockAudioInputClick,
  mockHandleThumbnailChange,
  mockHandleAudioChange,
  mockHandleThumbnailDrop,
  mockHandleAudioDrop,
  mockHandleDragOver,
  mockHandleSaveThumbnail,
  mockHandleSaveAudio,
  mockHandleRemoveThumbnail,
  mockHandleRemoveAudio,

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
  mockSetTranscript: vi.fn(),
  mockSetTitle: vi.fn(),
  mockSetTask: vi.fn(),
  mockSetDurationMinutes: vi.fn(),

  mockSetSelectedQuestionTempId: vi.fn(),
  mockAddNewQuestion: vi.fn(),
  mockDeleteQuestion: vi.fn(),
  mockHandleSaveQuestion: vi.fn(),
  mockHandleCancelQuestion: vi.fn(),

  mockSetQuestionType: vi.fn(),
  mockSetTopicTag: vi.fn(),
  mockSetCorrectAnswers: vi.fn(),
  mockSetNewAnswerInput: vi.fn(),
  mockMarkAsUnsaved: vi.fn(),

  mockSetQuestionTypeTags: vi.fn(),
  mockSetTopicTags: vi.fn(),

  mockThumbnailInputClick: vi.fn(),
  mockAudioInputClick: vi.fn(),
  mockHandleThumbnailChange: vi.fn(),
  mockHandleAudioChange: vi.fn(),
  mockHandleThumbnailDrop: vi.fn(),
  mockHandleAudioDrop: vi.fn(),
  mockHandleDragOver: vi.fn(),
  mockHandleSaveThumbnail: vi.fn(),
  mockHandleSaveAudio: vi.fn(),
  mockHandleRemoveThumbnail: vi.fn(),
  mockHandleRemoveAudio: vi.fn(),

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

vi.mock("../hooks/useListeningEditorState", () => ({
  useListeningEditorState: vi.fn(),
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

vi.mock("../components/QuestionsTable", () => ({
  QuestionsTable: ({
    questions,
    selectedQuestionTempId,
    onAdd,
    onSelect,
    onDelete,
  }: any) => (
    <div data-testid="questions-table">
      <span>Questions Count: {questions.length}</span>
      <span>Selected Question Id: {selectedQuestionTempId || "none"}</span>

      <button onClick={onAdd}>Add Question</button>
      <button onClick={() => onSelect("q-1")}>Select Question</button>
      <button onClick={() => onDelete("q-1")}>Delete Question</button>
    </div>
  ),
}));

vi.mock("../components/AnswerScoringPanel", () => ({
  AnswerScoringPanel: ({
    selectedQuestionNumber,
    questionType,
    setQuestionType,
    topicTag,
    setTopicTag,
    correctAnswers,
    setCorrectAnswers,
    newAnswerInput,
    setNewAnswerInput,
    saveState,
    markAsUnsaved,
    handleSaveQuestion,
    handleCancelQuestion,
  }: any) => (
    <div data-testid="answer-scoring-panel">
      <span>Selected Question: {selectedQuestionNumber ?? "none"}</span>
      <span>Question Type: {questionType}</span>
      <span>Topic Tag: {topicTag}</span>
      <span>Answers: {correctAnswers.join(", ")}</span>
      <span>New Answer: {newAnswerInput || "empty"}</span>
      <span>Save State: {saveState}</span>

      <button onClick={() => setQuestionType("MATCHING")}>
        Change Question Type
      </button>
      <button onClick={() => setTopicTag("Science")}>Change Topic</button>
      <button onClick={() => setCorrectAnswers(["B"])}>Change Answers</button>
      <button onClick={() => setNewAnswerInput("B")}>
        Change Answer Input
      </button>
      <button onClick={markAsUnsaved}>Mark Unsaved</button>
      <button onClick={handleSaveQuestion}>Save Question</button>
      <button onClick={handleCancelQuestion}>Cancel Question</button>
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

vi.mock("../components/UploadAudioCard", () => ({
  UploadAudioCard: ({
    audioPreview,
    audioSaved,
    onFileChange,
    onDrop,
    onDragOver,
    onSave,
    onRemove,
  }: any) => (
    <div data-testid="upload-audio-card">
      <span>Audio: {audioPreview || "none"}</span>
      <span>Audio Saved: {String(audioSaved)}</span>

      <button onClick={onFileChange}>Change Audio</button>
      <button onClick={onDrop}>Drop Audio</button>
      <button onClick={onDragOver}>Drag Audio</button>
      <button onClick={onSave}>Save Audio</button>
      <button onClick={onRemove}>Remove Audio</button>
    </div>
  ),
}));

vi.mock("../components/ExerciseInfoCard", () => ({
  ExerciseInfoCard: ({
    title,
    onTitleChange,
    task,
    onTaskChange,
    questionTypeTags,
    onQuestionTypeTagsChange,
    topicTags,
    onTopicTagsChange,
    updatedOn,
    questionsCount,
    durationMinutes,
    onDurationChange,
  }: any) => (
    <div data-testid="exercise-info-card">
      <span>Title: {title}</span>
      <span>Task: {task}</span>
      <span>Question Type Tags: {questionTypeTags.join(", ")}</span>
      <span>Topic Tags: {topicTags.join(", ")}</span>
      <span>Updated On: {updatedOn}</span>
      <span>Questions Count: {questionsCount}</span>
      <span>Duration: {durationMinutes}</span>

      <button onClick={() => onTitleChange("Updated Listening Title")}>
        Change Title
      </button>
      <button onClick={() => onTaskChange("PART_2")}>Change Task</button>
      <button onClick={() => onQuestionTypeTagsChange(["Matching"])}>
        Change Question Type Tags
      </button>
      <button onClick={() => onTopicTagsChange(["Science"])}>
        Change Topic Tags
      </button>
      <button onClick={() => onDurationChange(45)}>Change Duration</button>
    </div>
  ),
}));

const renderPage = () => render(<ListeningContentEditorPage />);

const makeEditorState = (overrides: Record<string, any> = {}) => ({
  title: "Listening Practice 1",
  setTitle: mockSetTitle,

  instructions: "Initial instructions",
  setInstructions: mockSetInstructions,

  transcript: "Initial transcript",
  setTranscript: mockSetTranscript,

  task: "PART_1",
  setTask: mockSetTask,

  durationMinutes: 30,
  setDurationMinutes: mockSetDurationMinutes,

  status: "DRAFT",
  setStatus: mockSetStatus,

  questions: [
    {
      tempId: "q-1",
      number: 1,
    },
  ],
  setQuestions: vi.fn(),

  selectedQuestionTempId: "q-1",
  setSelectedQuestionTempId: mockSetSelectedQuestionTempId,

  selectedQuestion: {
    tempId: "q-1",
    number: 1,
  },

  addNewQuestion: mockAddNewQuestion,
  deleteQuestion: mockDeleteQuestion,
  handleSaveQuestion: mockHandleSaveQuestion,
  handleCancelQuestion: mockHandleCancelQuestion,

  questionTypeTags: ["Multiple Choice"],
  setQuestionTypeTags: mockSetQuestionTypeTags,

  topicTags: ["Education"],
  setTopicTags: mockSetTopicTags,

  questionType: "MULTIPLE_CHOICE",
  setQuestionType: mockSetQuestionType,

  topicTag: "Education",
  setTopicTag: mockSetTopicTag,

  correctAnswers: ["A"],
  setCorrectAnswers: mockSetCorrectAnswers,

  newAnswerInput: "",
  setNewAnswerInput: mockSetNewAnswerInput,

  saveState: "saved",
  setSaveState: vi.fn(),
  markAsUnsaved: mockMarkAsUnsaved,

  thumbnailFile: null,
  setThumbnailFile: vi.fn(),

  thumbnailPreview: "thumbnail-url",
  setThumbnailPreview: vi.fn(),

  thumbnailInputRef: {
    current: {
      click: mockThumbnailInputClick,
    },
  },

  audioInputRef: {
    current: {
      click: mockAudioInputClick,
    },
  },

  handleThumbnailChange: mockHandleThumbnailChange,
  handleAudioChange: mockHandleAudioChange,
  handleThumbnailDrop: mockHandleThumbnailDrop,
  handleAudioDrop: mockHandleAudioDrop,
  handleDragOver: mockHandleDragOver,

  displayUpdatedOn: "2026-01-01",

  audioPreview: "audio-url",
  setAudioPreview: vi.fn(),

  updatedOn: "2026-01-01",
  setUpdatedOn: vi.fn(),

  audioFile: null,
  setAudioFile: vi.fn(),

  safeRevokeObjectUrl: vi.fn(),

  handleSaveThumbnail: mockHandleSaveThumbnail,
  handleSaveAudio: mockHandleSaveAudio,

  thumbnailSaved: true,
  audioSaved: true,

  handleRemoveThumbnail: mockHandleRemoveThumbnail,
  handleRemoveAudio: mockHandleRemoveAudio,

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

describe("ListeningContentEditorPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseParams.mockReturnValue({
      exerciseId: "listening-123",
    });

    vi.mocked(useListeningEditorState).mockReturnValue(
      makeEditorState() as any,
    );
  });

  describe("rendering", () => {
    test("renders editor page in edit mode with all main sections", () => {
      renderPage();

      expect(useListeningEditorState).toHaveBeenCalledWith(
        true,
        "listening-123",
      );

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
        screen.getByDisplayValue("Initial instructions"),
      ).toBeInTheDocument();

      expect(
        screen.getByDisplayValue("Initial transcript"),
      ).toBeInTheDocument();

      expect(screen.getByTestId("questions-table")).toHaveTextContent(
        "Questions Count: 1",
      );
      expect(screen.getByTestId("questions-table")).toHaveTextContent(
        "Selected Question Id: q-1",
      );

      expect(screen.getByTestId("answer-scoring-panel")).toHaveTextContent(
        "Selected Question: 1",
      );
      expect(screen.getByTestId("answer-scoring-panel")).toHaveTextContent(
        "Question Type: MULTIPLE_CHOICE",
      );
      expect(screen.getByTestId("answer-scoring-panel")).toHaveTextContent(
        "Topic Tag: Education",
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

      expect(screen.getByTestId("upload-audio-card")).toHaveTextContent(
        "Audio: audio-url",
      );
      expect(screen.getByTestId("upload-audio-card")).toHaveTextContent(
        "Audio Saved: true",
      );

      expect(screen.getByTestId("exercise-info-card")).toHaveTextContent(
        "Title: Listening Practice 1",
      );
      expect(screen.getByTestId("exercise-info-card")).toHaveTextContent(
        "Task: PART_1",
      );
      expect(screen.getByTestId("exercise-info-card")).toHaveTextContent(
        "Duration: 30",
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

      expect(useListeningEditorState).toHaveBeenCalledWith(false, undefined);
    });

    test("renders empty editor state when there is no selected question, no media, and no images", () => {
      vi.mocked(useListeningEditorState).mockReturnValue(
        makeEditorState({
          questions: [],
          selectedQuestionTempId: undefined,
          selectedQuestion: undefined,
          questionTypeTags: [],
          topicTags: [],
          correctAnswers: [],
          thumbnailPreview: "",
          audioPreview: "",
          thumbnailSaved: false,
          audioSaved: false,
          uploadedImages: [],
          hasImageChanges: true,
        }) as any,
      );

      renderPage();

      expect(screen.getByTestId("editor-header")).toHaveTextContent(
        "disableCancel: true",
      );

      expect(screen.getByRole("button", { name: /^cancel$/i })).toBeDisabled();

      expect(screen.getByTestId("questions-table")).toHaveTextContent(
        "Questions Count: 0",
      );
      expect(screen.getByTestId("questions-table")).toHaveTextContent(
        "Selected Question Id: none",
      );

      expect(screen.getByTestId("answer-scoring-panel")).toHaveTextContent(
        "Selected Question: none",
      );
      expect(screen.getByTestId("supporting-images-block")).toHaveTextContent(
        "Images Count: 0",
      );
      expect(screen.getByTestId("upload-thumbnail-card")).toHaveTextContent(
        "Thumbnail: none",
      );
      expect(screen.getByTestId("upload-audio-card")).toHaveTextContent(
        "Audio: none",
      );
    });
  });

  describe("text editing", () => {
    test("updates instructions and transcript textareas", async () => {
      const user = userEvent.setup();

      renderPage();

      await user.clear(screen.getByDisplayValue("Initial instructions"));

      await user.type(
        screen.getByPlaceholderText(
          "Type the shared instructions and notes layout here...",
        ),
        "Updated instructions",
      );

      expect(mockSetInstructions).toHaveBeenCalled();

      await user.clear(screen.getByDisplayValue("Initial transcript"));

      await user.type(
        screen.getByPlaceholderText(
          "Type the audio script/transcript for this listening exercise here...",
        ),
        "Updated transcript",
      );

      expect(mockSetTranscript).toHaveBeenCalled();
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

  describe("question table actions", () => {
    test("adds, selects, and deletes questions", async () => {
      const user = userEvent.setup();

      renderPage();

      await user.click(screen.getByRole("button", { name: /add question/i }));
      expect(mockAddNewQuestion).toHaveBeenCalled();

      await user.click(
        screen.getByRole("button", { name: /select question/i }),
      );
      expect(mockSetSelectedQuestionTempId).toHaveBeenCalledWith("q-1");

      await user.click(
        screen.getByRole("button", { name: /delete question/i }),
      );
      expect(mockDeleteQuestion).toHaveBeenCalledWith("q-1");
    });
  });

  describe("answer scoring actions", () => {
    test("updates answer scoring fields and calls save/cancel handlers", async () => {
      const user = userEvent.setup();

      renderPage();

      const panel = within(screen.getByTestId("answer-scoring-panel"));

      await user.click(
        panel.getByRole("button", { name: /^change question type$/i }),
      );
      expect(mockSetQuestionType).toHaveBeenCalledWith("MATCHING");

      await user.click(panel.getByRole("button", { name: /^change topic$/i }));
      expect(mockSetTopicTag).toHaveBeenCalledWith("Science");

      await user.click(
        panel.getByRole("button", { name: /^change answers$/i }),
      );
      expect(mockSetCorrectAnswers).toHaveBeenCalledWith(["B"]);

      await user.click(
        panel.getByRole("button", { name: /^change answer input$/i }),
      );
      expect(mockSetNewAnswerInput).toHaveBeenCalledWith("B");

      await user.click(panel.getByRole("button", { name: /^mark unsaved$/i }));
      expect(mockMarkAsUnsaved).toHaveBeenCalled();

      await user.click(panel.getByRole("button", { name: /^save question$/i }));
      expect(mockHandleSaveQuestion).toHaveBeenCalled();

      await user.click(
        panel.getByRole("button", { name: /^cancel question$/i }),
      );
      expect(mockHandleCancelQuestion).toHaveBeenCalled();
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

    test("calls audio handlers", async () => {
      const user = userEvent.setup();

      renderPage();

      await user.click(screen.getByRole("button", { name: /change audio/i }));
      expect(mockHandleAudioChange).toHaveBeenCalled();

      await user.click(screen.getByRole("button", { name: /drop audio/i }));
      expect(mockHandleAudioDrop).toHaveBeenCalled();

      await user.click(screen.getByRole("button", { name: /drag audio/i }));
      expect(mockHandleDragOver).toHaveBeenCalled();

      await user.click(screen.getByRole("button", { name: /save audio/i }));
      expect(mockHandleSaveAudio).toHaveBeenCalled();

      await user.click(screen.getByRole("button", { name: /remove audio/i }));
      expect(mockHandleRemoveAudio).toHaveBeenCalled();
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
      expect(mockSetTitle).toHaveBeenCalledWith("Updated Listening Title");

      await user.click(
        infoCard.getByRole("button", { name: /^change task$/i }),
      );
      expect(mockSetTask).toHaveBeenCalledWith("PART_2");

      await user.click(
        infoCard.getByRole("button", { name: /^change question type tags$/i }),
      );
      expect(mockSetQuestionTypeTags).toHaveBeenCalledWith(["Matching"]);

      await user.click(
        infoCard.getByRole("button", { name: /^change topic tags$/i }),
      );
      expect(mockSetTopicTags).toHaveBeenCalledWith(["Science"]);

      await user.click(
        infoCard.getByRole("button", { name: /^change duration$/i }),
      );
      expect(mockSetDurationMinutes).toHaveBeenCalledWith(45);
    });
  });
});
