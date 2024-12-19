import { getCurrencyPrecision } from '@/currency.config';
import { EscrowClient, PaymentDefinition } from '@/web3/contracts/escrow';
import { BigNumber, BigNumberish, ethers, providers, Signer } from 'ethers';

/**
 * Converts any number decimal number (expressed as string or number) to an appropriate
 * number of wei units, given the currency.
 *
 * @param amount Amount as decimal
 * @param currencyCode usdc, usdt, eth
 * @returns The value converted to smallest units of the currency (as BigNumber)
 */
export function convertToWei(
    amount: string | number,
    currencyCode: string
): BigNumber {
    try {
        const precision = getCurrencyPrecision(currencyCode);
        return convertToUnits(amount, precision.native);
    } catch (e) {
        console.log(e);
    }

    return BigNumber.from(0);
}

/**
 * Converts any number decimal number (expressed as string or number) to a given number
 * of units.
 * Example: convertToUnits(3.21, 3) will return 3210.
 *
 * @param amount Amount as decimal
 * @param units Number of units
 * @param currencyCode usdc, usdt, eth
 * @returns The value converted to given number of units of the currency (as BigNumber)
 */
export function convertToUnits(
    amount: string | number,
    units: number
): BigNumber {
    try {
        const amt = amount.toString();
        const decimalPlaces = amt.includes('.') ? amt.split('.')[1].length : 0;

        return ethers.utils
            .parseUnits(amt, decimalPlaces)
            .mul(BigNumber.from(10).pow(units - decimalPlaces));
    } catch (e) {
        console.log(e);
    }

    return BigNumber.from(0);
}

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
export async function releaseEscrowPayment(order: any): Promise<void> {
    if (window.ethereum) {
        const escrow: EscrowClient = await createEscrowContract(order);

        try {
            const payment = await getEscrowPayment(order);

            //validate before releasing
            validatePaymentExists(payment, order.id);
            validatePaymentNotReleased(payment, order.id);
            validatePaymentNotReleasedBySeller(payment, order.id);

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
export async function refundEscrowPayment(
    order: any,
    amount: BigNumberish
): Promise<boolean | undefined> {
    if (window.ethereum) {
        try {
            const escrow: EscrowClient = await createEscrowContract(order);

            if (escrow) {
                const payment = await getEscrowPayment(order);
                console.log('payments yoooo', payment);
                //validate before refunding
                validatePaymentExists(payment, order.id);
                validatePaymentNotReleased(payment, order.id);
                validateRefundAmount(payment, order.id, amount);

                await escrow.refundPayment(
                    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(order.id)),
                    amount
                );
                return true;
            } else {
                return false;
            }
        } catch (error) {
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
 * @returns PaymentDefinition
 */
export async function getEscrowPayment(
    order: any
): Promise<PaymentDefinition | null> {
    if (window.ethereum) {
        try {
            const escrow = await createEscrowContract(order);
            const payment = await escrow.getPayment(
                ethers.utils.keccak256(ethers.utils.toUtf8Bytes(order.id))
            );

            return paymentIsValid(payment) ? payment : null;
        } catch (e: any) {
            console.error('Error in getEscrowPayment:', e); // Log the error
            return null; // Return null instead of throwing
        }
    } else {
        console.error('No web3 provider available');
        return null; // Return null if no web3 provider is available
    }
}

//VALIDATION METHODS

function paymentIsValid(payment: PaymentDefinition | null): boolean {
    if (payment?.id) {
        //return true if id contains more than just x and 0
        const id: string = payment.id.toString() ?? '';
        return (
            id !=
            '0x0000000000000000000000000000000000000000000000000000000000000000'
        );
    }

    return false;
}

function validatePaymentExists(
    payment: PaymentDefinition | null,
    orderId: string
) {
    if (!payment || !paymentIsValid(payment)) {
        throw new Error(`Payment ${orderId} not found.`);
    }
}

function validatePaymentNotReleased(
    payment: PaymentDefinition | null,
    orderId: string
) {
    if (payment?.released) {
        throw new Error(
            `Escrow payment for ${orderId} has already been released.`
        );
    }
}

function validatePaymentNotReleasedBySeller(
    payment: PaymentDefinition | null,
    orderId: string
) {
    if (payment?.receiverReleased) {
        throw new Error(
            `Escrow payment for ${orderId} has already been released by the seller.`
        );
    }
}

function validateRefundAmount(
    payment: PaymentDefinition | null,
    orderId: string,
    amount: BigNumberish
) {
    console.log(BigInt(payment?.amount.toString() ?? '0'));
    console.log(BigInt(payment?.amountRefunded.toString() ?? '0'));
    console.log(BigInt(amount.toString()));

    const refundableAmt =
        BigInt(payment?.amount.toString() ?? '0') -
        BigInt(payment?.amountRefunded.toString() ?? '0');

    if (refundableAmt < BigInt(amount.toString())) {
        throw new Error(
            `Amount of ${amount} exceeds the refundable amount of ${refundableAmt} for ${orderId}.`
        );
    }
}
