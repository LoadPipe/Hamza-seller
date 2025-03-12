import { redirect } from '@tanstack/react-router';
import { useUserAuthStore } from '@/stores/authentication/user-auth.ts';
import { getJwtToken, getJwtWalletAddress } from '@/utils/authentication';

export const authMiddleware = () => {
    const { authData } = useUserAuthStore.getState();
    const token = authData.token;
    const jwtToken = getJwtToken();

    // Check token first and return early if invalid
    if (!token || !jwtToken || token !== jwtToken) {
        throw redirect({
            to: '/logout',
            // search: {
            //   redirect: window.location.pathname + window.location.search,
            // },
        });
    }

    // Check wallet address next
    const storedWalletAddress = authData.wallet_address;
    const jwtWalletAddress = getJwtWalletAddress();
    if (
        !storedWalletAddress ||
        !jwtWalletAddress ||
        storedWalletAddress !== jwtWalletAddress
    ) {
        throw redirect({
            to: '/logout',
            // search: {
            //   redirect: window.location.pathname + window.location.search,
            // },
        });
    }

    // Finally check authentication status
    if (authData.status !== 'authenticated') {
        throw redirect({
            to: '/logout',
            // search: {
            //   redirect: window.location.pathname + window.location.search,
            // },
        });
    }
};

// Configure which paths middleware will run on
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except:
//      * - /login
//      * - /api (API routes)
//      * - /_next (Next.js internals)
//      * - /static (static files)
//      * - .*\\..*$ (files with extensions)
//      */
//     '/((?!login|api|_next|static|.*\\..*$).*)',
//   ],
// }
