import { Store } from '@tanstack/store';

// Create the store with the initial state
export const orderSidebarStore = new Store({
    isSidebarOpen: false,
    orderId: null as string | null,
});

// Open the sidebar and set the orderId
export const openOrderSidebar = (orderId: string) => {
    orderSidebarStore.setState((state) => ({
        ...state,
        isSidebarOpen: true,
        orderId,
    }));
};

// Close the sidebar and clear the orderId
export const closeOrderSidebar = () => {
    orderSidebarStore.setState((state) => ({
        ...state,
        isSidebarOpen: false,
        orderId: null,
    }));
};

// Toggle the sidebar's open/closed state
export const toggleOrderSidebar = () => {
    orderSidebarStore.setState((state) => ({
        ...state,
        isSidebarOpen: !state.isSidebarOpen,
        orderId: state.isSidebarOpen ? null : state.orderId, // Maintain orderId when toggling
    }));
};
