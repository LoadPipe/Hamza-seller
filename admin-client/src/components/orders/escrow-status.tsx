import { PaymentDefinition } from '@/web3/contracts/escrow';

type EscrowStatusProps = {
    payment: PaymentDefinition;
};

/**
 * Uses the properties of the payment to come up with an appropriate escrow status to display.
 * @param payment PaymentDefinition from escrow
 * @returns string
 */
function getEscrowStatus(payment: PaymentDefinition): string {
    if (!payment) return '-';

    if (payment.payerReleased && !payment.receiverReleased)
        return 'buyer released';
    else if (payment.receiverReleased && !payment.payerReleased)
        return 'seller released';
    else if (payment.released) return 'released';

    //calculate if refunded or not
    const amount: BigInt = BigInt(payment.amount?.toString() ?? '0;');

    const refundableAmt: BigInt =
        BigInt(payment.amount?.toString() ?? '0') -
        BigInt(payment.amountRefunded?.toString() ?? '0');

    if (amount != BigInt(0) && refundableAmt == BigInt(0)) {
        return 'fully refunded';
    }

    return 'in escrow';
}

const EscrowStatus: React.FC<EscrowStatusProps> = ({ payment }) => {
    const status = getEscrowStatus(payment);

    return (
        <div>
            <div className="mt-4 flex justify-between items-center">
                <div className="flex">
                    <h2 className="text-lg font-bold">
                        Escrow Status: {status}
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default EscrowStatus;
