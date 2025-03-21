import { postSecure } from "@/utils/api-calls";
import { getJwtStoreId } from "@/utils/authentication";

export const verifyOrderAccess = async (orderId: string) => {
    try {
        const response = await postSecure('/seller/order/validate', {
            order_id: orderId,
            store_id: getJwtStoreId(),
        });
        return response && response.authorized === true;
    } catch (e) {
        console.error('Failed to verify order access:', e);
        throw new Error('Failed to verify order access');
    }
};