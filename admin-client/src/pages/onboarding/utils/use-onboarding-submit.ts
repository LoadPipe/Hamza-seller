import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { setJwtCookie } from '@/utils/authentication';
import { getJwtWalletAddress } from '@/utils/authentication';
import { useUserAuthStore } from '@/stores/authentication/user-auth.ts';
import { updateOnboardingByWalletId } from '../api/create-store';

export const useOnboardingSubmit = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { setUserAuthData } = useUserAuthStore();

    return useMutation({
        mutationFn: async (payload: any) => {
            if (!payload || Object.keys(payload).length === 0) {
                throw new Error('No changes detected to update.');
            }
            console.log('payload:', payload);
            return updateOnboardingByWalletId(payload);
        },
        onSuccess: (data: { token: string }) => {
            queryClient.invalidateQueries({ queryKey: ['sellerStoreDetails'] });
            toast({
                variant: 'default',
                title: 'Success',
                description: 'Onboarding completed successfully.',
            });
            setJwtCookie(data.token);
            setUserAuthData({
                token: data.token,
                wallet_address: getJwtWalletAddress() ?? '',
                is_verified: true,
                status: 'authenticated',
                isNewUser: false,
            });
        },
        onError: (error: any) => {
            if (error?.response?.status === 403 && error.response.data.error) {
                toast({
                    variant: 'destructive',
                    title: 'Whitelist Error',
                    description: error.response.data.error,
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to complete onboarding.',
                });
            }
            console.error('Update error:', error);
        },
    });
};
