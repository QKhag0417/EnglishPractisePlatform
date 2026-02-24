import { useState, useRef, useEffect } from "react";
import { Question, QuestionType, Option } from "../types";
import { DEFAULT_OPTIONS } from "../types";
import { useListeningEditorApi } from "./useListeningEditorApi";
import { useNavigate, useParams } from "react-router";

export function useListeningEditorState(isEditMode: boolean) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { saveContent } = useListeningEditorApi();
  // ================= META =================
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [task, setTask] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [status, setStatus] = useState<"Draft" | "Published">("Draft");
  const [newAnswerInput, setNewAnswerInput] = useState("");
  // ================= QUESTIONS =================
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [questionTypeTags, setQuestionTypeTags] = useState<string[]>([]);
  const selectedQuestion = questions.find(
    (q) => q.id === selectedQuestionId
  );
  const [topicTags, setTopicTags] = useState<string[]>([]);

  // ================= EDITOR PANEL =================
  const [questionType, setQuestionType] =
    useState<QuestionType>("short-text");
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [options, setOptions] = useState<Option[]>(DEFAULT_OPTIONS);
  const [currentQuestionText, setCurrentQuestionText] = useState("");
  const [currentExplanation, setCurrentExplanation] = useState("");
  const [currentScore, setCurrentScore] = useState("1");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveState, setSaveState] = useState<"saved" | "unsaved" | "editing">("saved");
  const [shuffleOptions, setShuffleOptions] = useState(false);
  // ================= THUMBNAIL&AUDIO =================
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [updatedOn, setUpdatedOn] = useState<string>("");
  const markAsUnsaved = () => {
      if (saveState === "saved") {
        setSaveState("unsaved");
        setHasUnsavedChanges(true);
      }
  };
  // ================= INITIAL CREATE MODE =================
  useEffect(() => {
    if (isEditMode) return;

    const initialQuestion: Question = {
      id: Date.now().toString(),
      number: 1,
      type: "Short Text",
      points: 1,
      correctAnswer: "",
      questionType: "short-text",
      questionText: "",
      correctAnswers: [],
      options: [],
      shuffleOptions: false,
      explanation: "",
    };

    setQuestions([initialQuestion]);
    setSelectedQuestionId(initialQuestion.id);
  }, [isEditMode]);

  // ================= QUESTION CRUD =================
  const addNewQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      number: questions.length + 1,
      type: "Short Text",
      points: 1,
      correctAnswer: "",
      questionType: "short-text",
      questionText: "",
      correctAnswers: [],
      options: [],
      shuffleOptions: false,
      explanation: "",
    };

    setQuestions((prev) => [...prev, newQuestion]);
  };

  const deleteQuestion = (id: string) => {
    const filtered = questions.filter((q) => q.id !== id);
    const renumbered = filtered.map((q, index) => ({
      ...q,
      number: index + 1,
    }));
    setQuestions(renumbered);
  };
  const ensureCurrentQuestionIsPersisted = () => {
    if (!selectedQuestionId) return;

    setQuestions((prev) =>
      prev.map((q) =>
        q.id === selectedQuestionId
          ? {
              ...q,
              type:
                questionType === "short-text"
                  ? "Short Text"
                  : questionType === "mcq-single"
                    ? "MCQ - Single"
                    : questionType === "mcq-multiple"
                      ? "MCQ - Multiple"
                      : "Written Response",
              points: parseInt(currentScore) || 1,
              correctAnswer:
                questionType === "short-text"
                  ? correctAnswers.join(", ")
                  : questionType === "mcq-single"
                    ? options.find((o) => o.isCorrect)?.text || ""
                    : questionType === "mcq-multiple"
                      ? options
                          .filter((o) => o.isCorrect)
                          .map((o) => o.text)
                          .join(", ")
                      : "Manual marking required",
              questionType,
              questionText: currentQuestionText,
              correctAnswers,
              options,
              shuffleOptions,
              explanation: currentExplanation,
            }
          : q,
      ),
    );
  };

  useEffect(() => {
      if (!selectedQuestion) return;

      setQuestionType(selectedQuestion.questionType);
      setCorrectAnswers(selectedQuestion.correctAnswers || []);
      setShuffleOptions(selectedQuestion.shuffleOptions);

      setOptions(
        selectedQuestion.options && selectedQuestion.options.length > 0
          ? selectedQuestion.options
          : DEFAULT_OPTIONS,
      );

      setCurrentExplanation(selectedQuestion.explanation || "");
      setCurrentScore(String(selectedQuestion.points || 1));
      setCurrentQuestionText(selectedQuestion.questionText || "");

      setSaveState("saved");
      setHasUnsavedChanges(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQuestionId]);

  const handleSaveQuestion = () => {
      ensureCurrentQuestionIsPersisted();
      setSaveState("saved");
      setHasUnsavedChanges(false);
    };

  const handleCancelQuestion = () => {
      if (!selectedQuestion) return;

      setQuestionType(selectedQuestion.questionType);
      setCorrectAnswers(selectedQuestion.correctAnswers || []);
      setOptions(
        selectedQuestion.options && selectedQuestion.options.length > 0
          ? selectedQuestion.options
          : DEFAULT_OPTIONS,
      );
      setShuffleOptions(selectedQuestion.shuffleOptions);
      setCurrentExplanation(selectedQuestion.explanation || "");
      setCurrentScore(String(selectedQuestion.points || 1));
      setCurrentQuestionText(selectedQuestion.questionText || "");

      setSaveState("saved");
      setHasUnsavedChanges(false);
  };
  const mapQuestionsToApi = () => {
    return questions.map((q, index) => {
      const apiType =
        q.questionType === "mcq-single"
          ? "MCQ_SINGLE"
          : q.questionType === "mcq-multiple"
            ? "MCQ_MULTIPLE"
            : q.questionType === "short-text"
              ? "SHORT_TEXT"
              : "WRITTEN_RESPONSE";

      const correctAnswers: string[] =
        q.questionType === "short-text"
          ? (q.correctAnswers ?? [])
              .map((a) => (a ?? "").trim())
              .filter((a) => a.length > 0)
          : (q.options ?? [])
              .filter((opt) => Boolean(opt?.isCorrect))
              .map((opt) => (opt?.text ?? "").trim())
              .filter((t) => t.length > 0);

      return {
        orderIndex: index + 1,
        type: apiType,
        correctAnswers,
      };
    });
  };

  const handleSaveExit = async () => {
    const payload = {
        skill: "LISTENING",
        title,
        instructions,
        task,
        questionTypeTags,
        topicTags,
        durationMinutes,
        questionCount: questions.length,
        status: status === "Draft" ? "DRAFT" : "PUBLISHED",
        questions: mapQuestionsToApi(),
    };

    await saveContent(payload, isEditMode, id);
    navigate("/admin/content-management");
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a .jpg or .png file");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      alert("File size must be less than 25 MB");
      return;
    }

    safeRevokeObjectUrl(thumbnailPreview);
    const url = URL.createObjectURL(file);

    setThumbnailFile(file);
    setThumbnailPreview(url);
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/wave"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a .mp3 or .wav file");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      alert("File size must be less than 25 MB");
      return;
    }

    safeRevokeObjectUrl(audioPreview);
    const url = URL.createObjectURL(file);

    setAudioFile(file);
    setAudioPreview(url);
  };

  const handleThumbnailDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a .jpg or .png file");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      alert("File size must be less than 25 MB");
      return;
    }

    safeRevokeObjectUrl(thumbnailPreview);
    const url = URL.createObjectURL(file);

    setThumbnailFile(file);
    setThumbnailPreview(url);
  };

  const handleAudioDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const validTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/wave"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a .mp3 or .wav file");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      alert("File size must be less than 25 MB");
      return;
    }

    safeRevokeObjectUrl(audioPreview);
    const url = URL.createObjectURL(file);

    setAudioFile(file);
    setAudioPreview(url);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const displayUpdatedOn = updatedOn || new Date().toISOString().split("T")[0];

  return {
    // meta
    title,
    setTitle,
    instructions,
    setInstructions,
    task,
    setTask,
    durationMinutes,
    setDurationMinutes,
    status,
    setStatus,

    // questions
    questions,
    setQuestions,
    selectedQuestionId,
    setSelectedQuestionId,
    selectedQuestion,
    addNewQuestion,
    deleteQuestion,
    handleSaveQuestion,
    handleCancelQuestion,
    questionTypeTags,
    setQuestionTypeTags,
    topicTags,
    setTopicTags,

    // editor
    questionType,
    setQuestionType,
    correctAnswers,
    setCorrectAnswers,
    options,
    setOptions,
    currentQuestionText,
    setCurrentQuestionText,
    currentExplanation,
    setCurrentExplanation,
    currentScore,
    setCurrentScore,

    // answer
    newAnswerInput,
    setNewAnswerInput,
    saveState,
    setSaveState,
    markAsUnsaved,

    //thumbnail && audio
    thumbnailPreview,
    setThumbnailPreview,
    thumbnailInputRef,
    audioInputRef,
    handleThumbnailChange,
    handleAudioChange,
    handleThumbnailDrop,
    handleAudioDrop,
    handleDragOver,
    displayUpdatedOn,
    audioPreview,
    setAudioPreview,
    updatedOn,
    setUpdatedOn,


    handleSaveExit,
  };
}