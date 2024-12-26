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
        status: AuthenticationStatus;
        is_verified: boolean;
    };
    preferred_currency_code: string;
    storeDetails: {
        name: string;
        default_currency_code: string;
    } | null;
};

type Actions = {
    setWalletAddress: (walletAddress: string) => void;
    setHnsAvatar: (hnsAvatar: string | null) => void;
    setHnsName: (hnsName: string | null) => void;
    setCustomerAuthData: (authData: State['authData']) => void;
    setCustomerPreferredCurrency: (currency: string) => void;
    setIsVerified: (isVerified: boolean) => void;
    setStatus: (status: AuthenticationStatus) => void;
    setStoreDetails: (details: State['storeDetails']) => void;
};

export const useCustomerAuthStore = create<State & Actions>()(
    persist(
        (set) => ({
            walletAddress: '',
            hnsAvatar: null,
            hnsName: null,
            authData: {
                is_verified: false,
                status: 'unauthenticated' as AuthenticationStatus, // Make sure to cast if needed
                token: '',
                wallet_address: '',
            },
            preferred_currency_code: '',
            storeDetails: null, // Initialize storeDetails as null

            setStatus: (status: AuthenticationStatus) => {
                set((state) => ({
                    authData: {
                        ...state.authData,
                        status,
                    },
                }));
            },

            setWalletAddress: (walletAddress: string) => {
                set({ walletAddress });
            },

            setCustomerAuthData: (authData) => {
                set({ authData });
            },

            setCustomerPreferredCurrency: (currency) => {
                set({ preferred_currency_code: currency });
            },

            setIsVerified: (isVerified: boolean) => {
                set((state) => ({
                    authData: {
                        ...state.authData,
                        is_verified: isVerified,
                    },
                }));
            },

            setHnsAvatar: (hnsAvatar: string | null) => {
                set({ hnsAvatar });
            },

            setHnsName: (hnsName: string | null) => {
                set({ hnsName });
            },

            setStoreDetails: (details) => {
                set({ storeDetails: details });
            },
        }),

        {
            name: '__hamza_customer', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // Use localStorage by default
        }
    )
);
