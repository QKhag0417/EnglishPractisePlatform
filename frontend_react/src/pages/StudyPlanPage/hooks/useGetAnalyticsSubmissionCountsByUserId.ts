import { API_BASE } from "../../../env";
import { useApiGetByParams } from "../../../utils/api";
import {
  AnalyticsSubmissionCounts,
  AnalyticsSubmissionCountsDTO,
  AnalyticsSubmissionCountsParams,
} from "../types";

function mapAnalyticsSubmissionCountsDTOToAnalyticsSubmissionCounts(
  dto: AnalyticsSubmissionCountsDTO,
): AnalyticsSubmissionCounts {
  return {
    listeningCount: dto.listeningCount ?? 0,
    readingCount: dto.readingCount ?? 0,
    writingCount: dto.writingCount ?? 0,
    speakingCount: dto.speakingCount ?? 0,
  };
}

const initialParams: AnalyticsSubmissionCountsParams = {
  userId: "",
};

const initialAnalyticsSubmissionCounts: AnalyticsSubmissionCounts = {
  listeningCount: 0,
  readingCount: 0,
  writingCount: 0,
  speakingCount: 0,
};

export function useGetAnalyticsSubmissionCountsByUserId(
  params?: AnalyticsSubmissionCountsParams,
) {
  const defaultParams = params ?? initialParams;

  const {
    item: analyticsSubmissionCounts,
    setItem: setAnalyticsSubmissionCounts,
    loading,
    error,
    get,
  } = useApiGetByParams<
    AnalyticsSubmissionCountsDTO,
    AnalyticsSubmissionCounts,
    AnalyticsSubmissionCountsParams
  >({
    buildRequest: (requestParams) => {
      const resolvedParams = requestParams ?? defaultParams;
      const userId = resolvedParams.userId ?? "";

      return {
        apiBase: API_BASE,
        path: `/api/submission-analytics/user/${userId}/analytics-submission-counts`,
      };
    },
    initialItem: initialAnalyticsSubmissionCounts,
    mapItem: mapAnalyticsSubmissionCountsDTOToAnalyticsSubmissionCounts,
  });

  return {
    analyticsSubmissionCounts,
    setAnalyticsSubmissionCounts,
    loading,
    error,
    get,
  };
}
