import React from 'react';
import { Field } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { OnboardingValues } from '../onboarding-schema';

interface ProductAmountStepProps {
    form: any;
    onUpdate: (updates: Partial<OnboardingValues>) => void;
    onNext: () => void;
    onBack: () => void;
}

const ProductAmountStep: React.FC<ProductAmountStepProps> = ({
    form,
    onUpdate,
    onNext,
}) => {
    const { toast } = useToast();

    const handleNext = () => {
        const {
            productPrice,
            productSKU,
            productQuantity,
            productBarcode,
            productUPC,
            productEAN,
        } = form.state.values;

        if (!productPrice) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Please enter a price.',
            });
            return;
        }
        if (!productQuantity && productQuantity !== 0) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Please enter a quantity.',
            });
            return;
        }

        onUpdate({
            productPrice,
            productSKU,
            productQuantity,
            productBarcode,
            productUPC,
            productEAN,
        });
        onNext();
    };

    return (
        <div>
            <Card className="bg-black border-none">
                <CardHeader>
                    <CardTitle className="mb-2 font-inter font-semibold text-[32px] leading-none tracking-normal">
                        Add first product
                    </CardTitle>
                    <p className="text-gray-400 text-sm">
                        Start selling on Hamza by adding your first product. Upload images,
                        set prices, and provide details to attract customers.
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-6">
                        {/* Price */}
                        <Field
                            form={form}
                            name="productPrice"
                            validators={{
                                onBlur: ({ value }) => {
                                    const strValue = value as string;
                                    if (!strValue) return 'Price is required.';
                                    const numValue = parseFloat(strValue);
                                    if (isNaN(numValue)) return 'Please enter a valid number.';
                                    return undefined;
                                },
                            }}
                        >
                            {(field) => (
                                <div>
                                    <label className="block mb-2 text-white">
                                        Price in (
                                        {typeof form.state.values.defaultCurrencyCode === 'string'
                                            ? form.state.values.defaultCurrencyCode.toUpperCase()
                                            : 'ETH'}
                                        )
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="0.000000"
                                        value={field.state.value ? String(field.state.value) : ''}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === '' || /^(\d+(\.\d*)?|\.\d+)$/.test(value)) {
                                                field.handleChange(value);
                                            }
                                        }}
                                        onBlur={field.handleBlur}
                                        className="rounded-lg bg-black text-white border border-white placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A] w-full"
                                    />
                                    {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                                        <span className="text-red-500 text-sm mt-1">
                                            {field.state.meta.errors.join(', ')}
                                        </span>
                                    )}
                                </div>
                            )}
                        </Field>

                        {/* SKU & Quantity */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* SKU (Optional) */}
                            <Field
                                form={form}
                                name="productSKU"
                            >
                                {(field) => (
                                    <div>
                                        <label className="block mb-2 text-white">SKU (optional)</label>
                                        <Input
                                            placeholder="Ex. ST-001"
                                            value={
                                                typeof field.state.value === 'string'
                                                    ? field.state.value
                                                    : ''
                                            }
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            className="rounded-lg bg-black text-white border border-white placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A] w-full"
                                        />
                                    </div>
                                )}
                            </Field>

                            {/* Quantity (Required) */}
                            <Field
                                form={form}
                                name="productQuantity"
                                validators={{
                                    onBlur: ({ value }) =>
                                        !value && value !== 0 ? 'Quantity is required.' : undefined,
                                }}
                            >
                                {(field) => (
                                    <div>
                                        <label className="block mb-2 text-white">Quantity</label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={typeof field.state.value === 'number' ? String(field.state.value) : ''}
                                            onChange={(e) => {
                                                const numValue = parseInt(e.target.value, 10);
                                                field.handleChange(isNaN(numValue) ? 0 : numValue);
                                            }}
                                            onBlur={field.handleBlur}
                                            className="rounded-lg bg-black text-white border border-white placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A] w-full"
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

                        {/* Additional Fields: Barcode, UPC, EAN (all optional) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Barcode */}
                            <Field form={form} name="productBarcode">
                                {(field) => (
                                    <div>
                                        <label className="block mb-2 text-white">Barcode (optional)</label>
                                        <Input
                                            placeholder="Ex. 123456789"
                                            value={
                                                typeof field.state.value === 'string'
                                                    ? field.state.value
                                                    : ''
                                            }
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            className="rounded-lg bg-black text-white border border-white placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A] w-full"
                                        />
                                    </div>
                                )}
                            </Field>

                            {/* UPC */}
                            <Field form={form} name="productUPC">
                                {(field) => (
                                    <div>
                                        <label className="block mb-2 text-white">UPC (optional)</label>
                                        <Input
                                            placeholder="Ex. 0987654321"
                                            value={
                                                typeof field.state.value === 'string'
                                                    ? field.state.value
                                                    : ''
                                            }
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            className="rounded-lg bg-black text-white border border-white placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A] w-full"
                                        />
                                    </div>
                                )}
                            </Field>

                            {/* EAN */}
                            <Field form={form} name="productEAN">
                                {(field) => (
                                    <div>
                                        <label className="block mb-2 text-white">EAN (optional)</label>
                                        <Input
                                            placeholder="Ex. 0123456789123"
                                            value={
                                                typeof field.state.value === 'string'
                                                    ? field.state.value
                                                    : ''
                                            }
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            className="rounded-lg bg-black text-white border border-white placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A] w-full"
                                        />
                                    </div>
                                )}
                            </Field>
                        </div>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex items-center justify-center space-x-2 mt-6">
                        <div className="w-3 h-3 rounded-full bg-gray-600" />
                        <div className="w-3 h-3 rounded-full bg-[#94D42A]" />
                        <div className="w-3 h-3 rounded-full bg-gray-600" />
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex space-x-4">
                        <Button
                            onClick={handleNext}
                            className="w-full h-10 bg-[#94D42A] text-black font-semibold px-6 py-2 rounded-full"
                        >
                            Next
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProductAmountStep;
