import { BigNumberish, providers } from 'ethers';

/**
 * Input params to a single payment to the escrow.
 */
export interface IPaymentInput {
    id: string;
    payer: string;
    receiver: string;
    amount: BigNumberish;
}

/**
 * Output from a transaction execution.
 */
export interface ITransactionOutput {
    transaction_id: string;
    tx: any;
    receipt: any;
}

/**
 * Input params for multiple concurrent payments to the escrow.
 */
export interface IMultiPaymentInput {
    currency: string; //token address, or ethers.ZeroAddress for native
    payments: IPaymentInput[];
}

/**
 * Gets the chain id for the current signed in wallet.
 */
export async function getChainId(): Promise<number> {
    const provider: providers.Web3Provider = new providers.Web3Provider(
        window.ethereum
    );
    const { chainId } = await provider.getNetwork();
    return chainId;
}
