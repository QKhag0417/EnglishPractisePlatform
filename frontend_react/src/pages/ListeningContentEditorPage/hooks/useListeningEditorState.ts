import { useState, useRef, useEffect } from "react";
import { mapApiTypeToUi , mapUiTypeToApi, Question, QuestionType} from "../types";
import { useListeningEditorApi } from "./useListeningEditorApi";
import { useNavigate} from "react-router";
import { API_BASE } from "../../../env";
import { useSupportingImagesState } from "./useSupportingImagesState";

export function useListeningEditorState(
  isEditMode: boolean,
  id?: string
) {
  const navigate = useNavigate();

  const [hasImageChanges, setHasImageChanges] = useState(false);
  const markImageChanged = () => {
    setHasImageChanges(true);
  };
  const {
    fetchDetail,
    uploadThumbnail,
    uploadAudio,
    deleteThumbnail,
    deleteAudio,
    createContent,
    updateContent,
    saveContent,
    createContentQuestion,
    deleteContentQuestion,
    updateContentQuestion,
    fetchContentQuestions,
  } = useListeningEditorApi();

  const {
    multiImageInputRef,
    uploadedImages,
    handleMultiImageChange,
    handleSaveImage,
    handleRemoveImage,
    handleCopyUrl,
    getSavedImageUrls,
    loadExistingImages
  } = useSupportingImagesState(id, markImageChanged);

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
    useState<QuestionType>("Multiple Choice");
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [saveState, setSaveState] = useState<"saved" | "unsaved" | "editing">("saved");

  // ================= THUMBNAIL&AUDIO =================
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [thumbnailSaved, setThumbnailSaved] = useState(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioSaved, setAudioSaved] = useState(false);
  const audioInputRef = useRef<HTMLInputElement>(null);

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
      type: "Multiple Choice",
      correctAnswer: "",
      questionType: "Multiple Choice",
      correctAnswers: [],
    };

    setQuestions([initialQuestion]);
    setSelectedQuestionTempId(initialQuestion.tempId);;
  }, [isEditMode]);

  // ================= EDIT MODE LOAD =================
  useEffect(() => {
    if (!isEditMode || !id) return;

    const loadData = async () => {
      try {

        const content = await fetchDetail(id);

        if (content.imageUrls && content.imageUrls.length > 0) {
          loadExistingImages(content.imageUrls);
        }
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
          setThumbnailUrl(content.thumbnailUrl);
          setThumbnailSaved(true);
        }

        if (content.audioUrl) {
          setAudioPreview(`${API_BASE}${content.audioUrl}`);
          setAudioUrl(content.audioUrl);
          setAudioSaved(true);
        }

        // Fetch questions
        const questionsFromApi = await fetchContentQuestions(id);

        const mappedQuestions: Question[] = (questionsFromApi || []).map(
          (q: any) => ({
            id: q.id,
            tempId: q.id,
            number: q.orderIndex,
            type: mapApiTypeToUi(q.type),
            correctAnswer: "",
            questionType: mapApiTypeToUi(q.type),
            correctAnswers: q.correctAnswers || [],
          })
        );

        setQuestions(mappedQuestions);

        if (mappedQuestions.length > 0) {
          setSelectedQuestionTempId(mappedQuestions[0].tempId);
        }

      } catch (err) {
        console.error("Failed to load content", err);
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
      type: "Multiple Choice",
      correctAnswer: "",
      questionType: "Multiple Choice",
      correctAnswers: [],
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
              type: questionType,
              correctAnswer: correctAnswers.join(", "),
              questionType,
              correctAnswers,
            }
          : q,
      ),
    );
  };

  useEffect(() => {
      if (!selectedQuestion) return;

      setQuestionType(selectedQuestion.questionType);
      setCorrectAnswers(selectedQuestion.correctAnswers || []);

      setSaveState("saved");
      setHasUnsavedChanges(false);
  }, [selectedQuestionTempId]);

  useEffect(() => {
    const tags = Array.from(
      new Set(questions.map((q) => q.questionType))
    );

    setQuestionTypeTags(tags);
  }, [questions]);

  const handleSaveQuestion = () => {
      ensureCurrentQuestionIsPersisted();
      setSaveState("saved");
      setHasUnsavedChanges(false);
    };

  const handleCancelQuestion = () => {
      if (!selectedQuestion) return;

      setQuestionType(selectedQuestion.questionType);
      setCorrectAnswers(selectedQuestion.correctAnswers || []);

      setSaveState("saved");
      setHasUnsavedChanges(false);
  };

  const mapSingleQuestionToApi = (q: Question, index: number) => {
    const apiType = mapUiTypeToApi(q.questionType);

    return {
      orderIndex: index + 1,
      type: apiType,
      correctAnswers: (q.correctAnswers ?? [])
        .map(a => a.trim())
        .filter(a => a.length > 0),
    };
  };

  const handleSaveThumbnail = async () => {
    if (!thumbnailFile) return;

    try {
      const url = await uploadThumbnail(thumbnailFile);
      setThumbnailUrl(url);
      setThumbnailSaved(true);
      setHasImageChanges(true);
    } catch (err) {
      alert("Thumbnail upload failed");
    }
  };

  const handleRemoveThumbnail = async () => {
    if (!thumbnailPreview) return;

    try {
      // Nếu chưa save → chỉ xóa local
      if (!thumbnailSaved) {
        safeRevokeObjectUrl(thumbnailPreview);
        setThumbnailFile(null);
        setThumbnailPreview(null);
        setThumbnailUrl(null);
        setThumbnailSaved(false);
        setHasImageChanges(true);

        return;
      }

      if (!thumbnailUrl) return;

      await deleteThumbnail(thumbnailUrl);

      setThumbnailFile(null);
      setThumbnailPreview(null);
      setThumbnailUrl(null);
      setThumbnailSaved(false);
      setHasImageChanges(true);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSaveAudio = async () => {
    if (!audioFile) return;

    try {
      const url = await uploadAudio(audioFile);
      setAudioUrl(url);
      setAudioSaved(true);
      setHasImageChanges(true);
    } catch (err) {
      alert("Audio upload failed");
    }
  };

  const handleRemoveAudio = async () => {
    if (!audioPreview) return;

    try {
      if (!audioSaved) {
        safeRevokeObjectUrl(audioPreview);
        setAudioFile(null);
        setAudioPreview(null);
        setAudioUrl("");

        setHasImageChanges(true);
        return;
      }

      if (!audioUrl) return;

      await deleteAudio(audioUrl);

      setAudioFile(null);
      setAudioPreview(null);
      setAudioUrl(null);
      setAudioSaved(false);
      setHasImageChanges(true);
    } catch (error: any) {
      alert(error.message);
    }
  };


  const handleSaveExit = async () => {
    try {
      ensureCurrentQuestionIsPersisted();

      if (!audioUrl || audioUrl.trim() === "") {
        alert("Audio file is required for Listening content");
        return;
      }

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
        imageUrls: getSavedImageUrls()
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

      //  SAVE QUESTIONS
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
            type: mapUiTypeToApi(q.questionType),
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
      setHasImageChanges(false);
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
    setThumbnailUrl(null);
    setThumbnailSaved(false);

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
    setAudioUrl(null);
    setAudioSaved(false);
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
    setThumbnailUrl(null);
    setThumbnailSaved(false);

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
    setAudioUrl(null);
    setAudioSaved(false);
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
    handleSaveThumbnail,
    handleSaveAudio,
    thumbnailSaved,
    audioSaved,
    handleRemoveThumbnail,
    handleRemoveAudio,

    // supporting images
    multiImageInputRef,
    uploadedImages,
    handleMultiImageChange,
    handleSaveImage,
    handleRemoveImage,
    handleCopyUrl,

    hasImageChanges,
    setHasImageChanges,
    handleSaveExit,
  };
}