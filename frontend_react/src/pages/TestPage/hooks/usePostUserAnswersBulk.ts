// usePostUserAnswersBulk.ts
import { API_BASE } from "../../../env";
import { useApiPost } from "../../../utils/api/useApiPost";
import type {
  BulkSubmissionAnswerPostBody,
  BulkSubmissionAnswerResponseDTO,
  BulkSubmissionAnswerResponse,
} from "../types";

const initialBody: BulkSubmissionAnswerPostBody = {
  userPracticeSubmissionId: "",
  answers: [],
};

const initialBulkSubmissionAnswerResponse: BulkSubmissionAnswerResponse = {
  ids: [],
};

function mapBulkSubmissionAnswerResponseDTOToBulkSubmissionAnswerResponse(
  dto: BulkSubmissionAnswerResponseDTO,
): BulkSubmissionAnswerResponse {
  return {
    ids: (dto ?? []).map((row) => row?.id ?? "").filter((id) => id.length > 0),
  };
}

export function usePostUserAnswersBulk(params?: BulkSubmissionAnswerPostBody) {
  const defaultBody = params ?? initialBody;

  const {
    item: bulkSubmissionAnswerResponse,
    setItem: setBulkSubmissionAnswerResponse,
    loading,
    error,
    post,
  } = useApiPost<
    BulkSubmissionAnswerResponseDTO,
    BulkSubmissionAnswerResponse,
    BulkSubmissionAnswerPostBody
  >({
    request: {
      apiBase: API_BASE,
      path: "/api/practice-submission-answer/bulk",
      body: defaultBody,
    },
    initialItem: initialBulkSubmissionAnswerResponse,
    mapItem: mapBulkSubmissionAnswerResponseDTOToBulkSubmissionAnswerResponse,
  });

  return {
    bulkSubmissionAnswerResponse,
    setBulkSubmissionAnswerResponse,
    loading,
    error,
    post,
  };
}
