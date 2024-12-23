import React, { useState } from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
// import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { postSecure, putSecure } from '@/utils/api-calls';
import { useToast } from '@/hooks/use-toast';
import {
    refundEscrowPayment,
    getEscrowPayment,
    convertFromWeiToDisplay,
} from '@/utils/order-escrow.ts';
import { getCurrencyPrecision } from '@/currency.config';

type RefundProps = {
    refundAmount?: number;
    order: any;
    chainId: number;
};

const reasonOptions = ['discount', 'return', 'swap', 'claim', 'other'];

const Refund: React.FC<RefundProps> = ({ refundAmount, order, chainId }) => {
    const [formData, setFormData] = useState({
        refundAmount: refundAmount || '',
        reason: reasonOptions[0], // Default to the first option
        note: '',
    });

    const payment = order?.escrow_payment;
    let refundedAmount: BigInt = BigInt(0);
    let refundableAmount: BigInt = BigInt(0);

    if (payment) {
        refundedAmount = BigInt(payment.amountRefunded?.toString() ?? '0');
        refundableAmount =
            BigInt(payment.amount?.toString() ?? '0') -
            BigInt(payment.amountRefunded?.toString() ?? '0');
    }

    const refundableAmountToDisplay = convertFromWeiToDisplay(
        refundableAmount.toString(),
        order?.currency_code,
        chainId
    );

    const refundedAmountToDisplay = convertFromWeiToDisplay(
        refundableAmount.toString(),
        order?.currency_code,
        chainId
    );

    //get order id
    const orderId = order?.id ?? '';

    const [errors, setErrors] = useState({
        refundAmount: '',
        note: '',
    });
    const { toast } = useToast();

    //get the currency code & precision
    const currencyCode = order?.payments[0]?.currency_code ?? 'usdc';
    const precision = getCurrencyPrecision(currencyCode, chainId);

    //convert the amount to db units
    const getDbAmount = (amount: string | number) => {
        return Math.floor(parseFloat(amount.toString()) * 10 ** precision.db);
    };

    //convert the amount to wei for blockchain use
    const getBlockchainAmount = (amount: string | number) => {
        const dbAmount = getDbAmount(amount);
        const bcAmount =
            dbAmount.toString() +
            ''.padEnd(precision.native - precision.db, '0');
        return bcAmount;
    };

    const refundMutation = useMutation({
        mutationFn: async () => {
            const escrowPayment = await getEscrowPayment(order);

            if (escrowPayment === null) {
                toast({
                    variant: 'destructive',
                    title: 'Escrow Payment Error',
                    description: 'This Payment does not exist in the Escrow.',
                });
                return null; // Return with controlled value for verbose error handling
            }

            const payload = {
                order_id: orderId,
                amount: getDbAmount(formData.refundAmount),
                reason: formData.reason,
                note: formData.note,
            };

            return await postSecure('/seller/order/refund', payload);
        },
        onSuccess: async (data) => {
            if (data === null) {
                console.log(`Escrow validation failed, skipped`);
                return;
            }
            try {
                const { metadata } = data;

                //send refund request to escrow contract
                const escrowRefundResult = await refundEscrowPayment(
                    order,
                    getBlockchainAmount(formData.refundAmount)
                );

                //if result successful, confirm the refund
                if (escrowRefundResult) {
                    await putSecure('/seller/order/refund', {
                        id: metadata?.refund_id,
                        order_id: orderId,
                    });
                    toast({
                        variant: 'default',
                        title: 'Escrow Refund',
                        description: 'The escrow refund was successful.',
                    });
                } else {
                    toast({
                        variant: 'destructive',
                        title: 'Escrow Refund Failed',
                        description:
                            'The escrow refund could not be completed.',
                    });
                    console.error('Escrow refund failed');
                }
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: 'Escrow Refund Error',
                    description: `${error} || 'An unknown error occurred during the escrow refund.`,
                });
                console.error('Error in escrow refund:', error);
            } finally {
                setTimeout(() => setShowSuccessMessage(false), 5000);
            }
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: 'Refund Error',
                description: `Refund amount exceeds the refundable amount.
                ${error}`,
            });
        },
    });

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear errors on input change
        setErrors({ ...errors, [name]: '' });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, reason: e.target.value });
    };

    const validateForm = () => {
        const newErrors = {
            refundAmount: '',
            note: '',
        };

        if (
            formData.refundAmount === '' ||
            Number(formData.refundAmount) <= 0
        ) {
            newErrors.refundAmount = 'Refund amount must be greater than 0.';
        }

        if (formData.note.trim().length === 0) {
            newErrors.note = 'Note is required.';
        }

        setErrors(newErrors);

        // Return true if there are no errors
        return !newErrors.refundAmount && !newErrors.note;
    };

    const handleRefundSubmit = () => {
        if (validateForm()) {
            refundMutation.mutate();
        }
    };

    const isSubmitDisabled = !!errors.refundAmount || !!errors.note;

    return (
        <div>
            {/* Manual Refund Checkbox */}
            <div className="mt-4 flex justify-between items-center">
                <div className="flex">
                    <h2 className="text-lg font-bold">Refund Management</h2>
                </div>
            </div>

            {/* Accordion for Refund Details */}
            <Accordion
                type="single"
                defaultValue="refund-details"
                collapsible
                className="mt-4"
            >
                <AccordionItem value="refund-details">
                    <AccordionTrigger>Refund Details</AccordionTrigger>
                    <AccordionContent>
                        <div>
                            <div className="mt-2">
                                <label className="block text-sm font-medium">
                                    Refund Amount
                                </label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    name="refundAmount"
                                    value={formData.refundAmount}
                                    onChange={handleInputChange}
                                />
                                {errors.refundAmount && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.refundAmount}
                                    </p>
                                )}
                            </div>

                            {/* Reason Dropdown */}
                            <div className="mt-2">
                                <label className="block text-sm font-medium">
                                    Reason
                                </label>
                                <select
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleSelectChange}
                                    className="block w-full mt-2 p-2 rounded text-white  bg-primary-black-90"
                                >
                                    {reasonOptions.map((reason) => (
                                        <option key={reason} value={reason}>
                                            {reason}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Note */}
                            <div className="mt-2">
                                <label className="block text-sm font-medium">
                                    Note
                                </label>
                                <Input
                                    type="text"
                                    name="note"
                                    placeholder={
                                        'Enter your note about this order refund.'
                                    }
                                    value={formData.note}
                                    onChange={handleInputChange}
                                />
                                {errors.note && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.note}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="mt-4">
                                <Button
                                    className={`w-full bg-primary-purple-90 hover:bg-primary-green-900 text-white border-none ${
                                        refundMutation.isPending
                                            ? 'animate-pulse cursor-not-allowed'
                                            : 'hover:cursor-pointer'
                                    }`}
                                    onClick={handleRefundSubmit}
                                    disabled={
                                        isSubmitDisabled &&
                                        refundMutation.isPending
                                    }
                                >
                                    Submit Refund
                                </Button>
                            </div>
                            {showSuccessMessage && (
                                <p className="text-green-600 font-medium mt-2">
                                    Refund completed in escrow
                                </p>
                            )}
                        </div>
                        <div className="mt-2">
                            <label className="block text-sm font-medium">
                                Amount Refunded: {refundedAmount.toString()}
                            </label>
                        </div>
                        <div className="mt-2">
                            <label className="block text-sm font-medium">
                                Refundable Amount: {refundableAmount.toString()}
                            </label>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default Refund;
