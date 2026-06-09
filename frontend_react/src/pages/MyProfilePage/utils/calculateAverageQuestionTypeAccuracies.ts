import {
  BackendListeningQuestionType,
  mapListeningApiTypeToUi,
} from "../../ListeningContentEditorPage/types";
import {
  BackendReadingQuestionType,
  mapReadingApiTypeToUi,
} from "../../ReadingContentEditorPage/types";
import {
  PracticeSubmissionSummary,
  skillTypes,
  UIQuestionType,
} from "../types";

export function calculateAverageQuestionTypeAccuracies(
  submissions: PracticeSubmissionSummary[],
  skill: skillTypes,
) {
  const grouped = new Map<UIQuestionType, { total: number; count: number }>();

  submissions
    .filter((submission) => submission.practiceContent.skill === skill)
    .forEach((submission) => {
      submission.questionTypeAccuracies.forEach((item) => {
        let uiType: UIQuestionType;

        if (skill === "LISTENING") {
          uiType = mapListeningApiTypeToUi(
            item.questionType as BackendListeningQuestionType,
          );
        } else if (skill === "READING") {
          uiType = mapReadingApiTypeToUi(
            item.questionType as BackendReadingQuestionType,
          );
        } else {
          return;
        }

        const current = grouped.get(uiType) ?? { total: 0, count: 0 };

        grouped.set(uiType, {
          total: current.total + item.correctAnswerPercentage,
          count: current.count + 1,
        });
      });
    });

  return Array.from(grouped.entries())
    .map(([type, value]) => ({
      type,
      accuracy: Math.round(value.total / value.count),
    }))
    .sort((a, b) => b.accuracy - a.accuracy);
}
