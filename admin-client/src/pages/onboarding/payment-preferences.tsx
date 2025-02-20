import React, { useState } from 'react';
import { Field } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { OnboardingSchema, type OnboardingValues } from './onboarding-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOnboardingByWalletId } from './api/create-store';
import SuccessDialog from './success-dialog';
import { useNavigate } from '@tanstack/react-router';
import { getJwtWalletAddress, setJwtCookie } from '@/utils/authentication';
import { useCustomerAuthStore } from '@/stores/authentication/customer-auth';

interface PaymentPreferencesProps {
    form: any;
    onUpdate: (updates: Partial<OnboardingValues>) => void;
    onBack: () => void;
}

const inputClass =
    'rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A]';

const PaymentPreferencesStep: React.FC<PaymentPreferencesProps> = ({
    form,
    onUpdate,
    onBack,
}) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
     const { authData, setCustomerAuthData } = useCustomerAuthStore();

    const updateOnboardingMutation = useMutation({
        mutationFn: async (payload: any) => {
            if (!payload || Object.keys(payload).length === 0) {
                console.log('Empty payload; skipping mutation.');
                throw new Error('No changes detected to update.');
            }
            return updateOnboardingByWalletId(payload);
        },
        onSuccess: (data: { token: string }) => {
            console.log('data : ', data);
            queryClient.invalidateQueries({ queryKey: ['sellerStoreDetails'] });
            toast({
                variant: 'default',
                title: 'Success',
                description: 'Onboarding completed successfully.',
            });
            setJwtCookie(data.token);
            setCustomerAuthData({
                token: data.token,
                wallet_address: getJwtWalletAddress() ?? '',
                is_verified: true,
                status: 'authenticated',
            });
            console.log("finish set cookie")
            setShowSuccessDialog(true);
        },
        onError: (error) => {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to complete onboarding.',
            });
            console.error('Update error:', error);
        },
    });

    const handleGoToDashboard = () => {
        navigate({
            to: '/dashboard',
        });
    };

    const handleSubmit = () => {
        const values = form.state.values;
        const result = OnboardingSchema.safeParse(values);
        if (!result.success) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description:
                    'Some fields are invalid. Please review and try again.',
            });
            console.error(result.error.formErrors.fieldErrors);
            return;
        }
        onUpdate(values);
        updateOnboardingMutation.mutate(values);
    };

    return (
        <div className="px-8 py-12">
            <Card className="bg-primary-black-90 border-[#040404]">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">
                        Payment Preferences
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-6">
                        {/* Protocol */}
                        <Field form={form} name="protocol">
                            {(field) => (
                                <div>
                                    <label className="block mb-2 text-white">
                                        Protocol
                                    </label>
                                    <Select
                                        value={
                                            typeof field.state.value ===
                                            'string'
                                                ? field.state.value
                                                : 'loadpipe'
                                        }
                                        onValueChange={(val) =>
                                            field.handleChange(val)
                                        }
                                    >
                                        <SelectTrigger className={inputClass}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="loadpipe">
                                                Loadpipe
                                            </SelectItem>
                                            <SelectItem value="other">
                                                Other
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </Field>

                        {/* Preferred Payment Cryptocurrencies */}
                        <label className="block text-white font-semibold">
                            Preferred Payment Cryptocurrencies
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                            {[
                                { name: 'cryptoBTC', label: 'Bitcoin (BTC)' },
                                { name: 'cryptoUSDT', label: 'USDT (Tether)' },
                                { name: 'cryptoETH', label: 'Ethereum (ETH)' },
                                {
                                    name: 'cryptoBNB',
                                    label: 'Binance Coin (BNB)',
                                },
                                {
                                    name: 'cryptoUSDC',
                                    label: 'USDC (USD Coin)',
                                },
                            ].map(({ name, label }) => (
                                <Field key={name} form={form} name={name}>
                                    {(field) => (
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={Boolean(
                                                    field.state.value
                                                )}
                                                onCheckedChange={(checked) =>
                                                    field.handleChange(checked)
                                                }
                                                className="text-white"
                                            />
                                            <span className="text-white">
                                                {label}
                                            </span>
                                        </div>
                                    )}
                                </Field>
                            ))}
                        </div>

                        {/* Payout Wallet Addresses */}
                        <label className="block text-white font-semibold mt-4">
                            Payout Wallet Addresses
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {[
                                {
                                    name: 'walletBTC',
                                    placeholder: 'Bitcoin (BTC)',
                                },
                                {
                                    name: 'walletUSDT',
                                    placeholder: 'USDT (Tether)',
                                },
                                {
                                    name: 'walletETH',
                                    placeholder: 'Ethereum (ETH)',
                                },
                                {
                                    name: 'walletBNB',
                                    placeholder: 'Binance Coin (BNB)',
                                },
                                {
                                    name: 'walletUSDC',
                                    placeholder: 'USDC (USD Coin)',
                                },
                            ].map(({ name, placeholder }) => (
                                <Field key={name} form={form} name={name}>
                                    {(field) => (
                                        <Input
                                            placeholder={placeholder}
                                            value={
                                                typeof field.state.value ===
                                                'string'
                                                    ? field.state.value
                                                    : ''
                                            }
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                            className={inputClass}
                                        />
                                    )}
                                </Field>
                            ))}
                        </div>

                        {/* Automatic Conversion Options */}
                        <div className="space-y-2">
                            <label className="font-sora font-normal text-[16px] text-white">
                                Automatic Conversion Options
                            </label>
                            <p className="text-sm text-gray-400">
                                Would you like to automatically convert received
                                cryptocurrencies into a preferred one?
                            </p>
                        </div>
                        <Field form={form} name="autoConvert">
                            {(field) => (
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 mb-[20px]">
                                        <Checkbox
                                            checked={Boolean(field.state.value)}
                                            onCheckedChange={(checked) =>
                                                field.handleChange(checked)
                                            }
                                            className="text-white"
                                        />
                                        <span className="text-white">
                                            Yes (please specify the preferred
                                            cryptocurrency)
                                        </span>
                                    </div>

                                    <div>
                                        <Field
                                            form={form}
                                            name="preferredCrypto"
                                        >
                                            {(cryptoField) => (
                                                <Input
                                                    placeholder="Ex. BTC"
                                                    value={
                                                        typeof cryptoField.state
                                                            .value === 'string'
                                                            ? cryptoField.state
                                                                  .value
                                                            : ''
                                                    }
                                                    onChange={(e) =>
                                                        cryptoField.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={
                                                        cryptoField.handleBlur
                                                    }
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-[10px] h-[42px] focus:ring-2 focus:ring-[#94D42A] mb-[20px]"
                                                />
                                            )}
                                        </Field>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            checked={!field.state.value}
                                            onCheckedChange={(
                                                checked: boolean
                                            ) => {
                                                if (checked) {
                                                    field.handleChange(false);
                                                }
                                            }}
                                            className="text-white"
                                        />
                                        <span className="text-white">
                                            No, I want to receive payments in
                                            the original cryptocurrency.
                                        </span>
                                    </div>
                                </div>
                            )}
                        </Field>

                        {/* Minimum Payout Threshold */}
                        <Field form={form} name="minimumPayoutThreshold">
                            {(field) => (
                                <div className="mt-4">
                                    <label className="block mb-2 text-white">
                                        Minimum Payout Threshold
                                    </label>
                                    <Select
                                        value={
                                            typeof field.state.value ===
                                            'string'
                                                ? field.state.value
                                                : 'daily'
                                        }
                                        onValueChange={(val) =>
                                            field.handleChange(val)
                                        }
                                    >
                                        <SelectTrigger className={inputClass}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="daily">
                                                Daily
                                            </SelectItem>
                                            <SelectItem value="weekly">
                                                Weekly
                                            </SelectItem>
                                            <SelectItem value="monthly">
                                                Monthly
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </Field>

                        {/* Payment Frequency */}
                        <Field form={form} name="paymentFrequency">
                            {(field) => (
                                <div className="mt-4">
                                    <label className="block mb-2 text-white">
                                        Payment Frequency
                                    </label>
                                    <Select
                                        value={
                                            typeof field.state.value ===
                                            'string'
                                                ? field.state.value
                                                : 'daily'
                                        }
                                        onValueChange={(val) =>
                                            field.handleChange(val)
                                        }
                                    >
                                        <SelectTrigger className={inputClass}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="daily">
                                                Daily
                                            </SelectItem>
                                            <SelectItem value="weekly">
                                                Weekly
                                            </SelectItem>
                                            <SelectItem value="monthly">
                                                Monthly
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </Field>

                        {/* Disclaimers */}
                        <div className="mt-4 space-y-6">
                            <Field form={form} name="confirmWalletDisclaimer">
                                {(field) => (
                                    <div className="flex items-start gap-2">
                                        <Checkbox
                                            checked={Boolean(field.state.value)}
                                            onCheckedChange={(checked) =>
                                                field.handleChange(checked)
                                            }
                                            className="text-white"
                                        />
                                        <span className="text-white text-sm">
                                            I confirm that the wallet addresses
                                            provided are correct and understand
                                            that cryptocurrency transactions are
                                            irreversible.
                                        </span>
                                    </div>
                                )}
                            </Field>
                            <Field form={form} name="agreeTermsDisclaimer">
                                {(field) => (
                                    <div className="flex items-start gap-2">
                                        <Checkbox
                                            checked={Boolean(field.state.value)}
                                            onCheckedChange={(checked) =>
                                                field.handleChange(checked)
                                            }
                                            className="text-white"
                                        />
                                        <span className="text-white text-sm">
                                            I agree to the platform’s terms and
                                            conditions regarding payment
                                            processing and payouts.
                                        </span>
                                    </div>
                                )}
                            </Field>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex justify-end space-x-4">
                        <Button
                            variant="ghost"
                            onClick={onBack}
                            className="border border-[#94D42A] text-[#94D42A] font-semibold rounded-[37px] px-4 py-2 w-24"
                        >
                            Back
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="bg-[#94D42A] text-black font-semibold px-6 py-2 rounded-full w-24"
                        >
                            Submit
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <SuccessDialog
                isOpen={showSuccessDialog}
                onClose={() => setShowSuccessDialog(false)}
                onGoToDashboard={handleGoToDashboard}
            />
        </div>
    );
};

export default PaymentPreferencesStep;

