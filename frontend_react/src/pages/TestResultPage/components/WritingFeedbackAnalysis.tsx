import {
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Edit,
  ClipboardList,
  Save,
} from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { useEffect, useState } from "react";
import {
  CreateWritingCriterionFeedbackRequestBody,
  TutorScore,
  WritingCriterionFeedbackBySubmissionItem,
  WritingCriterionType,
  WritingFeedbackLabel,
  WritingFeedbackType,
} from "../types.ts";
import { useAuth } from "../../../contexts/AuthContext.tsx";
import {
  useDeleteWritingCriterionFeedbackById,
  useGetAllTutorBandScoreByWritingId,
  useGetWritingCriterionFeedbackBySubmissionId,
  usePostCreateWritingCriterionFeedback,
  usePutUpsertTutorBandScore,
  usePutWritingCriterionFeedbackById,
  useWritingReviewRefreshStore,
} from "../hooks/index.ts";
import {
  SelectOption,
  SelectV2,
} from "../../MyProfilePage/components/SelectV2.tsx";

type Props = {
  submissionId: string;
  writingSubmissionId: string;
  taskType: string;
  canEdit?: boolean;
};

export function WritingFeedbackAnalysis({
  submissionId,
  writingSubmissionId,
  taskType,
  canEdit = false,
}: Props) {
  // =========================
  // Auth
  // =========================

  const { user } = useAuth();

  const userId = user?.id || "";

  const isTutor = user?.role === "tutor";

  // =========================
  // State for current tutor status
  // =========================

  const canManageTutorReview = isTutor && canEdit;

  // =========================
  // Post create writing criterion feedback
  // =========================

  const postCreateWritingCriterionFeedback =
    usePostCreateWritingCriterionFeedback();

  // =========================
  // Get writing criterion feedback by submission id
  // =========================

  const getWritingCriterionFeedbackBySubmissionId =
    useGetWritingCriterionFeedbackBySubmissionId();

  useEffect(() => {
    if (!submissionId) return;
    getWritingCriterionFeedbackBySubmissionId.get({
      submissionId,
    });
  }, [submissionId]);

  const allFeedback =
    getWritingCriterionFeedbackBySubmissionId.writingCriterionFeedbacks;

  // =========================
  // Put writing criterion feedback by id
  // =========================

  const putWritingCriterionFeedbackById = usePutWritingCriterionFeedbackById();

  // =========================
  // Delete writing criterion feedback by id
  // =========================

  const deleteWritingCriterionFeedbackById =
    useDeleteWritingCriterionFeedbackById();

  // =========================
  // Get all tutor band score by writing id
  // =========================

  const getAllTutorBandScoreByWritingId = useGetAllTutorBandScoreByWritingId();

  useEffect(() => {
    if (!writingSubmissionId) return;
    getAllTutorBandScoreByWritingId.get({
      writingAnswerId: writingSubmissionId,
    });
  }, [writingSubmissionId]);

  const allTutorBandScores =
    getAllTutorBandScoreByWritingId.writingReviewBandScores;

  // =========================
  // Put upsert tutor band score
  // =========================

  const putUpsertTutorBandScore = usePutUpsertTutorBandScore();

  // =========================
  // Writing review refresh store
  // =========================

  const { bumpRefreshVersion } = useWritingReviewRefreshStore();

  // =========================
  // Get default criterion
  // =========================

  const getDefaultCriterion = (task: string): WritingCriterionType => {
    if (task === "TASK_1") return "TASK_ACHIEVEMENT";
    if (task === "TASK_2") return "TASK_RESPONSE";
    return "COHERENCE_AND_COHESION";
  };

  const [selectedCriterion, setSelectedCriterion] =
    useState<WritingCriterionType>(getDefaultCriterion(taskType));

  useEffect(() => {
    setSelectedCriterion(getDefaultCriterion(taskType));
  }, [taskType]);

  // =========================
  // Get criterion label
  // =========================

  const getCriterionLabel = (
    task: "TASK_1" | "TASK_2" | "TASK_3" | "TASK_4" | string,
    criterion: WritingCriterionType,
  ) => {
    if (criterion === "TASK_ACHIEVEMENT" && task === "TASK_1") {
      return "Task Achievement";
    }

    if (criterion === "TASK_RESPONSE" && task === "TASK_2") {
      return "Task Response";
    }

    const criteriaLabels: Partial<Record<WritingCriterionType, string>> = {
      COHERENCE_AND_COHESION: "Coherence and Cohesion",
      LEXICAL_RESOURCE: "Lexical Resource",
      GRAMMATICAL_RANGE_AND_ACCURACY: "Grammatical Range and Accuracy",
    };

    return criteriaLabels[criterion] || criterion;
  };

  const getAvailableCriteria = (task: string): WritingCriterionType[] => {
    const commonCriteria: WritingCriterionType[] = [
      "COHERENCE_AND_COHESION",
      "LEXICAL_RESOURCE",
      "GRAMMATICAL_RANGE_AND_ACCURACY",
    ];

    if (task === "TASK_1") {
      return ["TASK_ACHIEVEMENT", ...commonCriteria];
    }

    if (task === "TASK_2") {
      return ["TASK_RESPONSE", ...commonCriteria];
    }

    return commonCriteria;
  };

  // =========================
  // Tutor scores
  // =========================

  const buildTutorScores = (task: string): TutorScore[] => {
    return getAvailableCriteria(task).map((criterion) => ({
      criterion,
      score: "",
    }));
  };

  const activeTutorBandScore = isTutor
    ? allTutorBandScores?.find(
        (item) => item.reviewedByUser.userId === userId,
      ) || null
    : allTutorBandScores?.[0] || null;

  const [tutorScores, setTutorScores] = useState<TutorScore[]>(
    buildTutorScores(taskType),
  );

  useEffect(() => {
    setTutorScores(buildTutorScores(taskType));
  }, [taskType]);

  const handleScoreChange = (
    criterion: WritingCriterionType,
    value: string,
  ) => {
    setTutorScores((prev) =>
      prev.map((score) =>
        score.criterion === criterion ? { ...score, score: value } : score,
      ),
    );
  };

  useEffect(() => {
    const baseScores = buildTutorScores(taskType);

    if (!activeTutorBandScore) {
      setTutorScores(baseScores);
      return;
    }

    const mappedScores = baseScores.map((item) => {
      switch (item.criterion) {
        case "TASK_RESPONSE":
          return {
            ...item,
            score: activeTutorBandScore.tutorTaskResponseBand?.toString() ?? "",
          };

        case "TASK_ACHIEVEMENT":
          return {
            ...item,
            score:
              activeTutorBandScore.tutorTaskAchievementBand?.toString() ?? "",
          };

        case "COHERENCE_AND_COHESION":
          return {
            ...item,
            score:
              activeTutorBandScore.tutorCoherenceAndCohesionBand?.toString() ??
              "",
          };

        case "LEXICAL_RESOURCE":
          return {
            ...item,
            score:
              activeTutorBandScore.tutorLexicalResourceBand?.toString() ?? "",
          };

        case "GRAMMATICAL_RANGE_AND_ACCURACY":
          return {
            ...item,
            score:
              activeTutorBandScore.tutorGrammaticalRangeAndAccuracyBand?.toString() ??
              "",
          };

        default:
          return item;
      }
    });

    setTutorScores(mappedScores);
  }, [activeTutorBandScore, taskType]);

  // =========================
  // Handle save tutor scores
  // =========================

  const getScoreValue = (criterion: WritingCriterionType): number => {
    const rawValue = tutorScores.find(
      (item) => item.criterion === criterion,
    )?.score;

    if (!rawValue || rawValue.trim() === "") return 0;

    const parsed = Number(rawValue);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const handleSaveTutorScores = async () => {
    if (!writingSubmissionId || !userId) return;

    await putUpsertTutorBandScore.put(
      {
        reviewedByUserId: userId,
        writingAnswerId: writingSubmissionId,
      },
      {
        tutorTaskAchievementBand: getScoreValue("TASK_ACHIEVEMENT"),
        tutorTaskResponseBand: getScoreValue("TASK_RESPONSE"),
        tutorCoherenceAndCohesionBand: getScoreValue("COHERENCE_AND_COHESION"),
        tutorLexicalResourceBand: getScoreValue("LEXICAL_RESOURCE"),
        tutorGrammaticalRangeAndAccuracyBand: getScoreValue(
          "GRAMMATICAL_RANGE_AND_ACCURACY",
        ),
      },
    );

    await getAllTutorBandScoreByWritingId.get({
      writingAnswerId: writingSubmissionId,
    });

    bumpRefreshVersion();
  };

  // =========================
  // Validate scores
  // =========================

  const isTutorScoresComplete = tutorScores.every((scoreItem) => {
    const value = scoreItem.score.trim();

    if (value === "") return false;

    const parsed = Number(value);
    return !Number.isNaN(parsed) && parsed >= 0 && parsed <= 9;
  });

  // =========================
  // Filter feedback
  // =========================

  const criterionFilteredFeedback = allFeedback.filter(
    (item) => item.criterionName === selectedCriterion,
  );

  const strengthFeedback = criterionFilteredFeedback.filter(
    (item) => item.feedbackType === "STRENGTH",
  );

  const weaknessFeedback = criterionFilteredFeedback.filter(
    (item) => item.feedbackType === "WEAKNESS",
  );

  // =========================
  // Feedback labels by criterion and type
  // =========================

  const WRITING_FEEDBACK_LABELS_BY_CRITERION_AND_TYPE: Partial<
    Record<
      WritingCriterionType,
      Record<WritingFeedbackType, WritingFeedbackLabel[]>
    >
  > = {
    TASK_RESPONSE: {
      STRENGTH: [
        "FULL_TASK_COVERAGE",
        "CLEAR_POSITION",
        "CONSISTENT_POSITION",
        "RELEVANT_IDEAS",
        "GOOD_IDEA_DEVELOPMENT",
        "ADEQUATE_SUPPORT",
        "APPROPRIATE_FORMAT",
        "SUFFICIENT_LENGTH",
        "CLEAR_CONCLUSION",
      ],
      WEAKNESS: [
        "PARTIAL_TASK_COVERAGE",
        "UNCLEAR_POSITION",
        "INCONSISTENT_POSITION",
        "IRRELEVANT_IDEAS",
        "INSUFFICIENT_IDEA_DEVELOPMENT",
        "INSUFFICIENT_SUPPORT",
        "INAPPROPRIATE_FORMAT",
        "UNDER_LENGTH_RESPONSE",
        "WEAK_CONCLUSION",
      ],
    },
    TASK_ACHIEVEMENT: {
      STRENGTH: [
        "FULL_TASK_COVERAGE",
        "CLEAR_POSITION",
        "CONSISTENT_POSITION",
        "RELEVANT_IDEAS",
        "GOOD_IDEA_DEVELOPMENT",
        "ADEQUATE_SUPPORT",
        "APPROPRIATE_FORMAT",
        "SUFFICIENT_LENGTH",
        "CLEAR_OVERVIEW",
        "GOOD_KEY_FEATURE_SELECTION",
        "GOOD_DATA_SUPPORT",
      ],
      WEAKNESS: [
        "PARTIAL_TASK_COVERAGE",
        "UNCLEAR_POSITION",
        "INCONSISTENT_POSITION",
        "IRRELEVANT_IDEAS",
        "INSUFFICIENT_IDEA_DEVELOPMENT",
        "INSUFFICIENT_SUPPORT",
        "INAPPROPRIATE_FORMAT",
        "UNDER_LENGTH_RESPONSE",
        "MISSING_OVERVIEW",
        "MISSING_KEY_FEATURES",
        "INSUFFICIENT_DATA_SUPPORT",
      ],
    },
    COHERENCE_AND_COHESION: {
      STRENGTH: [
        "LOGICAL_ORGANISATION",
        "CLEAR_PROGRESSION",
        "EFFECTIVE_PARAGRAPHING",
        "EFFECTIVE_COHESIVE_DEVICES",
        "NATURAL_LINKER_USE",
        "GOOD_REFERENCE_USE",
        "MINIMAL_REPETITION",
        "CLEAR_PARAGRAPH_FOCUS",
      ],
      WEAKNESS: [
        "WEAK_ORGANISATION",
        "UNCLEAR_PROGRESSION",
        "WEAK_PARAGRAPHING",
        "MISUSED_COHESIVE_DEVICES",
        "OVERUSE_OF_LINKERS",
        "UNCLEAR_REFERENCING",
        "REPETITION",
        "UNCLEAR_PARAGRAPH_FOCUS",
      ],
    },
    LEXICAL_RESOURCE: {
      STRENGTH: [
        "VARIED_VOCABULARY",
        "PRECISE_VOCABULARY",
        "APPROPRIATE_WORD_CHOICE",
        "GOOD_COLLOCATION",
        "APPROPRIATE_STYLE",
        "GOOD_SPELLING",
        "GOOD_WORD_FORMATION",
        "NATURAL_LANGUAGE_USE",
      ],
      WEAKNESS: [
        "LIMITED_VOCABULARY",
        "IMPRECISE_VOCABULARY",
        "INAPPROPRIATE_WORD_CHOICE",
        "WEAK_COLLOCATION",
        "STYLE_INAPPROPRIATE",
        "SPELLING_ERRORS",
        "WORD_FORMATION_ERRORS",
        "MEMORISED_LANGUAGE_OVERUSE",
      ],
    },
    GRAMMATICAL_RANGE_AND_ACCURACY: {
      STRENGTH: [
        "VARIED_SENTENCE_STRUCTURES",
        "GOOD_COMPLEX_STRUCTURE_USE",
        "GRAMMAR_WELL_CONTROLLED",
        "GOOD_PUNCTUATION",
        "WELL_FORMED_SENTENCES",
      ],
      WEAKNESS: [
        "LIMITED_GRAMMATICAL_RANGE",
        "FAULTY_COMPLEX_SENTENCES",
        "GRAMMAR_ERRORS",
        "PUNCTUATION_ERRORS",
        "SENTENCE_FRAGMENT_OR_RUN_ON",
      ],
    },
  };

  const getWritingFeedbackLabels = (
    criterion: WritingCriterionType,
    feedbackType: WritingFeedbackType,
  ): WritingFeedbackLabel[] => {
    return (
      WRITING_FEEDBACK_LABELS_BY_CRITERION_AND_TYPE[criterion]?.[
        feedbackType
      ] || []
    );
  };

  const getDefaultFeedbackLabel = (
    criterion: WritingCriterionType,
    feedbackType: WritingFeedbackType,
  ): WritingFeedbackLabel => {
    return getWritingFeedbackLabels(criterion, feedbackType)[0];
  };

  const formatFeedbackLabel = (label: WritingFeedbackLabel) => {
    return label
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // =========================
  // Handle add tutor feedback item
  // =========================

  const [addItemType, setAddItemType] =
    useState<WritingFeedbackType>("STRENGTH");

  const buildNewFeedbackItem = (
    criterion: WritingCriterionType,
    feedbackType: WritingFeedbackType,
  ): CreateWritingCriterionFeedbackRequestBody => ({
    authorType: "TUTOR",
    criterionName: criterion,
    feedbackType,
    label: getDefaultFeedbackLabel(criterion, feedbackType),
    description: "",
    explanation: "",
    evidenceSentences: [""],
    recommendedActionDescription: "",
    recommendedActionExplanation: "",
    userPracticeWritingAnswerId: writingSubmissionId,
    reviewedByUserId: userId,
  });

  const [newItem, setNewItem] =
    useState<CreateWritingCriterionFeedbackRequestBody>(() =>
      buildNewFeedbackItem(selectedCriterion, "STRENGTH"),
    );

  const handleChangeNewItemLabel = (value: WritingFeedbackLabel) => {
    setNewItem((prev) => ({
      ...prev,
      label: value,
    }));
  };

  const handleChangeNewItemDescription = (value: string) => {
    setNewItem((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const handleChangeNewItemExplanation = (value: string) => {
    setNewItem((prev) => ({
      ...prev,
      explanation: value,
    }));
  };

  const handleChangeNewItemRecommendedActionDescription = (value: string) => {
    setNewItem((prev) => ({
      ...prev,
      recommendedActionDescription: value,
    }));
  };

  const handleChangeNewItemRecommendedActionExplanation = (value: string) => {
    setNewItem((prev) => ({
      ...prev,
      recommendedActionExplanation: value,
    }));
  };

  const handleAddTutorItem = async () => {
    if (!newItem.label || !newItem.description) return;
    if (!writingSubmissionId || !userId || !submissionId) return;

    await postCreateWritingCriterionFeedback.post({
      authorType: "TUTOR",
      criterionName: newItem.criterionName,
      feedbackType: newItem.feedbackType,
      label: newItem.label,
      description: newItem.description.trim(),
      explanation: newItem.explanation?.trim() || "",
      evidenceSentences:
        newItem.evidenceSentences?.filter((e: string) => e.trim() !== "") || [],
      recommendedActionDescription:
        newItem.recommendedActionDescription?.trim() || "",
      recommendedActionExplanation:
        newItem.recommendedActionExplanation?.trim() || "",
      userPracticeWritingAnswerId: writingSubmissionId,
      reviewedByUserId: userId,
    });

    await getWritingCriterionFeedbackBySubmissionId.get({
      submissionId,
    });

    setShowAddItemModal(false);
    resetNewItem();
  };

  // =========================
  // Reset new item
  // =========================

  const resetNewItem = (
    criterion: WritingCriterionType = selectedCriterion,
    feedbackType: WritingFeedbackType = addItemType,
  ) => {
    setNewItem(buildNewFeedbackItem(criterion, feedbackType));
  };

  const handleOpenAddItemModal = (feedbackType: WritingFeedbackType) => {
    setAddItemType(feedbackType);
    resetNewItem(selectedCriterion, feedbackType);
    setShowAddItemModal(true);
  };

  // =========================
  // Handle evidence sentences for tutor feedback item
  // =========================

  const handleAddEvidenceSentence = () => {
    setNewItem((prev) => ({
      ...prev,
      evidenceSentences: [...(prev.evidenceSentences || []), ""],
    }));
  };

  const handleUpdateEvidenceSentence = (index: number, value: string) => {
    setNewItem((prev) => ({
      ...prev,
      evidenceSentences: (prev.evidenceSentences || []).map((sentence, idx) =>
        idx === index ? value : sentence,
      ),
    }));
  };

  const handleRemoveEvidenceSentence = (index: number) => {
    setNewItem((prev) => ({
      ...prev,
      evidenceSentences: (prev.evidenceSentences || []).filter(
        (_, idx) => idx !== index,
      ),
    }));
  };

  // =========================
  // Handle edit tutor feedback item
  // =========================

  const handleEditTutorItem = (id: string) => {
    const itemToEdit = allFeedback.find((item) => item.id === id);

    if (!itemToEdit) return;

    setNewItem({
      authorType: itemToEdit.authorType,
      criterionName: itemToEdit.criterionName,
      feedbackType: itemToEdit.feedbackType,
      label: itemToEdit.label,
      description: itemToEdit.description,
      explanation: itemToEdit.explanation || "",
      evidenceSentences:
        itemToEdit.evidenceSentences.length > 0
          ? itemToEdit.evidenceSentences
          : [""],
      recommendedActionDescription:
        itemToEdit.recommendedActionDescription || "",
      recommendedActionExplanation:
        itemToEdit.recommendedActionExplanation || "",
      userPracticeWritingAnswerId: writingSubmissionId,
      reviewedByUserId: userId,
    });

    setAddItemType(itemToEdit.feedbackType);
    setEditingItemId(id);
    setShowEditItemModal(true);
  };

  // =========================
  // Handle update tutor feedback item
  // =========================

  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const handleUpdateTutorItem = async () => {
    if (
      !newItem.label ||
      !newItem.description ||
      !editingItemId ||
      !submissionId
    )
      return;

    await putWritingCriterionFeedbackById.put(
      {
        writingCriterionFeedbackId: editingItemId,
      },
      {
        label: newItem.label,
        description: newItem.description.trim(),
        explanation: newItem.explanation?.trim() || "",
        evidenceSentences:
          newItem.evidenceSentences?.filter((e: string) => e.trim() !== "") ||
          [],
        recommendedActionDescription:
          newItem.recommendedActionDescription?.trim() || "",
        recommendedActionExplanation:
          newItem.recommendedActionExplanation?.trim() || "",
      },
    );

    await getWritingCriterionFeedbackBySubmissionId.get({
      submissionId,
    });

    setShowEditItemModal(false);
    setEditingItemId(null);
    resetNewItem();
  };

  // =========================
  // Handle remove tutor feedback item
  // =========================

  const handleRemoveTutorItem = async (id: string) => {
    if (!id || !submissionId) return;

    await deleteWritingCriterionFeedbackById.remove({
      writingCriterionFeedbackId: id,
    });

    await getWritingCriterionFeedbackBySubmissionId.get({
      submissionId,
    });
  };

  // =========================
  // Handle item modal Add / Edit
  // =========================

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);

  const showItemModal = showAddItemModal || showEditItemModal;
  const isEditMode = showEditItemModal;

  const handleCloseItemModal = () => {
    if (isEditMode) {
      setShowEditItemModal(false);
    } else {
      setShowAddItemModal(false);
    }
    resetNewItem();
  };

  const handleSubmitItemModal = async () => {
    if (isEditMode) {
      await handleUpdateTutorItem();
    } else {
      await handleAddTutorItem();
    }
  };

  // =========================
  // Label options for tutor feedback dropdown
  // =========================

  const writingFeedbackLabelOptions: SelectOption<WritingFeedbackLabel>[] =
    getWritingFeedbackLabels(newItem.criterionName, newItem.feedbackType).map(
      (label) => ({
        value: label,
        label: formatFeedbackLabel(label),
      }),
    );

  // =========================
  // Render feedback cards
  // =========================

  const renderFeedbackCard = (
    item: WritingCriterionFeedbackBySubmissionItem,
    index: number,
  ) => {
    const isStrength = item.feedbackType === "STRENGTH";

    const canManageThisCard = canManageTutorReview;

    return (
      <div
        key={item.id}
        className="bg-white border-2 border-gray-200 rounded-[12px] p-[20px] hover:border-[#1977f3] transition-all"
      >
        <div className="flex items-start justify-between gap-[12px] mb-[12px]">
          <div className="flex items-center gap-[8px]">
            {isStrength ? (
              <CheckCircle className="w-[18px] h-[18px] text-[#10b981] flex-shrink-0" />
            ) : (
              <AlertCircle className="w-[18px] h-[18px] text-[#f59e0b] flex-shrink-0" />
            )}
            <h4 className="font-['Inter'] font-semibold text-[14px] text-gray-900">
              {item.label.replace(/_/g, " ")}
            </h4>
          </div>

          {canManageThisCard && (
            <div className="flex items-center gap-[8px]">
              <button
                onClick={() => handleEditTutorItem(item.id)}
                className="text-gray-400 hover:text-[#1977f3] transition-colors"
              >
                <Edit className="w-[16px] h-[16px]" />
              </button>
              <button
                onClick={() => handleRemoveTutorItem(item.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-[16px] h-[16px]" />
              </button>
            </div>
          )}
        </div>

        <div className="space-y-[12px]">
          <div>
            <p className="font-['Inter'] text-[14px] font-bold text-gray-900 mb-[4px]">
              Description:
            </p>
            <p className="font-['Inter'] text-[14px] text-gray-600 leading-relaxed">
              {item.description}
            </p>
          </div>

          <div>
            <p className="font-['Inter'] text-[14px] font-bold text-gray-900 mb-[4px]">
              Explanation:
            </p>
            <p className="font-['Inter'] text-[14px] text-gray-600 leading-relaxed">
              {item.explanation}
            </p>
          </div>

          {item.evidenceSentences.length > 0 && (
            <div>
              <p className="font-['Inter'] text-[14px] font-bold text-gray-900 mb-[6px]">
                Evidence:
              </p>
              <div className="space-y-[4px]">
                {item.evidenceSentences.map((quote, idx) => (
                  <div
                    key={idx}
                    className="bg-blue-50 border-l-4 border-[#1977f3] p-[10px] rounded-[4px]"
                  >
                    <p className="font-['Inter'] text-[14px] text-gray-700 italic">
                      "{quote}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(item.recommendedActionDescription ||
            item.recommendedActionExplanation) && (
            <div className="bg-[#fcbf65]/10 border border-[#fcbf65]/30 rounded-[8px] p-[12px]">
              <p className="font-['Inter'] text-[14px] font-bold text-gray-900 mb-[4px]">
                Recommended Next Action:
              </p>

              {item.recommendedActionDescription && (
                <p className="font-['Inter'] text-[14px] text-gray-700 mb-[6px]">
                  {item.recommendedActionDescription}
                </p>
              )}

              {item.recommendedActionExplanation && (
                <p className="font-['Inter'] text-[14px] text-gray-600">
                  {item.recommendedActionExplanation}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[12px] p-[32px] shadow-sm border border-gray-200 mb-[24px]">
      {/* Header */}
      <div className="mb-[28px]">
        <div className="flex items-center gap-[12px] mb-[16px]">
          <ClipboardList className="w-[24px] h-[24px] text-purple-600" />
          <h2 className="font-['Inter'] font-semibold text-[20px] text-gray-900">
            Detailed Feedback Analysis
          </h2>
        </div>
      </div>

      {/* Tutor Scores */}
      {isTutor && (
        <div className="mb-[24px]">
          <div className="flex items-center justify-between mb-[12px]">
            <h3 className="font-['Inter'] font-semibold text-[16px] text-[#1977f3] flex items-center gap-[8px]">
              <ClipboardList className="w-[18px] h-[18px]" />
              Tutor Scores
            </h3>

            {canManageTutorReview && (
              <Button
                onClick={handleSaveTutorScores}
                disabled={!isTutorScoresComplete}
                variant="outline"
                className="text-[#1977f3] border-[#1977f3] hover:bg-[#1977f3]/10"
              >
                <Save className="w-[16px] h-[16px] mr-[6px]" />
                Save Scores
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
            {tutorScores.map((scoreItem) => (
              <div
                key={scoreItem.criterion}
                className="bg-blue-50 border border-blue-200 rounded-[8px] p-[16px] flex flex-col items-center"
              >
                <label className="font-['Inter'] text-[14px] font-bold text-gray-700 mb-[8px] block text-center">
                  {getCriterionLabel(taskType, scoreItem.criterion)}
                </label>

                {canManageTutorReview ? (
                  <Input
                    type="text"
                    value={scoreItem.score}
                    onChange={(e) =>
                      handleScoreChange(scoreItem.criterion, e.target.value)
                    }
                    placeholder="e.g., 7.5"
                    className="font-['Inter'] text-[14px] text-center font-semibold"
                  />
                ) : (
                  <div className="w-full min-h-[40px] px-[12px] py-[8px] rounded-[8px] border border-gray-200 bg-gray-50 font-['Inter'] text-[14px] text-center font-semibold text-gray-700 flex items-center justify-center">
                    {scoreItem.score || "-"}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Criterion Filter */}
      <div className="mb-[20px]">
        <div className="grid grid-cols-4 gap-[12px]">
          {getAvailableCriteria(taskType).map((criterion) => (
            <button
              key={criterion}
              onClick={() => setSelectedCriterion(criterion)}
              className={`px-[16px] py-[12px] rounded-[8px] font-['Inter'] text-[14px] font-medium transition-all ${
                selectedCriterion === criterion
                  ? "bg-[#1977f3] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {getCriterionLabel(taskType, criterion)}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Content */}
      <div className="space-y-[24px]">
        {/* Strengths */}
        <div>
          <div className="flex items-center justify-between mb-[12px]">
            <h3 className="font-['Inter'] font-semibold text-[16px] text-[#10b981] flex items-center gap-[8px]">
              <CheckCircle className="w-[18px] h-[18px]" />
              Strengths ({strengthFeedback.length})
            </h3>

            {canManageTutorReview && (
              <Button
                onClick={() => handleOpenAddItemModal("STRENGTH")}
                variant="outline"
                className="text-[#10b981] border-[#10b981] hover:bg-[#10b981]/10"
              >
                <Plus className="w-[16px] h-[16px] mr-[6px]" />
                Add Strength
              </Button>
            )}
          </div>

          {strengthFeedback.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-[12px] p-[40px] text-center">
              <p className="font-['Inter'] text-[14px] text-gray-500">
                No strengths available.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
              {strengthFeedback.map((item, idx) =>
                renderFeedbackCard(item, idx),
              )}
            </div>
          )}
        </div>

        {/* Weaknesses */}
        <div>
          <div className="flex items-center justify-between mb-[12px]">
            <h3 className="font-['Inter'] font-semibold text-[16px] text-[#f59e0b] flex items-center gap-[8px]">
              <AlertCircle className="w-[18px] h-[18px]" />
              Weaknesses ({weaknessFeedback.length})
            </h3>

            {canManageTutorReview && (
              <Button
                onClick={() => handleOpenAddItemModal("WEAKNESS")}
                variant="outline"
                className="text-[#f59e0b] border-[#f59e0b] hover:bg-[#f59e0b]/10"
              >
                <Plus className="w-[16px] h-[16px] mr-[6px]" />
                Add Weakness
              </Button>
            )}
          </div>

          {weaknessFeedback.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-[12px] p-[40px] text-center">
              <p className="font-['Inter'] text-[14px] text-gray-500">
                No weaknesses available.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
              {weaknessFeedback.map((item, idx) =>
                renderFeedbackCard(item, idx),
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[20px]">
          <div className="bg-white rounded-[16px] max-w-[700px] w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-[24px] flex items-center justify-between">
              <h3 className="font-['Inter'] font-semibold text-[20px] text-gray-900">
                {isEditMode ? "Edit" : "Add"}{" "}
                {addItemType === "STRENGTH" ? "Strength" : "Weakness"}
              </h3>
              <button
                onClick={handleCloseItemModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-[24px] h-[24px]" />
              </button>
            </div>

            <div className="p-[24px] space-y-[20px]">
              {/* Label */}
              <div>
                <label className="font-['Inter'] text-[14px] font-medium text-gray-700 mb-[8px] block">
                  Label
                </label>
                <SelectV2<WritingFeedbackLabel>
                  value={newItem.label}
                  onChange={handleChangeNewItemLabel}
                  options={writingFeedbackLabelOptions}
                  placeholder="Select label"
                  className="w-full"
                  triggerClassName="h-[40px] rounded-[10px] border border-[#CBD5E1] bg-white px-3 text-[14px] font-medium text-[#475569] shadow-sm hover:border-[#94A3B8] focus-visible:ring-2 focus-visible:ring-[#1977f3]/20 font-['Inter']"
                  iconClassName="h-4 w-4 text-[#64748B] opacity-100"
                  dropdownClassName="max-h-[260px]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="font-['Inter'] text-[14px] font-medium text-gray-700 mb-[8px] block">
                  Description
                </label>
                <Textarea
                  value={newItem.description || ""}
                  onChange={(e) =>
                    handleChangeNewItemDescription(e.target.value)
                  }
                  placeholder="Brief description of the feedback point"
                  className="font-['Inter'] min-h-[80px]"
                />
              </div>

              {/* Explanation */}
              <div>
                <label className="font-['Inter'] text-[14px] font-medium text-gray-700 mb-[8px] block">
                  Explanation
                </label>
                <Textarea
                  value={newItem.explanation || ""}
                  onChange={(e) =>
                    handleChangeNewItemExplanation(e.target.value)
                  }
                  placeholder="Detailed explanation"
                  className="font-['Inter'] min-h-[100px]"
                />
              </div>

              {/* Evidence */}
              <div>
                <div className="flex items-center justify-between mb-[8px]">
                  <label className="font-['Inter'] text-[14px] font-medium text-gray-700">
                    Evidence (optional)
                  </label>
                  <Button
                    onClick={handleAddEvidenceSentence}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-[14px] h-[14px] mr-[4px]" />
                    Add Sentence
                  </Button>
                </div>
                <div className="space-y-[8px]">
                  {(newItem.evidenceSentences || []).map((quote, idx) => (
                    <div key={idx} className="flex gap-[8px]">
                      <Input
                        value={quote}
                        onChange={(e) =>
                          handleUpdateEvidenceSentence(idx, e.target.value)
                        }
                        placeholder="Sentence from the essay"
                        className="font-['Inter'] flex-1"
                      />
                      {(newItem.evidenceSentences?.length || 0) > 1 && (
                        <Button
                          onClick={() => handleRemoveEvidenceSentence(idx)}
                          variant="outline"
                          size="sm"
                          className="flex-shrink-0"
                        >
                          <X className="w-[14px] h-[14px]" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Next Action */}
              <div className="bg-[#fcbf65]/10 border border-[#fcbf65]/30 rounded-[8px] p-[16px]">
                <h4 className="font-['Inter'] text-[14px] font-semibold text-gray-900 mb-[12px]">
                  Recommended Next Action (optional)
                </h4>
                <div className="space-y-[12px]">
                  <div>
                    <label className="font-['Inter'] text-[13px] font-medium text-gray-700 mb-[6px] block">
                      Action Description
                    </label>
                    <Input
                      value={newItem.recommendedActionDescription || ""}
                      onChange={(e) =>
                        handleChangeNewItemRecommendedActionDescription(
                          e.target.value,
                        )
                      }
                      placeholder="What should the student do next?"
                      className="font-['Inter']"
                    />
                  </div>
                  <div>
                    <label className="font-['Inter'] text-[13px] font-medium text-gray-700 mb-[6px] block">
                      Action Explanation
                    </label>
                    <Textarea
                      value={newItem.recommendedActionExplanation || ""}
                      onChange={(e) =>
                        handleChangeNewItemRecommendedActionExplanation(
                          e.target.value,
                        )
                      }
                      placeholder="Why is this action important?"
                      className="font-['Inter'] min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-[24px] flex items-center justify-end gap-[12px]">
              <Button onClick={handleCloseItemModal} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={handleSubmitItemModal}
                className="bg-[#1977f3] hover:bg-[#1977f3]/90"
                disabled={!newItem.label || !newItem.description}
              >
                {isEditMode ? "Update" : "Add"}{" "}
                {addItemType === "STRENGTH" ? "Strength" : "Weakness"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
