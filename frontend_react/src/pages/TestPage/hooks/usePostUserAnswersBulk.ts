// usePostUserAnswersBulk.ts
import { API_BASE } from "../../../env";
import { useApiPost } from "../../../utils/api/useApiPost";
import type {
  BulkSubmissionAnswerPostBody,
  BulkSubmissionAnswerResponseDTO,
  BulkSubmissionAnswerResponse,
  UserAnswers,
  BulkSubmissionAnswerRowPostBody,
} from "../types";

const initialBody: BulkSubmissionAnswerPostBody = {
  userPracticeSubmissionId: "",
  answers: [],
};

const initialResponse: BulkSubmissionAnswerResponse = {
  ids: [],
};

function mapBulkSubmissionAnswerResponseDTO(
  dto: BulkSubmissionAnswerResponseDTO,
): BulkSubmissionAnswerResponse {
  return {
    ids: (dto ?? []).map((row) => row?.id ?? "").filter((id) => id.length > 0),
  };
}

export function mapBulkParamsToBody(params: {
  userPracticeSubmissionId: string;
  answers: UserAnswers;
}): BulkSubmissionAnswerPostBody {
  const rows: BulkSubmissionAnswerRowPostBody[] = Object.entries(params.answers)
    .map(([orderIndex, answers]) => ({
      orderIndex: Number(orderIndex),
      answers: answers ?? [],
    }))
    .filter((row) => Number.isFinite(row.orderIndex) && row.answers.length > 0)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  return {
    userPracticeSubmissionId: params.userPracticeSubmissionId,
    answers: rows,
  };
}

export function usePostUserAnswersBulk(params?: {
  userPracticeSubmissionId: string;
  answers: UserAnswers;
}) {
  const body: BulkSubmissionAnswerPostBody = params
    ? mapBulkParamsToBody(params)
    : initialBody;

  const {
    item: bulkResult,
    setItem: setBulkResult,
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
      body,
    },
    initialItem: initialResponse,
    mapItem: mapBulkSubmissionAnswerResponseDTO,
  });

  return {
    bulkResult,
    setBulkResult,
    loading,
    error,
    post,
  };
}
