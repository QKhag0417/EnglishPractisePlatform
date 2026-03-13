import { UserPracticeContentProgressGet } from "../types";

export type UserPracticeContentProgressByPracticeContentId = Record<
  string,
  {
    isBookmarked: boolean;
    attemptCount: number;
  }
>;

export function mapUserPracticeContentProgressesByPracticeContentId(
  progresses: UserPracticeContentProgressGet[],
): UserPracticeContentProgressByPracticeContentId {
  return (
    progresses ?? []
  ).reduce<UserPracticeContentProgressByPracticeContentId>((acc, progress) => {
    acc[progress.practiceContentId] = {
      isBookmarked: progress.isBookmarked,
      attemptCount: progress.attemptCount,
    };
    return acc;
  }, {});
}
