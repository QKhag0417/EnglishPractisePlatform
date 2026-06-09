import { API_BASE } from "../../../env";
import { useApiGetByParams } from "../../../utils/api";
import {
  TutorUserPracticeSubmission,
  TutorUserPracticeSubmissionDTO,
  GetAllTutorUserPracticeSubmissionsByTutorIdParams,
  TUTOR_USER_PRACTICE_SUBMISSION_DTO_INCLUDE_FIELDS_QUERY,
} from "../types";

function mapTutorUserPracticeSubmissionDTOToTutorUserPracticeSubmission(
  dto: TutorUserPracticeSubmissionDTO,
): TutorUserPracticeSubmission {
  return {
    id: dto.id ?? "",
    userPracticeSubmissionId: dto.userPracticeSubmissionId ?? "",
    tutorStatus: dto.tutorStatus ?? "PENDING",
  };
}

function mapTutorUserPracticeSubmissionDTOsToTutorUserPracticeSubmissions(
  dtos: TutorUserPracticeSubmissionDTO[],
): TutorUserPracticeSubmission[] {
  return dtos.map(
    mapTutorUserPracticeSubmissionDTOToTutorUserPracticeSubmission,
  );
}

const initialParams: GetAllTutorUserPracticeSubmissionsByTutorIdParams = {
  tutorId: "",
};

const initialTutorUserPracticeSubmissions: TutorUserPracticeSubmission[] = [];

export function useGetAllTutorUserPracticeSubmissionsByTutorId(
  params?: GetAllTutorUserPracticeSubmissionsByTutorIdParams,
) {
  const defaultParams = params ?? initialParams;

  const {
    item: tutorUserPracticeSubmissions,
    setItem: setTutorUserPracticeSubmissions,
    loading,
    error,
    get,
  } = useApiGetByParams<
    TutorUserPracticeSubmissionDTO[],
    TutorUserPracticeSubmission[],
    GetAllTutorUserPracticeSubmissionsByTutorIdParams
  >({
    buildRequest: (requestParams) => {
      const resolvedParams = requestParams ?? defaultParams;
      const tutorId = resolvedParams.tutorId ?? "";

      return {
        apiBase: API_BASE,
        path: `/api/tutor-user-practice-submissions/tutor/${tutorId}`,
        include: TUTOR_USER_PRACTICE_SUBMISSION_DTO_INCLUDE_FIELDS_QUERY,
      };
    },
    initialItem: initialTutorUserPracticeSubmissions,
    mapItem: mapTutorUserPracticeSubmissionDTOsToTutorUserPracticeSubmissions,
  });

  return {
    tutorUserPracticeSubmissions,
    setTutorUserPracticeSubmissions,
    loading,
    error,
    get,
  };
}
