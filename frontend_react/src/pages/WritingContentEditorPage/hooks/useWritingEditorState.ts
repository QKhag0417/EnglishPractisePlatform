import { useState, useRef, useEffect } from "react";
import { useWritingEditorApi } from "./useWritingEditorApi";
import { useNavigate, useParams } from "react-router";
import { API_BASE } from "../../../env";
import { useSupportingImagesState } from "./useSupportingImagesState";
import {
  mapTopicTagApiToUi,
  mapTopicTagUiToApi,
  TopicTag,
} from "../../ListeningContentEditorPage/types";
import {
  mapWritingApiTypeToUi,
  mapWritingUiTypeToApi,
  WritingQuestionType,
} from "../types";

export function useWritingEditorState(isEditMode: boolean, id?: string) {
  const navigate = useNavigate();

  const [hasImageChanges, setHasImageChanges] = useState(false);
  const markImageChanged = () => {
    setHasImageChanges(true);
  };
  const {
    fetchDetail,

    uploadImages,
    deleteImages,
    uploadThumbnail,
    deleteThumbnail,

    createContent,
    updateContent,
    saveContent,
  } = useWritingEditorApi();

  const {
    multiImageInputRef,
    uploadedImages,
    handleMultiImageChange,
    handleSaveImage,
    handleRemoveImage,
    handleCopyUrl,
    getSavedImageUrls,
    loadExistingImages,
  } = useSupportingImagesState(id, markImageChanged);

  // ================= META =================
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [task, setTask] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [status, setStatus] = useState<"Draft" | "Published">("Draft");

  const [questionTypes, setQuestionTypes] = useState<WritingQuestionType[]>([]);
  const [topicTags, setTopicTags] = useState<TopicTag[]>([]);

  // ================= THUMBNAIL&AUDIO =================
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | string | null>(
    null,
  );
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [thumbnailSaved, setThumbnailSaved] = useState(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const safeRevokeObjectUrl = (url: string | null) => {
    if (!url) return;
    if (url.startsWith("blob:")) URL.revokeObjectURL(url);
  };

  useEffect(() => {
    return () => {
      safeRevokeObjectUrl(thumbnailPreview);
    };
  }, []);

  const [updatedOn, setUpdatedOn] = useState<string>("");

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
        setQuestionTypes(
          (content.questionTypeTags || []).map(mapWritingApiTypeToUi),
        );
        setTopicTags((content.topicTags || []).map(mapTopicTagApiToUi));
        setUpdatedOn(formatDateArrayToInput(content.updatedOn) || "");

        if (content.thumbnailUrl) {
          setThumbnailPreview(`${API_BASE}${content.thumbnailUrl}`);
          setThumbnailUrl(content.thumbnailUrl);
          setThumbnailSaved(true);
        }
      } catch (err) {
        console.error("Failed to load content", err);
        alert("Cannot load content for editing");
      }
    };
    loadData();
  }, [isEditMode, id]);

  const formatDateArrayToInput = (arr: number[]) => {
    if (!arr || arr.length < 3) return "";

    const [year, month, day] = arr;

    const mm = String(month).padStart(2, "0");
    const dd = String(day).padStart(2, "0");

    return `${year}-${mm}-${dd}`;
  };

  const handleSaveThumbnail = async () => {
    if (!thumbnailFile || !(thumbnailFile instanceof File)) return;

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

  const handleSaveExit = async () => {
    try {
      const contentPayload = {
        skill: "WRITING",
        title,
        instructions,
        task,
        questionTypeTags: questionTypes.map(mapWritingUiTypeToApi),
        topicTags: topicTags.map(mapTopicTagUiToApi),
        durationMinutes,
        status: status === "Draft" ? "DRAFT" : "PUBLISHED",
        thumbnailUrl,
        imageUrls: getSavedImageUrls(),
      };

      const contentResponse = await saveContent(contentPayload, isEditMode, id);

      if (!contentResponse?.id) {
        throw new Error("Cannot get content ID from response");
      }

      setHasImageChanges(false);
      navigate("/content-management");
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

    safeRevokeObjectUrl(thumbnailPreview);
    const url = URL.createObjectURL(file);

    setThumbnailFile(file);
    setThumbnailPreview(url);
    setThumbnailUrl(null);
    setThumbnailSaved(false);
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

    safeRevokeObjectUrl(thumbnailPreview);
    const url = URL.createObjectURL(file);

    setThumbnailFile(file);
    setThumbnailPreview(url);
    setThumbnailUrl(null);
    setThumbnailSaved(false);
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

    questionTypes,
    setQuestionTypes,
    topicTags,
    setTopicTags,

    //thumbnail && audio
    thumbnailFile,
    setThumbnailFile,
    thumbnailPreview,
    setThumbnailPreview,
    thumbnailInputRef,
    handleThumbnailChange,
    handleThumbnailDrop,
    handleDragOver,
    displayUpdatedOn,
    updatedOn,
    setUpdatedOn,
    safeRevokeObjectUrl,
    handleSaveThumbnail,
    thumbnailSaved,
    handleRemoveThumbnail,

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
