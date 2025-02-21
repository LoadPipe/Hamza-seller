import React, { useState } from 'react';
import { Field } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { OnboardingValues } from './onboarding-schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    onBack: () => void;
}

const generateHandle = (name: string) =>
    name.toLowerCase().trim().replace(/\s+/g, '-');

const StoreCustomizationStep: React.FC<StoreCustomizationProps> = ({
    form,
    onUpdate,
    onNext,
    onBack,
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
        <div className="px-8 py-12">
            <Card className="bg-primary-black-90 border-[#040404]">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">
                        Store Customization
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-6">
                        {/* Store Name */}
                        <Field
                            form={form}
                            name="storeName"
                            validators={{
                                onBlur: ({ value }) =>
                                    !value
                                        ? 'Store name is required.'
                                        : undefined,
                            }}
                        >
                            {(field) => (
                                <div>
                                    <label className="block mb-2 text-white">
                                        Store name
                                    </label>
                                    <Input
                                        placeholder="Ex. Lily's Clothing"
                                        value={
                                            typeof field.state.value ===
                                            'string'
                                                ? field.state.value
                                                : ''
                                        }
                                        onChange={(e) =>
                                            handleStoreNameChange(
                                                e.target.value,
                                                field
                                            )
                                        }
                                        onBlur={field.handleBlur}
                                        className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                    />
                                    {field.state.meta.errors &&
                                        field.state.meta.errors.length > 0 && (
                                            <span className="text-red-500 text-sm mt-1">
                                                {field.state.meta.errors.join(
                                                    ', '
                                                )}
                                            </span>
                                        )}
                                </div>
                            )}
                        </Field>

                        {/* Handle Field (Editable) */}
                        <Field form={form} name="handle">
                            {(field) => (
                                <div>
                                    <label className="block mb-2 text-white">
                                        Handle
                                    </label>
                                    <Input
                                        placeholder="Auto-generated handle"
                                        value={
                                            typeof field.state.value ===
                                            'string'
                                                ? field.state.value
                                                : ''
                                        }
                                        onChange={(e) => {
                                            field.handleChange(e.target.value);
                                            setHandleEdited(true);
                                        }}
                                        onBlur={field.handleBlur}
                                        className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                    />
                                    {field.state.meta.errors &&
                                        field.state.meta.errors.length > 0 && (
                                            <span className="text-red-500 text-sm mt-1">
                                                {field.state.meta.errors.join(
                                                    ', '
                                                )}
                                            </span>
                                        )}
                                </div>
                            )}
                        </Field>

                        {/* Upload Logo Placeholder */}
                        <div>
                            <label className="block mb-2 text-white">
                                Upload logo
                            </label>
                            <div
                                className="border border-gray-500 rounded-[12px] p-[24px] text-center mt-[8px]"
                                style={{ height: '184px' }}
                            >
                                <p className="text-sm text-[#94D42A] font-semibold">
                                    Drag and drop or click to upload
                                </p>
                                <p className="text-xs text-gray-400">
                                    Recommended size: 350 x 350. File types:
                                    JPG, PNG, SVG or PNG.
                                </p>
                            </div>
                        </div>

                        {/* Store Description */}
                        <Field
                            form={form}
                            name="storeDescription"
                            validators={{
                                onBlur: ({ value }) =>
                                    !value
                                        ? 'Store description is required.'
                                        : undefined,
                            }}
                        >
                            {(field) => (
                                <div>
                                    <label className="block mb-2 text-white">
                                        Store description
                                    </label>
                                    <Textarea
                                        placeholder="Provide a brief description of your business..."
                                        value={
                                            typeof field.state.value ===
                                            'string'
                                                ? field.state.value
                                                : ''
                                        }
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        onBlur={field.handleBlur}
                                        className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 focus:ring-2 focus:ring-[#94D42A]"
                                        style={{ minHeight: '120px' }}
                                    />
                                    {field.state.meta.errors &&
                                        field.state.meta.errors.length > 0 && (
                                            <span className="text-red-500 text-sm mt-1">
                                                {field.state.meta.errors.join(
                                                    ', '
                                                )}
                                            </span>
                                        )}
                                </div>
                            )}
                        </Field>

                        {/* Mobile Number & Store Email (side by side) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Field form={form} name="mobileNumber">
                                {(field) => (
                                    <div>
                                        <label className="block mb-2 text-white">
                                            Mobile number
                                        </label>
                                        <Input
                                            placeholder="Ex. 0123-456-789"
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
                                            className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                        />
                                    </div>
                                )}
                            </Field>
                            <Field form={form} name="storeEmail">
                                {(field) => (
                                    <div>
                                        <label className="block mb-2 text-white">
                                            Email
                                        </label>
                                        <Input
                                            placeholder="Ex. abc@xyz.com"
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
                                            className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                        />
                                    </div>
                                )}
                            </Field>
                        </div>

                        <Field form={form} name="defaultCurrencyCode">
                            {(field) => (
                                <div>
                                    <label className="block mb-2 text-white">
                                        Default Currency
                                    </label>
                                    <Select
                                        value={
                                            typeof field.state.value ===
                                            'string'
                                                ? field.state.value
                                                : ''
                                        }
                                        onValueChange={(val) =>
                                            field.handleChange(val)
                                        }
                                    >
                                        <SelectTrigger className="rounded-lg bg-black text-white border-[#040404] px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="eth">
                                                ETH
                                            </SelectItem>
                                            <SelectItem value="usdt">
                                                USDT
                                            </SelectItem>
                                            <SelectItem value="usdc">
                                                USDC
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </Field>

                        {/* Store Category */}
                        <label className="block mt-4 text-white font-semibold">
                            Store Category
                        </label>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6 items-start">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-6 items-start">
                                <Field form={form} name="categoryElectronics">
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
                                                Electronics
                                            </span>
                                        </div>
                                    )}
                                </Field>
                                <Field form={form} name="categoryFashion">
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
                                                Fashion
                                            </span>
                                        </div>
                                    )}
                                </Field>
                                <Field form={form} name="categoryHomeGarden">
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
                                                Home &amp; Garden
                                            </span>
                                        </div>
                                    )}
                                </Field>
                                <Field
                                    form={form}
                                    name="categorySportsOutdoors"
                                >
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
                                                Sports &amp; Outdoors
                                            </span>
                                        </div>
                                    )}
                                </Field>
                                <Field form={form} name="categoryDigitalGoods">
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
                                                Digital Goods
                                            </span>
                                        </div>
                                    )}
                                </Field>
                                <Field
                                    form={form}
                                    name="categoryArtCollectibles"
                                >
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
                                                Art &amp; Collectibles
                                            </span>
                                        </div>
                                    )}
                                </Field>
                            </div>
                            <div className="col-span-2">
                                <Field form={form} name="otherCategory">
                                    {(field) => (
                                        <Input
                                            placeholder="Others (please specify)"
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
                                            className="w-full rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                        />
                                    )}
                                </Field>
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <label className="block mt-4 text-white font-semibold">
                            Social media links
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <Field form={form} name="facebook">
                                {(field) => (
                                    <Input
                                        placeholder="Facebook"
                                        value={
                                            typeof field.state.value ===
                                            'string'
                                                ? field.state.value
                                                : ''
                                        }
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 focus:ring-2 focus:ring-[#94D42A]"
                                    />
                                )}
                            </Field>
                            <Field form={form} name="linkedIn">
                                {(field) => (
                                    <Input
                                        placeholder="LinkedIn"
                                        value={
                                            typeof field.state.value ===
                                            'string'
                                                ? field.state.value
                                                : ''
                                        }
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 focus:ring-2 focus:ring-[#94D42A]"
                                    />
                                )}
                            </Field>
                            <Field form={form} name="x">
                                {(field) => (
                                    <Input
                                        placeholder="X"
                                        value={
                                            typeof field.state.value ===
                                            'string'
                                                ? field.state.value
                                                : ''
                                        }
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 focus:ring-2 focus:ring-[#94D42A]"
                                    />
                                )}
                            </Field>
                            <Field form={form} name="instagram">
                                {(field) => (
                                    <Input
                                        placeholder="Instagram"
                                        value={
                                            typeof field.state.value ===
                                            'string'
                                                ? field.state.value
                                                : ''
                                        }
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 focus:ring-2 focus:ring-[#94D42A]"
                                    />
                                )}
                            </Field>
                            <Field form={form} name="otherSocial">
                                {(field) => (
                                    <Input
                                        placeholder="Others"
                                        value={
                                            typeof field.state.value ===
                                            'string'
                                                ? field.state.value
                                                : ''
                                        }
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 focus:ring-2 focus:ring-[#94D42A]"
                                    />
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
                            onClick={handleNext}
                            className="bg-[#94D42A] text-black font-semibold px-6 py-2 rounded-full w-24"
                        >
                            Next
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StoreCustomizationStep;
