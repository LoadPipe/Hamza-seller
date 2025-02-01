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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postSecure, putSecure } from '@/utils/api-calls';
import { useToast } from '@/hooks/use-toast';
import { refundEscrowPayment, getEscrowPayment } from '@/utils/order-escrow';
import { convertFromWeiToDisplay } from '@/utils/web3-conversions';
import { getCurrencyPrecision } from '@/currency.config';
import { formatStatus } from '@/utils/format-data';
import { getEscrowPaymentData } from '@/api/get-escrow-payment';
import { getChainId, getWalletAddress } from '@/web3';
import { EscrowPaymentDefinitionWithError } from '@/web3/contracts/escrow';
import { useSwitchChain } from 'wagmi';
import { ethers } from 'ethers';

type RefundProps = {
    refundAmount?: number;
    order: any;
};

const reasonOptions = ['discount', 'return', 'swap', 'claim', 'other'];

const Refund: React.FC<RefundProps> = ({ refundAmount, order }) => {
    const queryClient = useQueryClient();
    const { switchChain } = useSwitchChain();
    const [formData, setFormData] = useState({
        refundAmount: refundAmount || '',
        reason: reasonOptions[0], // Default to the first option
        note: '',
    });

    //get the payment
    const payment = order?.escrow_payment?.payment;
    let refundableAmount: BigInt = BigInt(0);
    let refundedAmount: BigInt = BigInt(0);

    //convert the amount & refundable amount
    if (payment) {
        refundedAmount = BigInt(payment.amountRefunded?.toString() ?? '0');
        refundableAmount =
            BigInt(payment.amount?.toString() ?? '0') -
            BigInt(payment.amountRefunded?.toString() ?? '0');
    }

    //convert refundable to displayable string
    const refundableAmountToDisplay = convertFromWeiToDisplay(
        refundableAmount.toString(),
        order?.currency_code,
        order?.escrow_payment?.chain_id
    );

    //convert refunded amount to displayable string
    const refundedAmountToDisplay = convertFromWeiToDisplay(
        refundedAmount.toString(),
        order?.currency_code,
        order?.escrow_payment?.chain_id
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
    const precision = getCurrencyPrecision(
        currencyCode,
        order?.escrow_payment?.chain_id
    );

    //convert the amount to db units
    const getDbAmount = (amount: string | number) => {
        console.log(
            'DB AMOIUNT IS,',
            Math.floor(parseFloat(amount.toString()) * 10 ** precision.db)
        );
        return Math.floor(parseFloat(amount.toString()) * 10 ** precision.db);
    };

    //convert the amount to wei for blockchain use
    const getBlockchainAmount = (amount: string | number) => {
        amount = parseFloat(amount.toString());
        let numPlaces = 0;
        while (amount.toString().indexOf('.') >= 0) {
            numPlaces += 1;
            amount *= 10;
        }
        const adjustmentFactor = Math.pow(10, precision.native - numPlaces);
        const nativeAmount = BigInt(amount) * BigInt(adjustmentFactor);
        return BigInt(nativeAmount);
    };

    //this mutation sends the refund request (createRefund) to the server (not the contract)
    const refundMutation = useMutation({
        mutationFn: async () => {
            const escrowPayment = await getEscrowPayment(order);
            console.log('escrow payment in mutation is', escrowPayment);

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

                console.log('escrowRefundResult is', escrowRefundResult);

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

                    //clear fields on success to prevent duplicate submissions
                    setFormData({
                        ...formData,
                        refundAmount: '',
                        note: '',
                    });

                    // Force refresh order details to update the refund status
                    queryClient.invalidateQueries({
                        queryKey: ['orderDetails', orderId],
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
                console.error(error);
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
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Refund Error',
                description: `Failed to process the refund; rejected by contract.`,
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

    //form validation
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

    const handleRefundSubmit = async () => {
        const address = await getWalletAddress();
        const userChainId = await getChainId();

        //get the escrow data (some validation is done on server side too)
        const payment: EscrowPaymentDefinitionWithError =
            await getEscrowPaymentData(
                order?.id,
                true,
                false,
                address,
                getBlockchainAmount(formData.refundAmount).toString()
            );

        if (!payment) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: `Escrow payment for order ${order?.id} not found`,
            });
        } else {
            if (payment.error?.length) {
                toast({
                    variant: 'destructive',
                    title: 'Validation Error',
                    description: payment.error,
                });
            } else {
                //switch chain id if necessary
                if (payment.chain_id != userChainId) {
                    switchChain({ chainId: payment.chain_id });
                }

                //validate, and send refund request to server
                if (validateForm()) {
                    refundMutation.mutate();
                }
            }
        }
    };

    return (
        <div>
            {/* Manual Refund Checkbox */}

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
                            <div className="flex flex-col mt-4 gap-3">
                                <label className="block text-sm font-medium">
                                    Refund Amount
                                </label>
                                <Input
                                    style={{
                                        backgroundColor: '#242424',
                                        height: '40px',
                                        border: 'none',
                                    }}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    name="refundAmount"
                                    value={formData.refundAmount}
                                    onChange={handleInputChange}
                                    disabled={
                                        order.payment_status === 'refunded' ||
                                        order.payment_status === 'canceled' ||
                                        order.payment_status === 'not_paid'
                                    }
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
                                <div className="relative">
                                    <select
                                        style={{
                                            backgroundColor: '#242424',
                                            height: '40px',
                                            backgroundImage:
                                                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E\")",
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: '10px center',
                                            backgroundSize: '12px',
                                            borderRadius: '6px',
                                        }}
                                        name="reason"
                                        value={formData.reason}
                                        onChange={handleSelectChange}
                                        className="block w-full mt-2 pl-10 rounded text-white appearance-none"
                                    >
                                        {reasonOptions.map((reason) => (
                                            <option key={reason} value={reason}>
                                                {reason}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Note */}
                            <div className="flex flex-col mt-2 gap-3">
                                <label className="block text-sm font-medium">
                                    Note
                                </label>
                                <Input
                                    type="text"
                                    name="note"
                                    style={{
                                        border: 'none',
                                        backgroundColor: '#242424',
                                        height: '40px',
                                    }}
                                    placeholder={
                                        'Enter your note about this order refund.'
                                    }
                                    value={formData.note}
                                    onChange={handleInputChange}
                                    disabled={
                                        order.payment_status === 'refunded' ||
                                        order.payment_status === 'canceled' ||
                                        order.payment_status === 'not_paid'
                                    }
                                />
                                {errors.note && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.note}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-row my-5 justify-evenly">
                                <label className="block text-sm font-medium">
                                    Amount Refunded:{' '}
                                    <span className="text-[#94d42a]">
                                        {refundedAmountToDisplay}
                                    </span>
                                </label>

                                <label className="block text-sm font-medium ">
                                    Refundable Amount:{' '}
                                    <span className="text-[#94d42a]">
                                        {refundableAmountToDisplay}
                                    </span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-4">
                                {order.payment_status === 'refunded' ||
                                order.payment_status === 'canceled' ||
                                order.payment_status === 'not_paid' ? (
                                    <div
                                        className="bg-sky-600 border border-sky-900 text-black px-4 py-3 rounded relative text-center"
                                        role="alert"
                                    >
                                        Cannot refund this payment status: (
                                        {formatStatus(order.payment_status)})
                                    </div>
                                ) : (
                                    <Button
                                        className={`w-full bg-primary-purple-90 hover:bg-primary-green-900 text-white border-none ${
                                            refundMutation.isPending
                                                ? 'animate-pulse cursor-not-allowed'
                                                : 'hover:cursor-pointer'
                                        }`}
                                        onClick={handleRefundSubmit}
                                        disabled={refundMutation.isPending}
                                    >
                                        {refundMutation.isPending
                                            ? 'Processing refund...'
                                            : 'Submit Refund'}
                                    </Button>
                                )}
                            </div>
                            {showSuccessMessage && (
                                <p className="text-green-600 font-medium mt-2">
                                    Refund completed in escrow
                                </p>
                            )}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default Refund;
