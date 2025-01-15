import { Store } from '@tanstack/store';

export type ProductStoreState = {
    filters: Record<string, any>; // Filter configuration
    sort: { field: string; direction: 'ASC' | 'DESC' } | null; // Sort state
    pageIndex: number; // Current page index
    pageSize: number; // Number of items per page
    totalRecords: number; // Total number of records
    filteredCount: number; // Total records after filters applied
    availableCategories: Record<string, string>; // Category map (id -> name)
};

const LOCAL_STORAGE_KEY = 'product_filter_store';

// Load initial filters and state from local storage
const loadProductStoreFromStorage = (): Partial<ProductStoreState> => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : {};
};

// Save product store state to local storage
const saveProductStoreToStorage = (state: Partial<ProductStoreState>) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
};

// Initialize the store with default values
export const productStore = new Store<ProductStoreState>({
    filters: loadProductStoreFromStorage().filters ?? {},
    sort: loadProductStoreFromStorage().sort ?? {
        field: 'created_at',
        direction: 'ASC',
    },
    pageIndex: loadProductStoreFromStorage().pageIndex ?? 0,
    pageSize: loadProductStoreFromStorage().pageSize ?? 10,
    totalRecords: loadProductStoreFromStorage().totalRecords ?? 0,
    filteredCount: loadProductStoreFromStorage().filteredCount ?? 0,
    availableCategories:
        loadProductStoreFromStorage().availableCategories ?? {},
});

// Update state and persist to local storage
export const updateProductStoreState = (
    updates: Partial<ProductStoreState>
) => {
    productStore.setState((state) => {
        const updatedState = { ...state, ...updates };
        saveProductStoreToStorage(updatedState);
        return updatedState;
    });
};

// Utility to set or update a filter
export const setProductFilter = (key: string, value: any) => {
    productStore.setState((state) => {
        const updatedFilters = { ...state.filters, [key]: value };
        const updatedState = { ...state, filters: updatedFilters };
        saveProductStoreToStorage(updatedState);
        return { ...state, filters: updatedFilters };
    });
};

// Utility to clear a specific filter
export const clearProductFilter = (key: string) => {
    productStore.setState((state) => {
        const updatedFilters = { ...state.filters };
        delete updatedFilters[key];
        const updatedState = { ...state, filters: updatedFilters };
        saveProductStoreToStorage(updatedState);
        return updatedState;
    });
};

// Utility to clear all filters
export const clearAllProductFilters = () => {
    productStore.setState((state) => {
        const updatedState = { ...state, filters: {} };
        saveProductStoreToStorage(updatedState);
        return updatedState;
    });
};
