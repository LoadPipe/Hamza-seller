import { postSecure } from '@/utils/api-calls.ts';
import { getJwtStoreId} from '@/utils/authentication';


export const updateSettingsByWalletId = async (data: any) => {
    const response = await postSecure(`/seller/store/edit-settings`, {
        store_id: getJwtStoreId(),
        ...data,
    });

    console.log('Update settings Response:', response);

    return response; 
};
