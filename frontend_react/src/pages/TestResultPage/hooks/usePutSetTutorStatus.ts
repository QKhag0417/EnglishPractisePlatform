import { API_BASE } from "../../../env";
import { useApiPutByParams } from "../../../utils/api";
import {
  SetTutorStatusBody,
  SetTutorStatusParams,
  SetTutorStatusResponseDTO,
  SetTutorStatusResponse,
} from "../types";

const initialParams: SetTutorStatusParams = {
  tutorId: "",
  submissionId: "",
};

const initialBody: SetTutorStatusBody = {
  tutorStatus: "PENDING",
};

const initialTutorUserPracticeSubmission: SetTutorStatusResponse = {
  id: "",
};

function mapSetTutorStatusDTOToTutorUserPracticeSubmission(
  dto: SetTutorStatusResponseDTO,
): SetTutorStatusResponse {
  return {
    id: dto.id ?? "",
  };
}

export function usePutSetTutorStatus(
  params?: SetTutorStatusParams,
  body?: SetTutorStatusBody,
) {
  const defaultParams = params ?? initialParams;
  const defaultBody = body ?? initialBody;

  const {
    item: tutorUserPracticeSubmission,
    setItem: setTutorUserPracticeSubmission,
    loading,
    error,
    put,
  } = useApiPutByParams<
    SetTutorStatusResponseDTO,
    SetTutorStatusResponse,
    SetTutorStatusParams,
    SetTutorStatusBody
  >({
    buildRequest: (requestParams) => {
      const resolvedParams = requestParams ?? defaultParams;

      return {
        apiBase: API_BASE,
        path: `/api/tutor-user-practice-submissions/tutor/${resolvedParams.tutorId}/submission/${resolvedParams.submissionId}/status`,
        body: defaultBody,
      };
    },
    initialItem: initialTutorUserPracticeSubmission,
    mapItem: mapSetTutorStatusDTOToTutorUserPracticeSubmission,
  });

  return {
    tutorUserPracticeSubmission,
    setTutorUserPracticeSubmission,
    loading,
    error,
    put,
  };
}
