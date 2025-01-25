import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCustomerAuthStore } from '@/stores/authentication/customer-auth';
import { deleteJwtCookie } from '@/utils/authentication';


export default function LogoutPage() {
    const navigate = useNavigate();
    const setCustomerAuthData = useCustomerAuthStore(state => state.setCustomerAuthData);

    useEffect(() => {
        // Clear auth data
        setCustomerAuthData({
            token: '',
            wallet_address: '',
            is_verified: false,
            status: 'unauthenticated'
        });
        
        // Delete JWT cookie
        deleteJwtCookie();
        
        // Redirect to login
        navigate({ to: '/' });
    }, [navigate, setCustomerAuthData]);

    return <div>Logging out...</div>;
} 