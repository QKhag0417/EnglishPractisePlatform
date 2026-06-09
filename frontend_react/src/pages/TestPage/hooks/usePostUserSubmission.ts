// usePostUserSubmission.ts
import { API_BASE } from "../../../env";
import { useApiPost } from "../../../utils/api/useApiPost";
import type {
  PracticeSubmissionDTO,
  PracticeSubmission,
  PracticeSubmissionPostBody,
} from "../types";

const initialBody: PracticeSubmissionPostBody = {
  userId: "",
  practiceContentId: "",
  timeSpentSeconds: 0,
  learnerTestActivities: [],
};

const initialSubmission: PracticeSubmission = {
  practiceSubmissionId: "",
};

function mapPracticeSubmissionDTOToPracticeSubmission(
  dto: PracticeSubmissionDTO,
): PracticeSubmission {
  return {
    practiceSubmissionId: dto.id ?? "",
  };
}

export function usePostUserSubmission(params?: PracticeSubmissionPostBody) {
  const defaultBody = params ?? initialBody;

  const {
    item: submission,
    setItem: setSubmission,
    loading,
    error,
    post,
  } = useApiPost<
    PracticeSubmissionDTO,
    PracticeSubmission,
    PracticeSubmissionPostBody
  >({
    request: {
      apiBase: API_BASE,
      path: "/api/practice-submission",
      body: defaultBody,
    },
    initialItem: initialSubmission,
    mapItem: mapPracticeSubmissionDTOToPracticeSubmission,
  });

  return {
    submission,
    setSubmission,
    loading,
    error,
    post,
  };
}
