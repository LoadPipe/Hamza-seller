import { BigNumberish, ethers } from 'ethers';
import { LiteSwitchClient } from './contracts/lite-switch';
import { EscrowClient, PaymentDefinition } from './contracts/escrow';

export async function verifyPaymentForOrder(
    chainId: number,
    transactionId: string,
    orderId: string,
    amount: BigNumberish
): Promise<boolean> {
    const total: bigint = await getAmountPaidForOrder(
        chainId,
        transactionId,
        orderId,
        amount
    );
    return total >= BigInt(amount);
}

export async function getAmountPaidForOrder(
    chainId: number,
    transactionId: string,
    orderId: string,
    amount: BigNumberish
): Promise<bigint> {
    const switchClient = new LiteSwitchClient(chainId);
    const events = await switchClient.findPaymentEvents(orderId, transactionId);
    //console.log('events: ', events);

    let total: bigint = BigInt(0);
    if (events.length) {
        events.map((e) => (total = total + BigInt(e.amount.toString())));
    }

    return BigInt(total);
}

export async function getEscrowPayment(
    escrowAddress: string,
    orderId: string
): Promise<PaymentDefinition> {
    const escrow = new EscrowClient(escrowAddress);
    return await escrow.getEscrowPayment(
        ethers.keccak256(ethers.toUtf8Bytes(orderId))
    );
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
