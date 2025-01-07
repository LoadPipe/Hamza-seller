import { getJwtWalletAddress } from '@/utils/authentication';
import { PaymentDefinition } from '@/web3/contracts/escrow';

export const validateSeller = async (
    escrowPayment: PaymentDefinition | null,
    toast: (options: any) => void
): Promise<boolean> => {
    const sellerAddress = escrowPayment?.receiver;
    const walletAddress = getJwtWalletAddress();

    if (sellerAddress !== walletAddress) {
        toast({
            variant: 'destructive',
            title: 'Validation Error',
            description: `Only the owner of wallet ${sellerAddress} may modify this escrow.`,
        });
        return false;
    }

    return true;
};
