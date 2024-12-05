import { BigNumberish } from 'ethers';

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
