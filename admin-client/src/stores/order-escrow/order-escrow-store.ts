import { Store } from '@tanstack/store';

// Initialize the store with the default state
export const orderEscrowStore = new Store({
    isOpen: false,
    order: null as any | null,
});

// Open the escrow dialog and set the orderId
export const openOrderEscrowDialog = (order: any) => {
    orderEscrowStore.setState((state) => ({
        ...state,
        isOpen: true,
        order,
    }));
};

// Close the escrow dialog and clear the orderId
export const closeOrderEscrowDialog = () => {
    orderEscrowStore.setState((state) => ({
        ...state,
        isOpen: false,
        order: null,
    }));
};

// Toggle the escrow dialog's open/closed state
export const toggleOrderEscrowDialog = (order: any | null = null) => {
    orderEscrowStore.setState((state) => ({
        ...state,
        isOpen: !state.isOpen,
        order: state.isOpen ? null : order, // Maintain order when toggling open
    }));
};
