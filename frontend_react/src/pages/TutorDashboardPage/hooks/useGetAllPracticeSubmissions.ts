import { API_BASE } from "../../../env";
import { useApiGetByParams } from "../../../utils/api";
import {
  formatLocalDateTime,
  formatTimeVerbose,
  mapSkill,
  mapTask,
  buildFullName,
} from "../utils";
import {
  PracticeSubmission,
  PracticeSubmissionDTO,
  PracticeSubmissionParams,
  PRACTICE_SUBMISSION_DTO_INCLUDE_FIELDS_QUERY,
} from "../types";

function mapPracticeSubmissionDTOToPracticeSubmission(
  dto: PracticeSubmissionDTO,
): PracticeSubmission {
  return {
    id: dto.id ?? "",
    studentName: buildFullName(
      dto.user?.firstname ?? "",
      dto.user?.lastname ?? "",
    ),
    studentEmail: dto.user?.email ?? "",
    skill: mapSkill(dto.practiceContent?.skill),
    task: mapTask(dto.practiceContent?.task),
    title: dto.practiceContent?.title ?? "",
    submittedAt: formatLocalDateTime(dto.submittedAt),
    timeTaken: formatTimeVerbose(dto.timeSpentSeconds ?? 0),
    tutorStatus: dto.tutorStatus ?? "PENDING",
  };
}

const initialParams: PracticeSubmissionParams = {};

const initialPracticeSubmissions: PracticeSubmission[] = [];

export function useGetAllPracticeSubmissions(
  params?: PracticeSubmissionParams,
) {
  const defaultParams = params ?? initialParams;

  const {
    item: practiceSubmissions,
    setItem: setPracticeSubmissions,
    loading,
    error,
    get,
  } = useApiGetByParams<
    PracticeSubmissionDTO[],
    PracticeSubmission[],
    PracticeSubmissionParams
  >({
    buildRequest: (_requestParams) => {
      void defaultParams;

      return {
        apiBase: API_BASE,
        path: "/api/practice-submission/tutor-review-requested",
        include: PRACTICE_SUBMISSION_DTO_INCLUDE_FIELDS_QUERY,
      };
    },
    initialItem: initialPracticeSubmissions,
    mapItem: (dtos) =>
      (dtos ?? []).map(mapPracticeSubmissionDTOToPracticeSubmission),
  });

  return {
    practiceSubmissions,
    setPracticeSubmissions,
    loading,
    error,
    get,
  };
}
