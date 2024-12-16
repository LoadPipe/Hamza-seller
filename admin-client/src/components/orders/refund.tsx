import React, { useState } from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { postSecure, putSecure } from '@/utils/api-calls';
import { useToast } from '@/hooks/use-toast';
import { refundEscrowPayment } from '@/utils/order-escrow.ts';

type RefundProps = {
    firstName: string;
    lastName: string;
    customerId: string;
    email: string;
    refundAmount?: number;
    date: string;
    orderId: string;
    order: any;
};

const reasonOptions = ['discount', 'return', 'swap', 'claim', 'other'];

const Refund: React.FC<RefundProps> = ({
    firstName,
    lastName,
    refundAmount,
    customerId,
    orderId,
    order,
    date,
    email,
}) => {
    const [manualRefund, setManualRefund] = useState(false);
    const [formData, setFormData] = useState({
        refundAmount: refundAmount || '',
        reason: reasonOptions[0], // Default to the first option
        note: '',
    });
    const [errors, setErrors] = useState({
        refundAmount: '',
        note: '',
    });
    const { toast } = useToast();

    // const currency_code = order?.items[0]?.currency_code;

    const refundMutation = useMutation({
        mutationFn: async () => {
            const payload = {
                order_id: orderId,
                amount: formData.refundAmount,
                reason: formData.reason,
                note: formData.note,
            };

            return await postSecure('/seller/order/refund', payload);
        },
        onSuccess: async (data) => {
            try {
                const { metadata } = data;

                let refundAmountInSmallestUnit = formData.refundAmount;

                const escrowRefundResult = await refundEscrowPayment(
                    order,
                    refundAmountInSmallestUnit
                );

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
                    // console.log('Escrow refund successful');
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

    const isSubmitDisabled =
        !manualRefund || !!errors.refundAmount || !!errors.note;

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold">Refund Management</h2>

            {/* Date Field */}
            {!manualRefund && (
                <div className="mt-4">
                    <label className="block text-sm font-medium">Date</label>
                    <Input value={date} disabled className="mt-2" />
                </div>
            )}

            {/* Manual Refund Checkbox */}
            <div className="mt-4">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="manual-refund"
                        checked={manualRefund}
                        onChange={() => setManualRefund(!manualRefund)}
                        className="mr-2"
                    />
                    <label htmlFor="manual-refund" className="text-sm">
                        Manual Refund
                    </label>
                </div>
            </div>

            {/* Accordion for Refund Details */}
            <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="refund-details">
                    <AccordionTrigger
                        className={
                            manualRefund
                                ? ''
                                : 'text-gray-400 cursor-not-allowed'
                        }
                    >
                        Refund Details
                    </AccordionTrigger>
                    <AccordionContent>
                        <div
                            className={
                                manualRefund
                                    ? ''
                                    : 'opacity-50 pointer-events-none'
                            }
                        >
                            {/* Customer Name */}
                            <div className="mt-2">
                                <label className="block text-sm font-medium">
                                    Customer Name
                                </label>
                                <Input
                                    value={`${firstName} ${lastName}`}
                                    disabled
                                />
                            </div>

                            {/* Email */}
                            <div className="mt-2">
                                <label className="block text-sm font-medium">
                                    Email
                                </label>
                                <Input value={email} disabled />
                            </div>

                            {/* Order ID */}
                            <div className="mt-2">
                                <label className="block text-sm font-medium">
                                    Order ID
                                </label>
                                <Input value={orderId} disabled />
                            </div>

                            {/* Customer ID */}
                            <div className="mt-2">
                                <label className="block text-sm font-medium">
                                    Customer ID
                                </label>
                                <Input value={customerId} disabled />
                            </div>

                            {/* Refund Amount */}
                            <div className="mt-2">
                                <label className="block text-sm font-medium">
                                    Refund Amount
                                </label>
                                <Input
                                    type="number"
                                    step="0.01"
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
                                    className="block w-full mt-2 p-2 border rounded text-white  bg-primary-black-90"
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
                                    onClick={handleRefundSubmit}
                                    disabled={isSubmitDisabled}
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
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default Refund;
