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
            [key]: value, // Update the filter key with the new value
        },
    }));
};

// Function to clear a specific filter
export const clearFilter = (key: string) => {
    filterStore.setState((state) => {
        const newFilters = { ...state.filters };
        delete newFilters[key]; // Remove the key from filters
        return {
            ...state,
            filters: newFilters,
        };
    });
};

// Function to clear all filters
export const clearAllFilters = () => {
    filterStore.setState(() => ({
        filters: {}, // Reset filters to an empty object
    }));
};
