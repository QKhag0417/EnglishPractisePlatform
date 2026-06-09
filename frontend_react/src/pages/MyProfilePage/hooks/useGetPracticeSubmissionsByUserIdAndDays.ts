import { API_BASE } from "../../../env";
import { useApiGetByParams } from "../../../utils/api";
import {
  PracticeSubmissionSummary,
  PracticeSubmissionSummaryDTO,
  PracticeSubmissionSummaryParams,
  PRACTICE_SUBMISSION_SUMMARY_INCLUDE_FIELDS_QUERY,
} from "../types";

function mapPracticeSubmissionSummaryDTOToPracticeSubmissionSummary(
  dto: PracticeSubmissionSummaryDTO,
): PracticeSubmissionSummary {
  return {
    id: dto.id ?? "",
    timeSpentSeconds: dto.timeSpentSeconds ?? 0,
    submittedAt: dto.submittedAt ?? [0, 0, 0, 0, 0, 0, 0],
    correctAnswerPercentage: dto.correctAnswerPercentage ?? 0,
    correctAnswerCount: dto.correctAnswerCount ?? 0,
    wrongAnswerCount: dto.wrongAnswerCount ?? 0,
    skipAnswerCount: dto.skipAnswerCount ?? 0,
    practiceContent: {
      skill: dto.practiceContent?.skill ?? "",
      title: dto.practiceContent?.title ?? "",
    },
    questionTypeAccuracies: (dto.questionTypeAccuracies ?? []).map(
      (questionTypeAccuracy) => ({
        questionType: questionTypeAccuracy?.questionType ?? "",
        correctAnswerPercentage:
          questionTypeAccuracy?.correctAnswerPercentage ?? 0,
      }),
    ),
  };
}

function mapPracticeSubmissionSummaryDTOsToPracticeSubmissionSummaries(
  dtos: PracticeSubmissionSummaryDTO[],
): PracticeSubmissionSummary[] {
  return dtos.map(mapPracticeSubmissionSummaryDTOToPracticeSubmissionSummary);
}

const initialParams: PracticeSubmissionSummaryParams = {
  userId: "",
  days: 1,
};

const initialPracticeSubmissions: PracticeSubmissionSummary[] = [];

export function useGetPracticeSubmissionsByUserIdAndDays(
  params?: PracticeSubmissionSummaryParams,
) {
  const defaultParams = params ?? initialParams;

  const {
    item: practiceSubmissions,
    setItem: setPracticeSubmissions,
    loading,
    error,
    get,
  } = useApiGetByParams<
    PracticeSubmissionSummaryDTO[],
    PracticeSubmissionSummary[],
    PracticeSubmissionSummaryParams
  >({
    buildRequest: (requestParams) => {
      const resolvedParams = requestParams ?? defaultParams;
      const userId = resolvedParams.userId ?? "";
      const days = resolvedParams.days ?? 1;

      return {
        apiBase: API_BASE,
        path: `/api/practice-submission/user/${userId}/latest/${days}`,
        include: PRACTICE_SUBMISSION_SUMMARY_INCLUDE_FIELDS_QUERY,
      };
    },
    initialItem: initialPracticeSubmissions,
    mapItem: mapPracticeSubmissionSummaryDTOsToPracticeSubmissionSummaries,
  });

  return {
    practiceSubmissions,
    setPracticeSubmissions,
    loading,
    error,
    get,
  };
}
