import { redirect } from '@tanstack/react-router';
import { useCustomerAuthStore } from '@/stores/authentication/customer-auth';

export const authMiddleware = () => {
  // Get the authentication status from the store
  const { authData } = useCustomerAuthStore.getState();
  
  // If not authenticated, redirect to login
  if (authData.status !== 'authenticated') {
    throw redirect({
      to: '/logout',
      search: {
        redirect: window.location.pathname + window.location.search,
      },
    });
  }
};

// Configure which paths middleware will run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /login
     * - /api (API routes)
     * - /_next (Next.js internals)
     * - /static (static files)
     * - .*\\..*$ (files with extensions)
     */
    '/((?!login|api|_next|static|.*\\..*$).*)',
  ],
} 