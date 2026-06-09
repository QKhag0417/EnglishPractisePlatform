import { API_BASE } from "../../../env";
import { useApiPutByParams } from "../../../utils/api";
import {
  UpsertTutorBandScoreBody,
  UpsertTutorBandScoreParams,
  UpsertTutorBandScoreResponseDTO,
  UpsertTutorBandScoreResponse,
} from "../types";

const initialParams: UpsertTutorBandScoreParams = {
  reviewedByUserId: "",
  writingAnswerId: "",
};

const initialBody: UpsertTutorBandScoreBody = {
  tutorTaskAchievementBand: 0,
  tutorTaskResponseBand: 0,
  tutorCoherenceAndCohesionBand: 0,
  tutorLexicalResourceBand: 0,
  tutorGrammaticalRangeAndAccuracyBand: 0,
};

const initialWritingReview: UpsertTutorBandScoreResponse = {
  id: "",
};

function mapUpsertTutorBandScoreDTOToWritingReview(
  dto: UpsertTutorBandScoreResponseDTO,
): UpsertTutorBandScoreResponse {
  return {
    id: dto.id ?? "",
  };
}

export function usePutUpsertTutorBandScore(
  params?: UpsertTutorBandScoreParams,
  body?: UpsertTutorBandScoreBody,
) {
  const defaultParams = params ?? initialParams;
  const defaultBody = body ?? initialBody;

  const {
    item: writingReview,
    setItem: setWritingReview,
    loading,
    error,
    put,
  } = useApiPutByParams<
    UpsertTutorBandScoreResponseDTO,
    UpsertTutorBandScoreResponse,
    UpsertTutorBandScoreParams,
    UpsertTutorBandScoreBody
  >({
    buildRequest: (requestParams) => {
      const resolvedParams = requestParams ?? defaultParams;

      return {
        apiBase: API_BASE,
        path: `/api/practice-writing-review/reviewed-by-user/${resolvedParams.reviewedByUserId}/writing-answer/${resolvedParams.writingAnswerId}`,
        body: defaultBody,
      };
    },
    initialItem: initialWritingReview,
    mapItem: mapUpsertTutorBandScoreDTOToWritingReview,
  });

  return {
    writingReview,
    setWritingReview,
    loading,
    error,
    put,
  };
}
