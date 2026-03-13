import { API_BASE } from "../../../env";
import { useApiPost } from "../../../utils/api/useApiPost";
import type {
  UserPracticeWritingAnswerDTO,
  UserPracticeWritingAnswer,
  UserPracticeWritingAnswerPostBody,
} from "../types";

const initialBody: UserPracticeWritingAnswerPostBody = {
  userPracticeSubmissionId: "",
  orderIndex: "1",
  essayText: "",
};

const initialWritingAnswer: UserPracticeWritingAnswer = {
  userPracticeWritingAnswerId: "",
};

function mapUserPracticeWritingAnswerDTOToUserPracticeWritingAnswer(
  dto: UserPracticeWritingAnswerDTO,
): UserPracticeWritingAnswer {
  return {
    userPracticeWritingAnswerId: dto.id ?? "",
  };
}

export function usePostUserPracticeWritingAnswer(
  params?: UserPracticeWritingAnswerPostBody,
) {
  const body = params ?? initialBody;

  const {
    item: writingAnswer,
    setItem: setWritingAnswer,
    loading,
    error,
    post,
  } = useApiPost<
    UserPracticeWritingAnswerDTO,
    UserPracticeWritingAnswer,
    UserPracticeWritingAnswerPostBody
  >({
    request: {
      apiBase: API_BASE,
      path: "/api/user-practice-writing-answer",
      body,
    },
    initialItem: initialWritingAnswer,
    mapItem: mapUserPracticeWritingAnswerDTOToUserPracticeWritingAnswer,
  });

  return {
    writingAnswer,
    setWritingAnswer,
    loading,
    error,
    post,
  };
}
