import { NavBarAdmin } from "../../components/NavBarAdmin";
import { Footer } from "../../components/Footer";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import { EditorHeader } from "./components/EditorHeader";
import { UploadThumbnailCard } from "./components/UploadThumbnailCard";
import { ExerciseInfoCard } from "./components/ExerciseInfoCard";
import { useSupportingImagesState } from "./hooks/useSupportingImagesState";
import { useAuth } from "../../contexts/AuthContext";
import { useParams, useNavigate } from "react-router";
import { useWritingEditorState } from "./hooks/useWritingEditorState";
import { SupportingImagesBlock } from "./components/SupportingImagesBlock";
import { TopicTagPanel } from "../WritingContentEditorPage/components/TopicTagPanel";
import { QuestionTypePane } from "./components/QuestionTypePane";
import { NavBarUnified } from "../../components/NavBarUnified";

export function WritingContentEditorPage() {
  // ===== HANDLERS =====
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/content-management");
  };

  const { exerciseId } = useParams();
  const isEditMode = !!exerciseId;

  const {
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
  } = useWritingEditorState(isEditMode, exerciseId);

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBarUnified />

      <EditorHeader
        isEditMode={isEditMode}
        status={status}
        onStatusChange={setStatus}
        onCancel={handleCancel}
        onSaveExit={handleSaveExit}
        disableCancel={hasImageChanges}
      />

      <div className="pt-[40px] pb-[60px] px-[60px]">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-[1fr_400px] gap-[32px]">
            {/* LEFT */}
            <div className="space-y-[24px]">
              {/* Instructions */}
              <div className="bg-white rounded-[12px] p-[32px] shadow-sm border border-gray-200">
                <Label className="font-['Inter'] font-semibold text-[16px] text-gray-900 mb-[16px] block">
                  Instructions & Note Layout
                </Label>
                <Textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Type the shared instructions and notes layout here..."
                  className="min-h-[200px] border border-gray-300 rounded-[8px] resize-none font-['Inter'] bg-white
                 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <QuestionTypePane
                questionTypes={questionTypes}
                onQuestionTypesChange={setQuestionTypes}
              />

              <TopicTagPanel
                topicTags={topicTags}
                onTopicTagsChange={setTopicTags}
              />

              <SupportingImagesBlock
                multiImageInputRef={
                  multiImageInputRef as React.RefObject<HTMLInputElement>
                }
                uploadedImages={uploadedImages}
                handleMultiImageChange={handleMultiImageChange}
                handleSaveImage={handleSaveImage}
                handleRemoveImage={handleRemoveImage}
                handleCopyUrl={handleCopyUrl}
              />
            </div>

            {/* RIGHT */}
            <div className="space-y-[24px]">
              <UploadThumbnailCard
                thumbnailPreview={thumbnailPreview}
                thumbnailSaved={thumbnailSaved}
                inputRef={thumbnailInputRef}
                onFileChange={handleThumbnailChange}
                onDrop={handleThumbnailDrop}
                onDragOver={handleDragOver}
                onBrowseClick={() => thumbnailInputRef.current?.click()}
                onSave={handleSaveThumbnail}
                onRemove={handleRemoveThumbnail}
              />

              <ExerciseInfoCard
                title={title}
                onTitleChange={setTitle}
                task={task}
                onTaskChange={setTask}
                questionTypes={questionTypes}
                onQuestionTypesChange={setQuestionTypes}
                topicTags={topicTags}
                onTopicTagsChange={setTopicTags}
                updatedOn={displayUpdatedOn}
                durationMinutes={durationMinutes}
                onDurationChange={setDurationMinutes}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
