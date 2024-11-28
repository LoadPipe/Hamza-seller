import { Store } from '@tanstack/store';

// Local storage key for persisting filters
const LOCAL_STORAGE_KEY = 'filter_store';

// Load initial filters from local storage
const loadFiltersFromStorage = (): Record<string, any> => {
    const savedFilters = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedFilters ? JSON.parse(savedFilters) : {};
};

// Save filters to local storage
const saveFiltersToStorage = (filters: Record<string, any>) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filters));
};

// Define the initial state
export const filterStore = new Store({
    filters: loadFiltersFromStorage(), // Initialize filters from local storage
});

// Function to set or update a filter
export const setFilter = (key: string, value: any) => {
    filterStore.setState((state) => {
        const updatedFilters = {
            ...state.filters,
            [key]: value,
        };
        saveFiltersToStorage(updatedFilters); // Persist changes to local storage
        return { ...state, filters: updatedFilters };
    });
};

// Function to clear a specific filter
export const clearFilter = (key: string) => {
    filterStore.setState((state) => {
        const updatedFilters = { ...state.filters };
        delete updatedFilters[key];
        saveFiltersToStorage(updatedFilters); // Persist changes to local storage
        return { ...state, filters: updatedFilters };
    });
};

// Function to clear all filters
export const clearAllFilters = () => {
    filterStore.setState(() => {
        saveFiltersToStorage({}); // Clear local storage
        return { filters: {} };
    });
};
