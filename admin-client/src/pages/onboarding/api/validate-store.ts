import { postSecure } from '@/utils/api-calls';

export const validateStoreNameAndHandle = async (data: {
    storeName: string;
    handle: string;
}) => {
    const response = await postSecure('/seller/store/validate', data);
    return response;
};
