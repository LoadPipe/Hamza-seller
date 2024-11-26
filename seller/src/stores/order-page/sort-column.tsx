import { create } from 'zustand';

interface SortState {
    sort: {
        field: string;
        direction: 'asc' | 'desc';
    };
    setSort: (field: string, direction?: 'asc' | 'desc') => void;
}

const useSortStore = create<SortState>((set, get) => ({
    sort: {
        field: 'created_at', // Default field
        direction: 'asc', // Default direction
    },
    setSort: (field, direction) => {
        const { sort } = get();

        set(() => ({
            sort: {
                field,
                // If direction is provided, use it; otherwise, toggle
                direction:
                    direction ??
                    (sort.field === field && sort.direction === 'asc'
                        ? 'desc'
                        : 'asc'),
            },
        }));
    },
}));

export default useSortStore;
