import { postSecure } from '@/utils/api-calls';
import {getJwtWalletAddress } from '@/utils/authentication';

export const updateOnboardingByWalletId = async (data: any) => {
    const response = await postSecure(`/seller/onboarding/create-store`, {
        wallet_address: getJwtWalletAddress(),
        ...data,
    });
    return response;
};
