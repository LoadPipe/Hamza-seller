import { getJwtWalletAddress } from '@/utils/authentication';

export const validateSeller = async (
    order: any,
    toast: (options: any) => void
): Promise<boolean> => {
    const sellerAddress = order?.payments[0]?.receiver_address;
    const walletAddress = getJwtWalletAddress();

    if (sellerAddress !== walletAddress) {
        toast({
            variant: 'destructive',
            title: 'Validation Error',
            description: `Only the owner of wallet ${order?.payments[0]?.receiver_address} may modify this escrow.`,
        });
        return false;
    }

    return true;
};
