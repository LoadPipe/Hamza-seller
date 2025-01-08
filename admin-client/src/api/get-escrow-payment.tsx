import { get } from '@/api/apiService';
import { EscrowPaymentDefinitionWithError } from '@/web3/contracts/escrow';

export async function getEscrowPaymentData(
    order_id: string,
    validate_refund: boolean = false,
    validate_release: boolean = false,
    wallet_address: string = ''
): Promise<EscrowPaymentDefinitionWithError> {
    const output = await get<EscrowPaymentDefinitionWithError>(
        '/seller/order/escrow/status',
        {
            params: {
                order_id,
                validate_refund,
                validate_release,
                wallet_address,
            },
        }
    );
    console.log(output);
    return output;
}
