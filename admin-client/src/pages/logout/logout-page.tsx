import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useUserAuthStore } from '@/stores/authentication/user-auth.ts';
import { deleteJwtCookie } from '@/utils/authentication';

export default function LogoutPage() {
    const navigate = useNavigate();
    const setUserAuthData = useUserAuthStore((state) => state.setUserAuthData);

    useEffect(() => {
        // Clear auth data
        setUserAuthData({
            token: '',
            wallet_address: '',
            is_verified: false,
            status: 'unauthenticated',
        });

        // Delete JWT cookie
        deleteJwtCookie();

        // Redirect to login
        navigate({ to: '/' });
        window.location.href = '/';
    }, [navigate, setUserAuthData]);

    return <div>Logging out...</div>;
}
