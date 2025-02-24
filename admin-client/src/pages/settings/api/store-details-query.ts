import { postSecure } from '@/utils/api-calls';
import { getJwtWalletAddress } from '@/utils/authentication';

export async function sellerStoreDetailsQuery(
): Promise<any> {
  try {
    const walletAddress = getJwtWalletAddress();
    const params = { wallet_address: walletAddress };

    const response = await postSecure('/seller/store/details', params);
    return response;
  } catch (error) {
    console.error('Failed to fetch store details:', error);
    throw new Error('Failed to fetch store details');
  }
}
