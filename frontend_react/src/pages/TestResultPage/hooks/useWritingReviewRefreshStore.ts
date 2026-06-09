// stores/useWritingReviewRefreshStore.ts
import { create } from "zustand";

type WritingReviewRefreshStore = {
  refreshVersion: number;
  bumpRefreshVersion: () => void;
};

export const useWritingReviewRefreshStore = create<WritingReviewRefreshStore>(
  (set) => ({
    refreshVersion: 0,
    bumpRefreshVersion: () =>
      set((state) => ({
        refreshVersion: state.refreshVersion + 1,
      })),
  }),
);
