import { Store } from '@tanstack/store';

export type StatusCount = {
    all: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    refunded: number;
    [key: string]: number;
};

// Local storage key for persisting filters
const LOCAL_STORAGE_KEY = 'filter_store';
const STATUS_COUNT_KEY = 'status_count_store';

// Default filter to exclude archived items
const DEFAULT_FILTERS = {
    status: { notIn: ['archived'] },
};

// Load initial filters from local storage
const loadFiltersFromStorage = (): Record<string, any> => {
    const savedFilters = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedFilters ? JSON.parse(savedFilters) : { ...DEFAULT_FILTERS };
};

// Save filters to local storage
const saveFiltersToStorage = (filters: Record<string, any>) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filters));
};

// Load statusCount from local storage
export const loadStatusCountFromStorage = (): StatusCount => {
    const savedStatusCount = localStorage.getItem(STATUS_COUNT_KEY);
    return savedStatusCount
        ? JSON.parse(savedStatusCount)
        : {
              all: 0,
              processing: 0,
              shipped: 0,
              delivered: 0,
              cancelled: 0,
              refunded: 0,
          };
};

// Save statusCount to local storage
export const saveStatusCountToStorage = (statusCount: StatusCount) => {
    localStorage.setItem(STATUS_COUNT_KEY, JSON.stringify(statusCount));
};

// Define the initial state
export const filterStore = new Store({
    filters: loadFiltersFromStorage(), // Initialize filters from local storage
});

export const orderCountStore = new Store({
    statusCounts: loadStatusCountFromStorage(),
});

// Update `statusCounts` in the store && localStorage
export const updateStatusCount = (newStatusCounts: StatusCount) => {
    orderCountStore.setState((state) => {
        saveStatusCountToStorage(newStatusCounts);
        return { ...state, statusCounts: newStatusCounts };
    });
};

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

export const setDatePickerFilter = (
    key: string,
    value: { gte: number; lte: number },
    optionLabel: string
) => {
    filterStore.setState((state) => {
        const updatedFilters = {
            ...state.filters,
            [key]: { ...value, optionLabel }, // Add the label specifically for DatePicker
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
        const clearedFilters = { ...DEFAULT_FILTERS }; // Retain default filters
        saveFiltersToStorage(clearedFilters); // Persist changes to local storage
        return { filters: clearedFilters };
    });
};
