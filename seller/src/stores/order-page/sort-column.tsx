import { create } from 'zustand';

interface SortState {
    sort: {
        field: string;
        direction: 'asc' | 'desc';
    };
    setSort: (field: string, direction: 'asc' | 'desc') => void;
}

const useSortStore = create<SortState>((set) => ({
    // Initial sort state
    sort: {
        field: 'created_at', // Default field
        direction: 'asc', // Default direction
    },
    // Function to update the sort state
    setSort: (field, direction) =>
        set(() => ({
            sort: {
                field,
                direction,
            },
        })),
}));

export default useSortStore;
