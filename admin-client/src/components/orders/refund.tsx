import React, { useState } from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type RefundProps = {
    firstName: string;
    lastName: string;
    customerId: string;
    email: string;
    refundAmount?: number;
    date: string;
    orderId: string;
    reason?: string;
};

const Refund: React.FC<RefundProps> = ({
firstName,
lastName,
refundAmount,
customerId,
reason,
orderId,
date,
email,
}) => {
    const [manualRefund, setManualRefund] = useState(false);
    const [formData, setFormData] = useState({
        refundAmount: refundAmount || '',
        reason: reason || '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleToggle = () => {
        setManualRefund(!manualRefund);
    };

    const handleRefundSubmit = () => {
        console.log("Refund submitted:", { ...formData, manualRefund });
        // Add your refund submission logic here
    };

    console.log(`WOW NICE ${customerId} ${date}`)

    const isFormDisabled = !manualRefund && !refundAmount;

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold">Refund Management</h2>
            <div className="mt-4">
                <div className="flex items-center justify-between">
                    <span>Manual Refund</span>
                    <Switch checked={manualRefund} onChange={handleToggle} />
                </div>
            </div>
            <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="refund-details">
                    <AccordionTrigger className={isFormDisabled ? 'text-gray-400 cursor-not-allowed' : ''}>
                        Refund Details
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className={isFormDisabled ? 'opacity-50 pointer-events-none' : ''}>
                            <div className="mt-2">
                                <label className="block text-sm font-medium">Customer Name</label>
                                <Input value={`${firstName} ${lastName}`} disabled />
                            </div>
                            <div className="mt-2">
                                <label className="block text-sm font-medium">Email</label>
                                <Input value={email} disabled />
                            </div>
                            <div className="mt-2">
                                <label className="block text-sm font-medium">Order ID</label>
                                <Input value={orderId} disabled />
                            </div>
                            <div className="mt-2">
                                <label className="block text-sm font-medium">Refund Amount</label>
                                <Input
                                    type="number"
                                    name="refundAmount"
                                    value={formData.refundAmount}
                                    onChange={handleInputChange}
                                    disabled={isFormDisabled}
                                />
                            </div>
                            <div className="mt-2">
                                <label className="block text-sm font-medium">Reason</label>
                                <Input
                                    type="text"
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                    disabled={isFormDisabled}
                                />
                            </div>
                            <div className="mt-4">
                                <Button onClick={handleRefundSubmit} disabled={isFormDisabled}>
                                    Submit Refund
                                </Button>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default Refund;
