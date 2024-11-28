import { Store } from '@tanstack/store';

// Define the initial state
export const filterStore = new Store({
    filters: {} as Record<string, any>, // Dynamic filters, e.g., { status: { in: ['pending', 'completed'] } }
});

// Function to set or update a filter
export const setFilter = (key: string, value: any) => {
    filterStore.setState((state) => ({
        ...state,
        filters: {
            ...state.filters,
            [key]: value,
        },
    }));
};

// Function to clear a specific filter
export const clearFilter = (key: string) => {
    filterStore.setState((state) => {
        const newFilters = { ...state.filters };
        delete newFilters[key];
        return {
            ...state,
            filters: newFilters,
        };
    });
};

export const clearAllFilters = () => {
    filterStore.setState(() => ({
        filters: {},
    }));
};
