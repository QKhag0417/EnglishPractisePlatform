import { useState, useRef, useEffect } from "react";
import { Question, QuestionType, Option } from "../types";
import { DEFAULT_OPTIONS } from "../types";
import { useListeningEditorApi } from "./useListeningEditorApi";
import { useNavigate, useParams } from "react-router";
import { API_BASE } from "../../../env";
export function useListeningEditorState(
  isEditMode: boolean,
  id?: string
) {
  const navigate = useNavigate();

  const {
    fetchDetail,
    uploadThumbnail,
    uploadAudio,
    createContent,
    updateContent,
    saveContent,
    createContentQuestion,
    deleteContentQuestion,
    updateContentQuestion,
    fetchContentQuestions,
  } = useListeningEditorApi();

  // ================= META =================
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [task, setTask] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [status, setStatus] = useState<"Draft" | "Published">("Draft");
  const [newAnswerInput, setNewAnswerInput] = useState("");
  // ================= QUESTIONS =================
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestionTempId, setSelectedQuestionTempId] = useState("");
  const [questionTypeTags, setQuestionTypeTags] = useState<string[]>([]);
  const selectedQuestion = questions.find(
    (q) => q.tempId === selectedQuestionTempId
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
  const [thumbnailFile, setThumbnailFile] = useState<File | string | null>(null);
  const [audioFile, setAudioFile] = useState<File | string | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);

  const safeRevokeObjectUrl = (url: string | null) => {
      if (!url) return;
      if (url.startsWith("blob:")) URL.revokeObjectURL(url);
  };

  useEffect(() => {
    return () => {
      safeRevokeObjectUrl(thumbnailPreview);
      safeRevokeObjectUrl(audioPreview);
    };
  }, []);

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
      id: undefined,
      tempId: Date.now().toString(),
      number: 1,
      type: "Short Text",
      points: 1,
      correctAnswer: "",
      questionType: "short-text",
      questionText: "",
      correctAnswers: [],
      explanation: "",
    };

    setQuestions([initialQuestion]);
    setSelectedQuestionTempId(initialQuestion.tempId);;
  }, [isEditMode]);

  // ================= EDIT MODE LOAD =================
  useEffect(() => {
    if (!isEditMode || !id) return;

    const loadData = async () => {
      try {


        // 1️⃣ Fetch content
        const content = await fetchDetail(id);



        // ===== SET META =====
        setTitle(content.title || "");
        setInstructions(content.instructions || "");
        setTask(content.task || "");
        setDurationMinutes(content.durationMinutes || 15);
        setStatus(content.status === "PUBLISHED" ? "Published" : "Draft");
        setQuestionTypeTags(content.questionTypeTags || []);
        setTopicTags(content.topicTags || []);
        setUpdatedOn(formatDateArrayToInput(content.updatedOn) || "");

        if (content.thumbnailUrl) {
          setThumbnailPreview(`${API_BASE}${content.thumbnailUrl}`);
          setThumbnailFile(content.thumbnailUrl);
        }

        if (content.audioUrl) {
          setAudioPreview(`${API_BASE}${content.audioUrl}`);
          setAudioFile(content.audioUrl);
        }

        // 2️⃣ Fetch questions
        const questionsFromApi = await fetchContentQuestions(id);



        const mappedQuestions: Question[] = (questionsFromApi || []).map(
          (q: any) => ({
            id: q.id,
            tempId: q.id,
            number: q.orderIndex,
            type: q.type,
            points: 1,
            correctAnswer: "",
            questionType:
              q.type === "MCQ_SINGLE"
                ? "mcq-single"
                : q.type === "MCQ_MULTIPLE"
                ? "mcq-multiple"
                : q.type === "SHORT_TEXT"
                ? "short-text"
                : "written-response",
            questionText: "",
            correctAnswers: q.correctAnswers || [],
            options: [],
            shuffleOptions: false,
            explanation: "",
          })
        );



        setQuestions(mappedQuestions);

        if (mappedQuestions.length > 0) {
          setSelectedQuestionTempId(mappedQuestions[0].tempId);
        }



      } catch (err) {
        console.error("❌ Failed to load content", err);
        alert("Cannot load content for editing");
      }
    };

    loadData();
  }, [isEditMode, id]);

  // ================= QUESTION CRUD =================
  const addNewQuestion = () => {
    const newQuestion: Question = {
      id: undefined,
      tempId: Date.now().toString(),
      number: questions.length + 1,
      type: "Short Text",
      points: 1,
      correctAnswer: "",
      questionType: "short-text",
      questionText: "",
      correctAnswers: [],
      explanation: "",
    };

    setQuestions((prev) => [...prev, newQuestion]);
  };


  const deleteQuestion = async (tempId: string) => {
    const questionToDelete = questions.find(q => q.tempId === tempId);

    try {
      if (questionToDelete?.id) {
        await deleteContentQuestion(questionToDelete.id);
      }

      const filtered = questions.filter(q => q.tempId !== tempId);

      const renumbered = filtered.map((q, index) => ({
        ...q,
        number: index + 1,
      }));

      setQuestions(renumbered);

    } catch (err: any) {
      alert(err?.message || "Delete failed");
    }
  };

  const formatDateArrayToInput = (arr: number[]) => {
    if (!arr || arr.length < 3) return "";

    const [year, month, day] = arr;

    const mm = String(month).padStart(2, "0");
    const dd = String(day).padStart(2, "0");

    return `${year}-${mm}-${dd}`;
  };

  const ensureCurrentQuestionIsPersisted = () => {
    if (!selectedQuestionTempId) return;

    setQuestions((prev) =>
      prev.map((q) =>
        q.tempId  === selectedQuestionTempId
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


      setCurrentExplanation(selectedQuestion.explanation || "");
      setCurrentScore(String(selectedQuestion.points || 1));
      setCurrentQuestionText(selectedQuestion.questionText || "");

      setSaveState("saved");
      setHasUnsavedChanges(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQuestionTempId]);

  const handleSaveQuestion = () => {
      ensureCurrentQuestionIsPersisted();
      setSaveState("saved");
      setHasUnsavedChanges(false);
    };

  const handleCancelQuestion = () => {
      if (!selectedQuestion) return;

      setQuestionType(selectedQuestion.questionType);
      setCorrectAnswers(selectedQuestion.correctAnswers || []);


      setCurrentExplanation(selectedQuestion.explanation || "");
      setCurrentScore(String(selectedQuestion.points || 1));
      setCurrentQuestionText(selectedQuestion.questionText || "");

      setSaveState("saved");
      setHasUnsavedChanges(false);
  };

  const mapSingleQuestionToApi = (q: Question, index: number) => {
    const apiType =
      q.questionType === "mcq-single"
        ? "MCQ_SINGLE"
        : q.questionType === "mcq-multiple"
        ? "MCQ_MULTIPLE"
        : q.questionType === "short-text"
        ? "SHORT_TEXT"
        : "WRITTEN_RESPONSE";

    return {
      orderIndex: index + 1,
      type: apiType,
      correctAnswers: (q.correctAnswers ?? [])
        .map(a => a.trim())
        .filter(a => a.length > 0),
    };
  };

  const handleSaveExit = async () => {
    try {
      ensureCurrentQuestionIsPersisted();

      let thumbnailUrl: string | null = null;
      let audioUrl: string | null = null;

      // ================= THUMBNAIL =================
      if (thumbnailFile instanceof File) {
        thumbnailUrl = await uploadThumbnail(thumbnailFile);
      } else if (typeof thumbnailFile === "string") {
        thumbnailUrl = thumbnailFile; // giữ file cũ
      }

      // ================= AUDIO =================
      if (audioFile instanceof File) {
        audioUrl = await uploadAudio(audioFile);
      } else if (typeof audioFile === "string") {
        audioUrl = audioFile; // giữ file cũ
      }

      if (!audioUrl || audioUrl.trim() === "") {
        alert("Audio file is required for Listening content");
        return;
      }

      // ========================
      // SAVE CONTENT FIRST
      // ========================
      const contentPayload = {
        skill: "LISTENING",
        title,
        instructions,
        task,
        questionTypeTags,
        topicTags,
        durationMinutes,
        questionCount: questions.length,
        status: status === "Draft" ? "DRAFT" : "PUBLISHED",
        thumbnailUrl,
        audioUrl,
      };

      const contentResponse = await saveContent(
        contentPayload,
        isEditMode,
        id
      );

      if (!contentResponse?.id) {
        throw new Error("Cannot get content ID from response");
      }

      const contentId = contentResponse.id;

      // ========================
      //  SAVE QUESTIONS
      // ========================
      // STEP 1: Move existing questions to temp order
      const normalizedQuestions = [...questions]
        .sort((a, b) => a.number - b.number)
        .map((q, index) => ({
          ...q,
          number: index + 1,
        }));

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];

        if (q.id) {
          await updateContentQuestion(q.id, {
            orderIndex: 1000 + i,
            type:
              q.questionType === "mcq-single"
                ? "MCQ_SINGLE"
                : q.questionType === "mcq-multiple"
                ? "MCQ_MULTIPLE"
                : q.questionType === "short-text"
                ? "SHORT_TEXT"
                : "WRITTEN_RESPONSE",
            correctAnswers: q.correctAnswers ?? [],
          });
        }
      }

      // STEP 2: Create new questions first
      const updatedQuestions = [...questions];

      for (let i = 0; i < updatedQuestions.length; i++) {
        const question = updatedQuestions[i];

        if (!question.id) {
          const created = await createContentQuestion(
            contentId,
            mapSingleQuestionToApi(question, i)
          );

          updatedQuestions[i] = {
            ...question,
            id: created.id,
          };
        }
      }

      // STEP 3: Update final order for ALL
      for (let i = 0; i < updatedQuestions.length; i++) {
        const question = updatedQuestions[i];

        await updateContentQuestion(
          question.id!,
          mapSingleQuestionToApi(question, i)
        );
      }

      setQuestions(updatedQuestions);

      navigate("/admin/content-management");

    } catch (err: any) {
      alert(err?.message || "Save failed");
    }
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
    selectedQuestionTempId,
    setSelectedQuestionTempId,
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
    thumbnailFile,
    setThumbnailFile,
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
    audioFile,
    setAudioFile,
    safeRevokeObjectUrl,


    handleSaveExit,
  };
}