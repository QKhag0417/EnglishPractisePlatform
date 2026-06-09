import { API_BASE } from "../../../env";
import { useApiGetByParams } from "../../../utils/api";
import { formatDuration, formatSubmittedAt } from "../utils";
import {
  GetAllPracticeSubmissionsByUserIdParams,
  PracticeSubmissionByUserId,
  PracticeSubmissionByUserIdDTO,
  PRACTICE_SUBMISSION_BY_USER_ID_DTO_INCLUDE_FIELDS_QUERY,
} from "../types";

function mapPracticeSubmissionByUserIdDTOToPracticeSubmissionByUserId(
  dto: PracticeSubmissionByUserIdDTO,
): PracticeSubmissionByUserId {
  return {
    id: dto.id ?? "",
    title: dto.practiceContent?.title ?? "",
    submittedAt: formatSubmittedAt(dto.submittedAt ?? [0, 0, 0, 0, 0, 0, 0]),
    score: dto.score ?? 0,
    correctAnswerPercentage: dto.correctAnswerPercentage ?? 0,
    timeTaken: formatDuration(dto.timeSpentSeconds ?? 0),
    skill: dto.practiceContent?.skill ?? "",
  };
}

const initialParams: GetAllPracticeSubmissionsByUserIdParams = {
  userId: "",
};

const initialPracticeSubmissionsByUserId: PracticeSubmissionByUserId[] = [];

export function useGetAllPracticeSubmissionsByUserId(
  params?: GetAllPracticeSubmissionsByUserIdParams,
) {
  const defaultParams = params ?? initialParams;

  const {
    item: practiceSubmissions,
    setItem: setPracticeSubmissions,
    loading,
    error,
    get,
  } = useApiGetByParams<
    PracticeSubmissionByUserIdDTO[],
    PracticeSubmissionByUserId[],
    GetAllPracticeSubmissionsByUserIdParams
  >({
    buildRequest: (requestParams) => {
      const resolvedParams = requestParams ?? defaultParams;

      return {
        apiBase: API_BASE,
        path: `/api/practice-submission/user/${resolvedParams.userId}`,
        include: PRACTICE_SUBMISSION_BY_USER_ID_DTO_INCLUDE_FIELDS_QUERY,
      };
    },
    initialItem: initialPracticeSubmissionsByUserId,
    mapItem: (dtos) =>
      (dtos ?? []).map(
        mapPracticeSubmissionByUserIdDTOToPracticeSubmissionByUserId,
      ),
  });

  return {
    practiceSubmissions,
    setPracticeSubmissions,
    loading,
    error,
    get,
  };
}
