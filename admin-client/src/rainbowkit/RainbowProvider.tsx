import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { WagmiProvider } from 'wagmi';
import {
    RainbowKitAuthenticationProvider,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { ThemeProvider } from '@/components/theme-provider';
import { config } from './wagmi.ts';
import { useState } from 'react';
import { createAuthenticationAdapter } from '@rainbow-me/rainbowkit';
import { createSiweMessage } from 'viem/siwe';
import {
    sendVerifyRequest,
    getNonce,
    setJwtCookie,
    getJwtStoreId,
} from '@/utils/authentication/';
import { useCustomerAuthStore } from '@/stores/authentication/customer-auth.ts';
import LoginPage from '@/pages/login/login-page.tsx';

export function RainbowWrapper({ children }: { children: React.ReactNode }) {
    const { authData, setCustomerAuthData } = useCustomerAuthStore();

    const walletSignature = createAuthenticationAdapter({
        getNonce: async () => {
            const nonce = await getNonce();
            return nonce ?? '';
        },

        createMessage: ({ nonce, address, chainId }) => {
            console.log('createMessage called with', {
                nonce,
                address,
                chainId,
            });

            return createSiweMessage({
                domain: window.location.host,
                address,
                statement: 'Sign in with Ethereum to the app.',
                uri: window.location.origin,
                version: '1',
                chainId,
                nonce,
            });
        },

        verify: async ({ message, signature }) => {
            console.log('SIEW MESSAGE', message);
            console.log('signature', signature);
            try {
                const response = await sendVerifyRequest(message, signature);

                // Extract JWT from response
                const { token, newUser } = response.data;
                console.log('respnse data', response.data);
                console.log('response', response);
                console.log('token', token);

                // Set the JWT as a secure cookie
                setJwtCookie(token);

                const lines = message.split('\n');
                const walletAddress = lines[1]?.trim();

                if (response.status === 200) {
                    setCustomerAuthData({
                        token: token,
                        wallet_address: walletAddress.toLowerCase(),
                        is_verified: true,
                        status: 'authenticated',
                    });
                }

                const storeId = getJwtStoreId();

                if (newUser || !storeId) {
                    window.location.href = '/onboarding';
                } else {
                    window.location.href = '/dashboard';
                }
                return response.data;
            } catch (error) {
                console.error('Verification failed:', error);
            }
        },

        signOut: async () => {
            // Clear localStorage keys
            localStorage.removeItem('tableColumnVisibility');
            localStorage.removeItem('filter_store');
            localStorage.removeItem('status_count_store');
            localStorage.removeItem('sidebar-store');
            setCustomerAuthData({
                token: '',
                wallet_address: '',
                is_verified: false,
                status: 'unauthenticated',
            });

            await fetch('/api/logout');
        },
    });

    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                    },
                },
            })
    );

    // If currently not logged in, reset localStorage
    // if (authData.is_verified === false) {
    //     localStorage.removeItem('tableColumnVisibility');
    //     localStorage.removeItem('filter_store');
    //     localStorage.removeItem('status_count_store');
    // }

    return (
        <>
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider
                        defaultTheme="dark"
                        storageKey="vite-ui-theme"
                    >
                        <RainbowKitAuthenticationProvider
                            adapter={walletSignature}
                            status={authData.status}
                        >
                            <RainbowKitProvider>
                                {authData.status !== 'authenticated' ? (
                                    <LoginPage />
                                ) : (
                                    children
                                )}
                            </RainbowKitProvider>
                        </RainbowKitAuthenticationProvider>
                    </ThemeProvider>
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </WagmiProvider>
        </>
    );
}
