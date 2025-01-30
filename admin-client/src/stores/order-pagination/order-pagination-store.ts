import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PaginationState {
    pageIndex: number;
    pageCount: number;
    setPageIndex: (index: number) => void;
    setPageCount: (count: number) => void;
}

const usePaginationStore = create<PaginationState>()(
    persist(
        (set) => ({
            pageIndex: 0, // Default to first page
            pageCount: 10, // Default to 10 page
            setPageIndex: (index) =>
                set((state) => ({
                    pageIndex: Math.max(
                        0,
                        Math.min(index, state.pageCount - 1)
                    ), // Ensure index stays within bounds
                })),
            setPageCount: (count) =>
                set(() => ({
                    pageCount: Math.max(1, count), // Ensure pageCount is at least 1
                })),
        }),
        {
            name: 'pagination-store', // LocalStorage key
        }
    )
);

export default usePaginationStore;
