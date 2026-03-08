import { UserPracticeContentProgressGet } from "../types";

export function mapUserPracticeContentProgressesByPracticeContentId(
  progresses: UserPracticeContentProgressGet[],
): Record<string, boolean> {
  return (progresses ?? []).reduce<Record<string, boolean>>((acc, progress) => {
    acc[progress.practiceContentId] = progress.isBookmarked;
    return acc;
  }, {});
}
