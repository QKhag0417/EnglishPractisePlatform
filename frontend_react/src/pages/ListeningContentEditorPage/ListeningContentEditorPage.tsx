import { NavBarAdmin } from "../../components/NavBarAdmin";
import { Footer } from "../../components/Footer";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EditorHeader } from "./components/EditorHeader";
import { QuestionsTable } from "./components/QuestionsTable";
import { AnswerScoringPanel } from "./components/AnswerScoringPanel";
import { UploadThumbnailCard } from "./components/UploadThumbnailCard";
import { UploadAudioCard } from "./components/UploadAudioCard";
import { ExerciseInfoCard } from "./components/ExerciseInfoCard";
import { useAuth } from "../../contexts/AuthContext";
import { useParams, useNavigate } from "react-router";
import { useListeningEditorState } from "./hooks/useListeningEditorState";


export function ListeningContentEditorPage() {

    // ===== HANDLERS =====
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();


    const handleLogout = () => {
        logout();
        navigate("/");
    };
    const handleCancel = () => {
        navigate("/admin/content-management");
    };
    const { id } = useParams();
    const isEditMode = !!id;

    const {
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
      questions,
      selectedQuestionId,
      setSelectedQuestionId,
      selectedQuestion,
      addNewQuestion,
      deleteQuestion,
      questionType,
      setQuestionType,
      topicTags,
      setTopicTags,
      correctAnswers,
      setCorrectAnswers,
      questionTypeTags,
      setQuestionTypeTags,
      options,
      setOptions,
      newAnswerInput,
      setNewAnswerInput,
      saveState,
      setSaveState,
      markAsUnsaved,
      handleSaveExit,
      handleSaveQuestion,
      handleCancelQuestion,
      thumbnailPreview,
      setThumbnailPreview,
      thumbnailInputRef,
      handleThumbnailChange,
      handleAudioChange,
      audioInputRef,
      handleThumbnailDrop,
      audioPreview,
      setAudioPreview,
      handleAudioDrop,
      handleDragOver,
      displayUpdatedOn,
      updatedOn,
      setUpdatedOn,
    } = useListeningEditorState(isEditMode);


    return (
      <div className="bg-gray-50 min-h-screen">
        <NavBarAdmin onLogout={handleLogout} />

        <EditorHeader
          isEditMode={isEditMode}
          status={status}
          onStatusChange={setStatus}
          onCancel={handleCancel}
          onSaveExit={handleSaveExit}
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

                <QuestionsTable
                  questions={questions}
                  selectedQuestionId={selectedQuestionId}
                  onSelect={setSelectedQuestionId}
                  onDelete={deleteQuestion}
                  onAdd={addNewQuestion}
                />

                <AnswerScoringPanel
                  selectedQuestionNumber={selectedQuestion?.number}
                  questionType={questionType}
                  setQuestionType={setQuestionType}
                  options={options}
                  setOptions={setOptions}
                  correctAnswers={correctAnswers}
                  setCorrectAnswers={setCorrectAnswers}
                  newAnswerInput={newAnswerInput}
                  setNewAnswerInput={setNewAnswerInput}
                  saveState={saveState}
                  markAsUnsaved={markAsUnsaved}
                  handleSaveQuestion={handleSaveQuestion}
                  handleCancelQuestion={handleCancelQuestion}
                />
              </div>

              {/* RIGHT */}
              <div className="space-y-[24px]">

                <UploadThumbnailCard
                  preview={thumbnailPreview}
                  inputRef={thumbnailInputRef}
                  onChange={handleThumbnailChange}
                  onDrop={handleThumbnailDrop}
                  onRemove={() => {
                    safeRevokeObjectUrl(thumbnailPreview);
                    setThumbnailFile(null);
                    setThumbnailPreview(null);
                  }}
                />

                <UploadAudioCard
                  preview={audioPreview}
                  inputRef={audioInputRef}
                  onChange={handleAudioChange}
                  onDrop={handleAudioDrop}
                  onRemove={() => {
                    safeRevokeObjectUrl(audioPreview);
                    setAudioFile(null);
                    setAudioPreview(null);
                  }}
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