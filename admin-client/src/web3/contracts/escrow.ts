import { BigNumberish, ethers } from 'ethers';
import { escrowAbi } from '../abi/escrow-abi';
import { ITransactionOutput } from '..';

export class EscrowClient {
    contractAddress: string;
    contract: ethers.Contract;
    provider: ethers.providers.Provider;
    signer: ethers.Signer;
    tokens: { [id: string]: ethers.Contract } = {};

    /**
     * Constructor.
     * @param address Address of the LiteSwitch contract
     */
    constructor(
        provider: ethers.providers.Provider,
        signer: ethers.Signer,
        address: string
    ) {
        this.provider = provider;
        this.signer = signer;
        this.contractAddress = address;

        this.contract = new ethers.Contract(
            this.contractAddress,
            escrowAbi,
            signer
        );
    }

    /**
     * Fully or partially refund a payment.
     *
     * @param paymentId Uniquely identifies the payment to be refunded.
     * @param amount The amount to refund.
     * @returns
     */
    async refundPayment(
        paymentId: string,
        amount: BigNumberish
    ): Promise<ITransactionOutput> {
        console.log(`[EscrowClient] Initiating refundPayment...`);
        console.log(`Payment ID: ${paymentId}`);
        console.log(`Amount: ${amount}`);

        try {
            const tx: any = await this.contract.refundPayment(
                paymentId,
                amount
            );
            console.log(`[EscrowClient] Transaction submitted: ${tx.hash}`);

            const transaction_id = tx.hash;
            const receipt = await tx.wait();
            console.log(
                `[EscrowClient] Transaction confirmed: ${receipt.transactionHash}`
            );

            return {
                transaction_id,
                tx,
                receipt,
            };
        } catch (error) {
            console.log(`[EscrowClient] Error: ${error}`);
            throw error;
        }
    }

    /**
     * Set a flag that the seller considers that the escrow should be released.
     *
     * @param paymentId Uniquely identifies the payment to be released.
     * @returns
     */
    async releaseEscrow(paymentId: string): Promise<ITransactionOutput> {
        console.log(`[EscrowClient] Initiating releaseEscrow...`);
        console.log(`Payment ID: ${paymentId}`);
        try {
            const tx: any = await this.contract.releaseEscrow(paymentId);
            console.log(`[EscrowClient] Transaction submitted: ${tx.hash}`);

            const transaction_id = tx.hash;
            const receipt = await tx.wait();
            console.log(
                `[EscrowClient] Transaction confirmed: ${receipt.transactionHash}`
            );

            return {
                transaction_id,
                tx,
                receipt,
            };
        } catch (error) {
            console.log(`[EscrowClient] Error: ${error}`);
            throw error;
        }
    }
}
