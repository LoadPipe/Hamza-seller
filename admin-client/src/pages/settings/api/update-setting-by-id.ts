import { postSecure } from '@/utils/api-calls.ts';
import { getJwtStoreId, getJwtWalletAddress } from '@/utils/authentication';

export const updateSettingsByWalletId = async (data: any) => {
    const response = await postSecure(`/seller/store/settings`, {
        store_id: getJwtStoreId(),
        wallet_address: getJwtWalletAddress(),
        ...data,
    });

    console.log('Update settings Response:', response);

    return response;
};
