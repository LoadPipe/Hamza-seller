import { EscrowClient, PaymentDefinition } from '@/web3/contracts/escrow';
import { BigNumberish, ethers, providers, Signer } from 'ethers';

/**
 * Releases a payment in escrow, from the seller side, on the escrow contract on the blockchain.
 *
 * @param order An Order object with payments attached
 *
 * Will return false if the order doesn't have the appropriate blockchain data (e.g. escrow address)
 * to make the call to the contract, or if a web3 provider isn't available.
 *
 * Throws if the blockchain operation fails in the contract (e.g. amount is invalid, invalid order id
 * from the escrow contract's point of view, etc.)
 *
 * @returns True if it was possible to make the contract call.
 */
export async function releaseOrderEscrow(order: any): Promise<void> {
    if (window.ethereum) {
        const escrow: EscrowClient = await createEscrowContract(order);
        try {
            await escrow.releaseEscrow(
                ethers.utils.keccak256(ethers.utils.toUtf8Bytes(order.id))
            );
        } catch (error) {
            console.error('Error during escrow release:', error); // Log the error
            throw error; // Ensure the error is propagated
        }
    } else {
        console.error('No web3 provider available.'); // Log the missing provider error
        throw new Error('No web3 provider available.');
    }
}
/**
 *
 * @param order An Order object with payments attached
 * @param amount The amount to refund, expressed in actual wei (or whatever unit is appropriate
 * for the given token, if payment was in token)
 *
 * Will return false if the order doesn't have the appropriate blockchain data (e.g. escrow address)
 * to make the call to the contract, or if a web3 provider isn't available.
 *
 * Throws if the blockchain operation fails in the contract (e.g. amount is invalid, invalid order id
 * from the escrow contract's point of view, etc.)
 *
 * @returns True if it was possible to make the contract call.
 */
export async function refundOrderEscrow(
    order: any,
    amount: BigNumberish
): Promise<boolean | undefined> {
    // console.log(`$$$$ Refunding ${amount} escrowed funds $$$$`);
    if (window.ethereum) {
        try {
            const escrow: EscrowClient = await createEscrowContract(order);
            await escrow.getEscrowPayment(order.id);
            // const getEscrowLogs = await escrow.getEscrowPayment(order.id);
            // console.log(`getEscrowLogs: ${JSON.stringify(getEscrowLogs)}`);
            if (escrow) {
                await escrow.refundPayment(
                    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(order.id)),
                    amount
                );
                return true;
            } else {
                // console.log('Escrow contract creation failed.');
                return false;
            }
        } catch (error) {
            // console.log('Escrow contract creation failed 2.');
            throw error; // Ensure the error propagates to the caller
        }
    } else {
        // console.error('No web3 provider available.');
        throw new Error('No web3 provider available');
    }
}

/**
 * Searches the order data for an escrow contract address.
 *
 * @param order Any Order object with payments.
 * @returns Address of escrow contract.
 */
export function findEscrowAddressFromOrder(order: any): string {
    order?.payments?.sort((a: any, b: any) => a.created_at < b.created_at);
    return order?.payments[0]?.blockchain_data?.escrow_address;
}

/**
 * Searches the order data for an escrow contract address and instantiates a contract client.
 *
 * @param order Any Order object with payments.
 * @returns EscrowClient object.
 */
async function createEscrowContract(order: any): Promise<EscrowClient> {
    const provider: providers.Web3Provider = new providers.Web3Provider(
        window.ethereum
    );

    const signer: Signer = await provider.getSigner();

    const address: string = findEscrowAddressFromOrder(order);
    if (!address) {
        throw new Error('No escrow address found in order');
    }
    const escrow: EscrowClient = new EscrowClient(provider, signer, address);

    return escrow;
}

/**
 * Gets a payment definition for the given order, from the escrow if it exists.
 *
 * @param order A whole entire order object
 * @returns PaymentDefinition
 */
export async function getEscrowPayment(
    order: any
): Promise<PaymentDefinition | null> {
    if (window.ethereum) {
        try {
            const escrow = await createEscrowContract(order);
            return await escrow.getEscrowPayment(
                ethers.utils.keccak256(ethers.utils.toUtf8Bytes(order.id))
            );
        } catch (e: any) {
            console.error('Error getting the payment:', e); // Log the error}
        }
    } else {
        throw new Error('No web3 provider available');
    }

    return null;
}
