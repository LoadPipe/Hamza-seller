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

export function RainbowWrapper({ children }: { children: React.ReactNode }) {
    const { authData, setCustomerAuthData } = useCustomerAuthStore();
    //const [customer_id, setCustomerId] = useState('');

    const clearLogin = () => {
        console.log('CLEARING LOGIN');
        setCustomerAuthData({
            customer_id: '',
            is_verified: false,
            status: 'unauthenticated',
            token: '',
            wallet_address: '',
        });
        // clearAuthCookie();
    };

    const walletSignature = createAuthenticationAdapter({
        getNonce: async () => {
            const nonce = await getNonce();
            return nonce ?? '';
        },

        createMessage: ({ nonce, address, chainId }) => {
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
            const verifyRes = await fetch(
                'http://localhost:9000/custom/verify',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message, signature }),
                }
            );

            return Boolean(verifyRes.ok);
        },

        // verify: async ({ message, signature }) => {
        //     try {
        //         console.log(
        //             'Verifying message with signature:',
        //             message,
        //             signature
        //         );
        //         const response = await sendVerifyRequest(message, signature);

        //         let data = response.data;
        //         if (data.status == true && data.data?.created == true) {
        //             //if just creating, then a second request is needed
        //             const authResponse = await sendVerifyRequest(
        //                 message,
        //                 signature
        //             );
        //             data = authResponse.data;
        //         }

        //         if (data.status == true) {
        //             const tokenResponse = await getToken({
        //                 wallet_address: message.address,
        //                 email: data.data?.email?.trim()?.toLowerCase(),
        //                 password: '',
        //             });

        //             //check that customer data and wallet address match
        //             if (
        //                 data.data.wallet_address.trim().toLowerCase() ===
        //                 clientWallet?.trim()?.toLowerCase()
        //             ) {
        //                 const customerId = data.data.customer_id;
        //                 setCustomerId(customerId);
        //                 Cookies.set('_medusa_jwt', tokenResponse);

        //                 setCustomerAuthData({
        //                     token: tokenResponse,
        //                     wallet_address: message?.address,
        //                     customer_id: data.data?.customer_id,
        //                     is_verified: data.data?.is_verified,
        //                     status: 'authenticated',
        //                 });

        //                 setCustomerPreferredCurrency(
        //                     data.data?.preferred_currency?.code
        //                 );

        //                 return true;
        //             } else {
        //                 console.log('Wallet address mismatch on login');
        //                 clearLogin();
        //                 return false;
        //             }
        //         } else {
        //             console.log('running verify unauthenticated');
        //             clearLogin();
        //             throw new Error(data.message);
        //         }

        //         return false;
        //     } catch (e) {
        //         console.error('Error in signing in:', e);
        //         return false;
        //     }
        // },

        signOut: async () => {
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
                            <RainbowKitProvider>{children}</RainbowKitProvider>
                        </RainbowKitAuthenticationProvider>
                    </ThemeProvider>
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </WagmiProvider>
        </>
    );
}
