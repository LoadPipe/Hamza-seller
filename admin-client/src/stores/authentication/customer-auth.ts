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
        isNewUser?: boolean;
    };
    preferred_currency_code: string | null;
    hasLoggedIn: boolean;
};

type Actions = {
    setWalletAddress: (walletAddress: string) => void;
    setHnsAvatar: (hnsAvatar: string | null) => void;
    setHnsName: (hnsName: string | null) => void;
    setCustomerAuthData: (authData: State['authData']) => void;
    setCustomerPreferredCurrency: (currency: string) => void;
    setIsVerified: (isVerified: boolean) => void;
    setHasLoggedIn: (value: boolean) => void;
    setStatus: (status: AuthenticationStatus) => void;
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
                isNewUser: false,
            },

            preferred_currency_code: null,

            hasLoggedIn: false, // New flag for first-login tracking

            setStatus: (status: AuthenticationStatus) => {
                set((state) => ({
                    authData: {
                        ...state.authData,
                        status,
                    },
                }));
            },

            setHasLoggedIn: (value: boolean) => {
                set({ hasLoggedIn: value });
            },

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
