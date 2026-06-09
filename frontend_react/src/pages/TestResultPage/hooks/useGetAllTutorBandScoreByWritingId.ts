import { API_BASE } from "../../../env";
import { useApiGetByParams } from "../../../utils/api";
import {
  WritingReviewBandScore,
  WritingReviewBandScoreDTO,
  WritingReviewBandScoreParams,
  WRITING_REVIEW_BAND_SCORE_DTO_INCLUDE_FIELDS_QUERY,
} from "../types";

function mapWritingReviewBandScoreDTOToWritingReviewBandScore(
  dto: WritingReviewBandScoreDTO,
): WritingReviewBandScore {
  return {
    id: dto.id ?? "",
    overallTutorBand: dto.overallTutorBand ?? 0,
    tutorTaskResponseBand: dto.tutorTaskResponseBand ?? 0,
    tutorTaskAchievementBand: dto.tutorTaskAchievementBand ?? 0,
    tutorCoherenceAndCohesionBand: dto.tutorCoherenceAndCohesionBand ?? 0,
    tutorLexicalResourceBand: dto.tutorLexicalResourceBand ?? 0,
    tutorGrammaticalRangeAndAccuracyBand:
      dto.tutorGrammaticalRangeAndAccuracyBand ?? 0,
    reviewedByUser: {
      userId: dto.reviewedByUser?.userId ?? "",
      email: dto.reviewedByUser?.email ?? "",
      firstname: dto.reviewedByUser?.firstname ?? "",
      lastname: dto.reviewedByUser?.lastname ?? "",
    },
  };
}

function mapWritingReviewBandScoreDTOsToWritingReviewBandScores(
  dtos: WritingReviewBandScoreDTO[],
): WritingReviewBandScore[] {
  return Array.isArray(dtos)
    ? dtos.map(mapWritingReviewBandScoreDTOToWritingReviewBandScore)
    : [];
}

const initialParams: WritingReviewBandScoreParams = {
  writingAnswerId: "",
};

const initialWritingReviewBandScores: WritingReviewBandScore[] = [];

export function useGetAllTutorBandScoreByWritingId(
  params?: WritingReviewBandScoreParams,
) {
  const defaultParams = params ?? initialParams;

  const {
    item: writingReviewBandScores,
    setItem: setWritingReviewBandScores,
    loading,
    error,
    get,
  } = useApiGetByParams<
    WritingReviewBandScoreDTO[],
    WritingReviewBandScore[],
    WritingReviewBandScoreParams
  >({
    buildRequest: (requestParams) => {
      const resolvedParams = requestParams ?? defaultParams;
      const writingAnswerId = resolvedParams.writingAnswerId ?? "";

      return {
        apiBase: API_BASE,
        path: `/api/practice-writing-review/writing-answer/${writingAnswerId}`,
        include: WRITING_REVIEW_BAND_SCORE_DTO_INCLUDE_FIELDS_QUERY,
      };
    },
    initialItem: initialWritingReviewBandScores,
    mapItem: mapWritingReviewBandScoreDTOsToWritingReviewBandScores,
  });

  return {
    writingReviewBandScores,
    setWritingReviewBandScores,
    loading,
    error,
    get,
  };
}
