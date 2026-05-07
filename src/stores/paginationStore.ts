import { create } from "zustand";

interface PaginationStore {
  page: number;
  setPage: (page: number) => void;
  hasMore: boolean;
  setHasMore: (hasMore: boolean) => void;
  total: number;
  setTotal: (total: number) => void;
}

export const usePaginationStore = create<PaginationStore>(
  (set) => ({
    page: 1,
    setPage: (page: number) => set({ page }),
    hasMore: true,
    setHasMore: (hasMore: boolean) => set({ hasMore }),
    total: 0,
    setTotal: (total: number) => set({ total }),
  })
);
