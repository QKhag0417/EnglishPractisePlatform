// usePutUserPracticeContentProgress.ts
import { API_BASE } from "../../../env";
import { useApiPut } from "../../../utils/api/useApiPut";
import type {
  UserPracticeContentProgressPut,
  UserPracticeContentProgressPutDTO,
  UserPracticeContentProgressPutBody,
} from "../types";

const initialBody: UserPracticeContentProgressPutBody = {
  isBookmarked: false,
};

const initialProgress: UserPracticeContentProgressPut = {
  userPracticeContentProgressId: "",
};

function mapUserPracticeContentProgressDTOToUserPracticeContentProgress(
  dto: UserPracticeContentProgressPutDTO,
): UserPracticeContentProgressPut {
  return {
    userPracticeContentProgressId: dto.id ?? "",
  };
}

export function usePutUserPracticeContentProgress(params: {
  userId?: string;
  practiceContentId?: string | number;
  body?: UserPracticeContentProgressPutBody;
}) {
  const { userId = "", practiceContentId = "", body = initialBody } = params;

  const {
    item: progress,
    setItem: setProgress,
    loading,
    error,
    put,
  } = useApiPut<
    UserPracticeContentProgressPutDTO,
    UserPracticeContentProgressPut,
    UserPracticeContentProgressPutBody
  >({
    request: {
      apiBase: API_BASE,
      path: `/api/user-practice-content-progress/user/${userId}/practice-content/${practiceContentId}`,
      body,
    },
    initialItem: initialProgress,
    mapItem: mapUserPracticeContentProgressDTOToUserPracticeContentProgress,
  });

  return {
    progress,
    setProgress,
    loading,
    error,
    put,
  };
}
