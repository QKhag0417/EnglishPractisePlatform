import { API_BASE } from "../../../env";
import { useApiGetByParams } from "../../../utils/api";
import {
  TutorUserPracticeSubmission,
  TutorUserPracticeSubmissionDTO,
  GetTutorUserPracticeSubmissionByTutorIdAndSubmissionIdParams,
  TUTOR_USER_PRACTICE_SUBMISSION_DTO_INCLUDE_FIELDS_QUERY,
} from "../types";

function mapTutorUserPracticeSubmissionDTOToTutorUserPracticeSubmission(
  dto: TutorUserPracticeSubmissionDTO,
): TutorUserPracticeSubmission {
  return {
    id: dto.id ?? "",
    tutorStatus: dto.tutorStatus ?? "PENDING",
  };
}

const initialParams: GetTutorUserPracticeSubmissionByTutorIdAndSubmissionIdParams =
  {
    tutorId: "",
    submissionId: "",
  };

const initialTutorUserPracticeSubmission: TutorUserPracticeSubmission = {
  id: "",
  tutorStatus: "PENDING",
};

export function useGetTutorUserPracticeSubmissionByTutorIdAndSubmissionId(
  params?: GetTutorUserPracticeSubmissionByTutorIdAndSubmissionIdParams,
) {
  const defaultParams = params ?? initialParams;

  const {
    item: tutorUserPracticeSubmission,
    setItem: setTutorUserPracticeSubmission,
    loading,
    error,
    get,
  } = useApiGetByParams<
    TutorUserPracticeSubmissionDTO,
    TutorUserPracticeSubmission,
    GetTutorUserPracticeSubmissionByTutorIdAndSubmissionIdParams
  >({
    buildRequest: (requestParams) => {
      const resolvedParams = requestParams ?? defaultParams;
      const tutorId = resolvedParams.tutorId ?? "";
      const submissionId = resolvedParams.submissionId ?? "";

      return {
        apiBase: API_BASE,
        path: `/api/tutor-user-practice-submissions/tutor/${tutorId}/submission/${submissionId}`,
        include: TUTOR_USER_PRACTICE_SUBMISSION_DTO_INCLUDE_FIELDS_QUERY,
      };
    },
    initialItem: initialTutorUserPracticeSubmission,
    mapItem: mapTutorUserPracticeSubmissionDTOToTutorUserPracticeSubmission,
  });

  return {
    tutorUserPracticeSubmission,
    setTutorUserPracticeSubmission,
    loading,
    error,
    get,
  };
}
