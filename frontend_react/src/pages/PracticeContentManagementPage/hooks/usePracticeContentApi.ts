import { API_BASE } from "../../../env";

import { apiGet } from "../../../utils/api/apiGet";
import { apiDelete } from "../../../utils/api/apiDelete";
import { ApiResult } from "../../../utils/api/apiResult";

export interface PracticeContentMetadata {
  id: number;
  title: string;
  type: string;
  level: string;
  createdAt: string;
}

export function usePracticeContentApi() {
  const fetchMetadata = async (
    signal?: AbortSignal,
  ): Promise<ApiResult<PracticeContentMetadata[]>> => {
    return apiGet<PracticeContentMetadata[]>({
      apiBase: API_BASE,
      path: "/api/practice-content?include=id,title,skill,updatedOn,questionCount,durationMinutes,status,attemptCount",
      signal,
    });
  };

  const deletePracticeContent = async (
    id: string,
    signal?: AbortSignal,
  ): Promise<ApiResult<null>> => {
    return apiDelete<null>({
      apiBase: API_BASE,
      path: `/api/practice-content/${id}`,
      signal,
    });
  };

  return {
    fetchMetadata,
    deletePracticeContent,
  };
}
