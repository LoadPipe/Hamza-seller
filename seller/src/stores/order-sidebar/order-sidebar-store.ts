// order-sidebar-store.ts
import { Store } from '@tanstack/store';

// Create the store with the initial state
export const orderSidebarStore = new Store({
    isSidebarOpen: false,
});

// Create functions to manage the sidebar state
export const openOrderSidebar = () => {
    orderSidebarStore.setState((state) => ({
        ...state,
        isSidebarOpen: true,
    }));
};

export const closeOrderSidebar = () => {
    orderSidebarStore.setState((state) => ({
        ...state,
        isSidebarOpen: false,
    }));
};

export const toggleOrderSidebar = () => {
    orderSidebarStore.setState((state) => ({
        ...state,
        isSidebarOpen: !state.isSidebarOpen,
    }));
};
