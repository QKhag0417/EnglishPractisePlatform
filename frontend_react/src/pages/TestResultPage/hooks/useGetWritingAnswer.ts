import { API_BASE } from "../../../env";
import { useApiGet } from "../../../utils/api/useApiGet";
import {
  USER_PRACTICE_WRITING_ANSWER_DTO_INCLUDE_FIELDS_QUERY,
  UserPracticeWritingAnswer,
  UserPracticeWritingAnswerDTO,
} from "../types";

function mapUserPracticeWritingAnswerDTOToUserPracticeWritingAnswer(
  dtos: UserPracticeWritingAnswerDTO[],
): UserPracticeWritingAnswer[] {
  return dtos.map((dto) => ({
    id: dto.id ?? "",
    orderIndex: dto.orderIndex ?? 0,
    essayText: dto.essayText ?? "",
    wordCount: dto.wordCount ?? 0,
  }));
}

const initialUserPracticeWritingAnswers: UserPracticeWritingAnswer[] = [];

export function useGetWritingAnswer(submissionId: string) {
  const {
    item: writingAnswers,
    setItem: setWritingAnswers,
    loading,
    error,
    get,
  } = useApiGet<UserPracticeWritingAnswerDTO[], UserPracticeWritingAnswer[]>({
    request: {
      apiBase: API_BASE,
      path: `/api/user-practice-writing-answer/submission/${submissionId}`,
      include: USER_PRACTICE_WRITING_ANSWER_DTO_INCLUDE_FIELDS_QUERY,
    },
    initialItem: initialUserPracticeWritingAnswers,
    mapItem: mapUserPracticeWritingAnswerDTOToUserPracticeWritingAnswer,
  });

  return {
    writingAnswers,
    setWritingAnswers,
    loading,
    error,
    get,
  };
}
