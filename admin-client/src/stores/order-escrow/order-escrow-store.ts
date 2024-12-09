import { Store } from '@tanstack/store';

// Initialize the store with the default state
export const orderEscrowStore = new Store({
    isOpen: false,
    orderId: null as string | null,
});

// Open the escrow dialog and set the orderId
export const openOrderEscrowDialog = (orderId: string) => {
    orderEscrowStore.setState((state) => ({
        ...state,
        isOpen: true,
        orderId,
    }));
};

// Close the escrow dialog and clear the orderId
export const closeOrderEscrowDialog = () => {
    orderEscrowStore.setState((state) => ({
        ...state,
        isOpen: false,
        orderId: null,
    }));
};

// Toggle the escrow dialog's open/closed state
export const toggleOrderEscrowDialog = (orderId: string | null = null) => {
    orderEscrowStore.setState((state) => ({
        ...state,
        isOpen: !state.isOpen,
        orderId: state.isOpen ? null : orderId, // Maintain orderId when toggling open
    }));
};
