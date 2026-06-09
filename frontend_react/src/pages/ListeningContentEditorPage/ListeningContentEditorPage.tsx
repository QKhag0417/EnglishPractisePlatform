import { Footer } from "../../components/Footer";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { EditorHeader } from "./components/EditorHeader";
import { QuestionsTable } from "./components/QuestionsTable";
import { AnswerScoringPanel } from "./components/AnswerScoringPanel";
import { UploadThumbnailCard } from "./components/UploadThumbnailCard";
import { UploadAudioCard } from "./components/UploadAudioCard";
import { ExerciseInfoCard } from "./components/ExerciseInfoCard";
import { useParams, useNavigate } from "react-router";
import { useListeningEditorState } from "./hooks/useListeningEditorState";
import { SupportingImagesBlock } from "./components/SupportingImagesBlock";
import { NavBarUnified } from "../../components/NavBarUnified";

export function ListeningContentEditorPage() {
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
    transcript,
    setTranscript,
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
    topicTag,
    setTopicTag,
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
  } = useListeningEditorState(isEditMode, exerciseId);

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

              {/* Audio Script Block */}
              <div className="bg-white rounded-[12px] p-[32px] shadow-sm border border-gray-200">
                <Label className="font-['Inter'] font-semibold text-[16px] text-gray-900 mb-[16px] block">
                  Audio Transcript
                </Label>
                <Textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Type the audio script/transcript for this listening exercise here..."
                  className="min-h-[200px] border border-gray-300 rounded-[8px] resize-none font-['Inter'] bg-white
                 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <QuestionsTable
                questions={questions}
                selectedQuestionTempId={selectedQuestionTempId}
                onSelect={setSelectedQuestionTempId}
                onDelete={deleteQuestion}
                onAdd={addNewQuestion}
              />

              <AnswerScoringPanel
                selectedQuestionNumber={selectedQuestion?.number}
                questionType={questionType}
                setQuestionType={setQuestionType}
                topicTag={topicTag}
                setTopicTag={setTopicTag}
                correctAnswers={correctAnswers}
                setCorrectAnswers={setCorrectAnswers}
                newAnswerInput={newAnswerInput}
                setNewAnswerInput={setNewAnswerInput}
                saveState={saveState}
                markAsUnsaved={markAsUnsaved}
                handleSaveQuestion={handleSaveQuestion}
                handleCancelQuestion={handleCancelQuestion}
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

              <UploadAudioCard
                audioPreview={audioPreview}
                audioSaved={audioSaved}
                inputRef={audioInputRef}
                onFileChange={handleAudioChange}
                onDrop={handleAudioDrop}
                onDragOver={handleDragOver}
                onSave={handleSaveAudio}
                onRemove={handleRemoveAudio}
              />

              <ExerciseInfoCard
                title={title}
                onTitleChange={setTitle}
                task={task}
                onTaskChange={setTask}
                questionTypeTags={questionTypeTags}
                onQuestionTypeTagsChange={setQuestionTypeTags}
                topicTags={topicTags}
                onTopicTagsChange={setTopicTags}
                updatedOn={displayUpdatedOn}
                questionsCount={questions.length}
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
