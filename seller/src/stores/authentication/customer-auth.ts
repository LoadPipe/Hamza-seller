import { AuthenticationStatus } from '@rainbow-me/rainbowkit';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type State = {
    walletAddress: string;
    hnsAvatar: string | null;
    hnsName: string | null;
    authData: {
        wallet_address: string;
        token: string;
        customer_id: string;
        status: AuthenticationStatus;
        is_verified: boolean;
    };
    preferred_currency_code: string | null;
};

type Actions = {
    setWalletAddress: (walletAddress: string) => void;
    setHnsAvatar: (hnsAvatar: string | null) => void;
    setHnsName: (hnsName: string | null) => void;
    setCustomerAuthData: (authData: State['authData']) => void;
    setCustomerPreferredCurrency: (currency: string) => void;
    setIsVerified: (isVerified: boolean) => void;
};

export const useCustomerAuthStore = create<State & Actions>()(
    persist(
        (set) => ({
            walletAddress: '',
            hnsAvatar: null,
            hnsName: null,
            authData: {
                customer_id: '',
                is_verified: false,
                status: 'unauthenticated' as AuthenticationStatus, // Make sure to cast if needed
                token: '',
                wallet_address: '',
            },
            preferred_currency_code: null,

            // Correctly define setWalletAddress
            setWalletAddress: (walletAddress: string) => {
                set({
                    walletAddress,
                });
            },

            // Define setCustomerAuthData
            setCustomerAuthData: (authData) => {
                set({
                    authData: authData,
                });
            },

            // Define setCustomerPreferredCurrency
            setCustomerPreferredCurrency: (currency) => {
                set({ preferred_currency_code: currency });
            },

            // Define setIsVerified
            setIsVerified: (isVerified: boolean) => {
                set((state) => ({
                    authData: {
                        ...state.authData,
                        is_verified: isVerified,
                    },
                }));
            },
            // Define setHnsAvatar
            setHnsAvatar: (hnsAvatar: string | null) => {
                set({ hnsAvatar });
            },

            // Define setHnsName
            setHnsName: (hnsName: string | null) => {
                set({ hnsName });
            },
        }),

        {
            name: '__hamza_customer', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // Use localStorage by default
        }
    )
);
