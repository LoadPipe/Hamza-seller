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
import getNonce from '@/utils/authentication/getNonce.ts';
import sendVerifyRequest from '@/utils/authentication/sendVerifyRequest.ts';
import { useCustomerAuthStore } from '@/stores/authentication/customer-auth.ts';
import LoginPage from '@/pages/login/login-page.tsx';

export function RainbowWrapper({ children }: { children: React.ReactNode }) {
    const { authData, setCustomerAuthData } = useCustomerAuthStore();
    const [walletAddress, setWalletAddress] = useState<string>('');

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
            setWalletAddress(address);
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
            console.log('message', message);
            console.log('signature', signature);
            try {
                const response = await sendVerifyRequest(message, signature);

                // Extract JWT from response
                const { token } = response.data;
                console.log('respnse data', response.data);
                console.log('respnse', response);
                console.log('token', token);

                // Set the JWT as a secure cookie
                document.cookie = `jwt=${token}; path=/; secure; HttpOnly`;

                if (response.status === 200) {
                    setCustomerAuthData({
                        token: token,
                        wallet_address: walletAddress,
                        is_verified: true,
                        status: 'authenticated',
                    });
                }

                return response.data;
            } catch (error) {
                console.error('Verification failed:', error);
            }
        },

        signOut: async () => {
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
