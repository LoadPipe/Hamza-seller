import React, { useState } from 'react';
import { Field } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { OnboardingValues } from './onboarding-schema';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

const StoreCustomizationSchema = z.object({
    storeName: z.string().min(1, { message: 'Store name is required.' }),
    storeDescription: z
        .string()
        .min(1, { message: 'Store description is required.' }),
});

interface StoreCustomizationProps {
    form: any;
    onUpdate: (updates: Partial<OnboardingValues>) => void;
    onNext: () => void;
}

const generateHandle = (name: string) =>
    name.toLowerCase().trim().replace(/\s+/g, '-');

const StoreCustomizationStep: React.FC<StoreCustomizationProps> = ({
    form,
    onUpdate,
    onNext,
}) => {
    const { toast } = useToast();
    const [handleEdited, setHandleEdited] = useState(false);

    const handleStoreNameChange = (value: string, field: any) => {
        field.handleChange(value);
        if (!handleEdited) {
            form.setFieldValue('handle', generateHandle(value));
        }
    };

    const handleNext = () => {
        const { storeName, storeDescription } = form.state.values;
        const result = StoreCustomizationSchema.safeParse({
            storeName,
            storeDescription,
        });
        if (!result.success) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description:
                    result.error.issues[0]?.message || 'Please fix errors.',
            });
            return;
        }
        onUpdate({ storeName, storeDescription });
        onNext();
    };

    return (
        <div>
            <Card className="bg-black border-none">
                <CardHeader>
                    <CardTitle className="mb-2 font-inter font-semibold text-[32px] leading-none tracking-normal">
                        Store details
                    </CardTitle>
                    <p className="text-gray-400 text-sm">
                        Provide your store’s name, URL, and essential details to get your
                        shop up and running on Hamza.
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-6">
                        {/* Store Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Store Name */}
                            <Field
                                form={form}
                                name="storeName"
                                validators={{
                                    onBlur: ({ value }) =>
                                        !value ? 'Store name is required.' : undefined,
                                }}
                            >
                                {(field) => (
                                    <div>
                                        <label className="block mb-2 text-white">Store Name</label>
                                        <Input
                                            placeholder="Ex. Lily's Clothing"
                                            value={
                                                typeof field.state.value === 'string'
                                                    ? field.state.value
                                                    : ''
                                            }
                                            onChange={(e) =>
                                                handleStoreNameChange(e.target.value, field)
                                            }
                                            onBlur={field.handleBlur}
                                            className="rounded-lg bg-black text-white border border-white
                                                        placeholder-gray-500 px-4 py-2 h-[42px]
                                                        focus:ring-2 focus:ring-[#94D42A] w-full"
                                        />
                                        {field.state.meta.errors &&
                                            field.state.meta.errors.length > 0 && (
                                                <span className="text-red-500 text-sm mt-1">
                                                    {field.state.meta.errors.join(', ')}
                                                </span>
                                            )}
                                    </div>
                                )}
                            </Field>

                            {/* Store Handle */}
                            <Field
                                form={form}
                                name="handle"
                                validators={{
                                    onBlur: ({ value }) => {
                                        if (!value) return 'Store handle is required.';
                                        return /^[a-zA-Z0-9-]+$/.test(String(value))
                                            ? undefined
                                            : 'Only alphanumerics and "-" are allowed.';
                                    },
                                }}
                            >
                                {(field) => (
                                    <div>
                                        <label className="block mb-2 text-white flex items-center gap-2">
                                            Store Handle
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="text-gray-400 hover:text-white cursor-pointer">
                                                        <Info size={16} />
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent side="bottom" align="end" className='p-0 rounded-[4px] bg-[#272727]'>
                                                    <div className="flex flex-row justify-center items-center p-[10px] gap-2 bg-[#272727] rounded-[4px] max-w-[276.8px]">
                                                        <p className="font-sora font-normal text-sm leading-[18px] text-white">
                                                            Choose a short name for your store. It will be part of your store’s website link. Use only letters,
                                                            numbers, or dashes (no spaces). Example: <em>lilysclothing</em> or <em>lilys-clothing</em>.
                                                        </p>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </label>
                                        <Input
                                            placeholder="Auto-generated handle"
                                            value={
                                                typeof field.state.value === 'string' ? field.state.value : ''
                                            }
                                            onChange={(e) => {
                                                field.handleChange(e.target.value)
                                                setHandleEdited(true)
                                            }}
                                            onBlur={field.handleBlur}
                                            className="rounded-lg bg-black text-white border border-white
                                                        placeholder-gray-500 px-4 py-2 h-[42px]
                                                        focus:ring-2 focus:ring-[#94D42A] w-full"
                                        />
                                        {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                                            <span className="text-red-500 text-sm mt-1">
                                                {field.state.meta.errors.join(', ')}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </Field>


                        </div>


                        {/* Default Currency */}
                        <Field form={form} name="defaultCurrencyCode">
                            {(field) => (
                                <div>
                                    <label className="block mb-2 text-white">
                                        Default Currency
                                    </label>
                                    <Select
                                        value={
                                            typeof field.state.value === 'string'
                                                ? field.state.value
                                                : ''
                                        }
                                        onValueChange={(val) => field.handleChange(val)}
                                    >
                                        <SelectTrigger className="rounded-lg bg-black text-white border border-white px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A]">
                                            <SelectValue placeholder="Choose a currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="eth">ETH</SelectItem>
                                            <SelectItem value="usdt">USDT</SelectItem>
                                            <SelectItem value="usdc">USDC</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </Field>

                        {/* Store Description */}
                        <Field
                            form={form}
                            name="storeDescription"
                            validators={{
                                onBlur: ({ value }) =>
                                    !value ? 'Store description is required.' : undefined,
                            }}
                        >
                            {(field) => (
                                <div>
                                    <label className="block mb-2 text-white">
                                        Store Description
                                    </label>
                                    <Textarea
                                        placeholder="Provide a brief description of your business..."
                                        value={
                                            typeof field.state.value === 'string'
                                                ? field.state.value
                                                : ''
                                        }
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        className="rounded-lg bg-black text-white border border-white
                                                    placeholder-gray-500 px-4 py-2 focus:ring-2 
                                                    focus:ring-[#94D42A] w-full"
                                        style={{ minHeight: '120px' }}
                                    />
                                    {field.state.meta.errors &&
                                        field.state.meta.errors.length > 0 && (
                                            <span className="text-red-500 text-sm mt-1">
                                                {field.state.meta.errors.join(', ')}
                                            </span>
                                        )}
                                </div>
                            )}
                        </Field>
                    </div>

                    {/* Action Button */}
                    <div className="mt-8">
                        <Button
                            onClick={handleNext}
                            className="bg-[#94D42A] w-full h-10 text-black font-semibold px-6 py-2 rounded-full "
                        >
                            Proceed
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
};

export default StoreCustomizationStep;
