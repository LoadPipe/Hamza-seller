import React from 'react';
import { Field } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { OnboardingValues } from './onboarding-schema';

interface BusinessInformationProps {
    form: any;
    onUpdate: (updates: Partial<OnboardingValues>) => void;
    onNext: () => void;
}

const BusinessInformationStep: React.FC<BusinessInformationProps> = ({
    form,
    onUpdate,
    onNext,
}) => {
    const { toast } = useToast();

    const handleNext = () => {
        const { businessName, firstName, lastName, emailAddress } =
            form.state.values;

        if (!businessName) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Please enter a business name.',
            });
            return;
        }
        if (!firstName) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Please enter your first name.',
            });
            return;
        }
        if (!lastName) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Please enter your last name.',
            });
            return;
        }
        if (!emailAddress) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Please enter a valid email address.',
            });
            return;
        }

        onUpdate({ businessName, firstName, lastName, emailAddress });
        onNext();
    };

    <label className="block mt-4 text-white font-semibold">
        Owner Information
    </label>;

    return (
        <div className="px-8 py-12">
            <Card className="bg-primary-black-90 border-[#040404] mb-5">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">
                        Owner Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Field
                                form={form}
                                name="firstName"
                                validators={{
                                    onBlur: ({ value }) =>
                                        !value
                                            ? 'First name is required.'
                                            : undefined,
                                }}
                            >
                                {(field) => (
                                    <div>
                                        <label className="block mb-2 text-white">
                                            First Name
                                        </label>
                                        <Input
                                            placeholder="First Name"
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
                                            onBlur={field.handleBlur}
                                            className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                        />
                                        {field.state.meta.errors &&
                                            field.state.meta.errors.length >
                                                0 && (
                                                <span className="text-red-500 text-sm mt-1">
                                                    {field.state.meta.errors.join(
                                                        ', '
                                                    )}
                                                </span>
                                            )}
                                    </div>
                                )}
                            </Field>

                            <Field
                                form={form}
                                name="lastName"
                                validators={{
                                    onBlur: ({ value }) =>
                                        !value
                                            ? 'Last name is required.'
                                            : undefined,
                                }}
                            >
                                {(field) => (
                                    <div>
                                        <label className="block mb-2 text-white">
                                            Last Name
                                        </label>
                                        <Input
                                            placeholder="Last Name"
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
                                            onBlur={field.handleBlur}
                                            className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                        />
                                        {field.state.meta.errors &&
                                            field.state.meta.errors.length >
                                                0 && (
                                                <span className="text-red-500 text-sm mt-1">
                                                    {field.state.meta.errors.join(
                                                        ', '
                                                    )}
                                                </span>
                                            )}
                                    </div>
                                )}
                            </Field>

                            <Field
                                form={form}
                                name="emailAddress"
                                validators={{
                                    onBlur: ({ value }) =>
                                        !value
                                            ? 'Email address is required.'
                                            : undefined,
                                }}
                            >
                                {(field) => (
                                    <div>
                                        <label className="block mb-2 text-white">
                                            Email Address
                                        </label>
                                        <Input
                                            placeholder="Email Address"
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
                                            onBlur={field.handleBlur}
                                            className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                        />
                                        {field.state.meta.errors &&
                                            field.state.meta.errors.length >
                                                0 && (
                                                <span className="text-red-500 text-sm mt-1">
                                                    {field.state.meta.errors.join(
                                                        ', '
                                                    )}
                                                </span>
                                            )}
                                    </div>
                                )}
                            </Field>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-primary-black-90 border-[#040404]">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">
                        Business Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-6">
                        {/* Business Name */}
                        <Field
                            form={form}
                            name="businessName"
                            validators={{
                                onBlur: ({ value }) =>
                                    !value
                                        ? 'Please enter a business name.'
                                        : undefined,
                            }}
                        >
                            {(field) => (
                                <div>
                                    <label className="block mb-2 text-white">
                                        Business name
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
                                            field.handleChange(e.target.value)
                                        }
                                        onBlur={field.handleBlur}
                                        className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                    />
                                    {((field.state.meta.errors &&
                                        field.state.meta.errors.length > 0) ||
                                        (!field.state.value &&
                                            form.state.submitted)) && (
                                        <span className="text-red-500 text-sm mt-1">
                                            {field.state.meta.errors &&
                                            field.state.meta.errors.length > 0
                                                ? field.state.meta.errors.join(
                                                      ', '
                                                  )
                                                : 'This field is required.'}
                                        </span>
                                    )}
                                </div>
                            )}
                        </Field>

                        {/* Registration Number */}
                        <Field form={form} name="registrationNumber">
                            {(field) => (
                                <div>
                                    <label className="block mb-2 text-white">
                                        Business registration number
                                    </label>
                                    <Input
                                        placeholder="Ex. 0000 0000 0000"
                                        value={
                                            typeof field.state.value ===
                                            'string'
                                                ? field.state.value
                                                : ''
                                        }
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                    />
                                </div>
                            )}
                        </Field>

                        {/* Tax ID */}
                        <Field form={form} name="taxId">
                            {(field) => (
                                <div>
                                    <label className="block mb-2 text-white">
                                        Tax identification number
                                    </label>
                                    <Input
                                        placeholder="Ex. 0000 0000 0000"
                                        value={
                                            typeof field.state.value ===
                                            'string'
                                                ? field.state.value
                                                : ''
                                        }
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                    />
                                </div>
                            )}
                        </Field>

                        {/* Business Structure & Industry (Side by Side) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field form={form} name="businessStructure">
                                {(field) => (
                                    <div>
                                        <label className="block mb-2 text-white">
                                            Business Structure
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
                                                <SelectItem value="sole-proprietor">
                                                    Sole proprietorship
                                                </SelectItem>
                                                <SelectItem value="llc">
                                                    LLC
                                                </SelectItem>
                                                <SelectItem value="corporation">
                                                    Corporation
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </Field>

                            <Field form={form} name="industry">
                                {(field) => (
                                    <div>
                                        <label className="block mb-2 text-white">
                                            Industry
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
                                                <SelectItem value="retail">
                                                    Retail
                                                </SelectItem>
                                                <SelectItem value="tech">
                                                    Tech
                                                </SelectItem>
                                                <SelectItem value="finance">
                                                    Finance
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </Field>
                        </div>

                        {/* Business Registered Address */}
                        <label className="block mt-4 text-white font-semibold">
                            Business registered address
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field form={form} name="addressLine1">
                                {(field) => (
                                    <Input
                                        placeholder="Address line 1"
                                        value={
                                            typeof field.state.value ===
                                            'string'
                                                ? field.state.value
                                                : ''
                                        }
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                    />
                                )}
                            </Field>
                            <Field form={form} name="addressLine2">
                                {(field) => (
                                    <Input
                                        placeholder="Address line 2"
                                        value={
                                            typeof field.state.value ===
                                            'string'
                                                ? field.state.value
                                                : ''
                                        }
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                    />
                                )}
                            </Field>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field form={form} name="city">
                                {(field) => (
                                    <Input
                                        placeholder="City"
                                        value={
                                            typeof field.state.value ===
                                            'string'
                                                ? field.state.value
                                                : ''
                                        }
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                    />
                                )}
                            </Field>
                            <Field form={form} name="state">
                                {(field) => (
                                    <Input
                                        placeholder="State"
                                        value={
                                            typeof field.state.value ===
                                            'string'
                                                ? field.state.value
                                                : ''
                                        }
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                    />
                                )}
                            </Field>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field form={form} name="country">
                                {(field) => (
                                    <Input
                                        placeholder="Country"
                                        value={
                                            typeof field.state.value ===
                                            'string'
                                                ? field.state.value
                                                : ''
                                        }
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                    />
                                )}
                            </Field>
                            <Field form={form} name="zipCode">
                                {(field) => (
                                    <Input
                                        placeholder="Zip Code"
                                        value={
                                            typeof field.state.value ===
                                            'string'
                                                ? field.state.value
                                                : ''
                                        }
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                    />
                                )}
                            </Field>
                        </div>

                        {/* Primary Contact Person */}
                        <label className="block mt-4 text-white font-semibold">
                            Primary Contact Person
                        </label>
                        <Field form={form} name="primaryContactName">
                            {(field) => (
                                <Input
                                    placeholder="Name"
                                    value={
                                        typeof field.state.value === 'string'
                                            ? field.state.value
                                            : ''
                                    }
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A] mt-2"
                                />
                            )}
                        </Field>
                        <Field form={form} name="primaryContactEmail">
                            {(field) => (
                                <Input
                                    placeholder="Email"
                                    value={
                                        typeof field.state.value === 'string'
                                            ? field.state.value
                                            : ''
                                    }
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A] mt-2"
                                />
                            )}
                        </Field>
                        <Field form={form} name="primaryContactNumber">
                            {(field) => (
                                <Input
                                    placeholder="Contact number"
                                    value={
                                        typeof field.state.value === 'string'
                                            ? field.state.value
                                            : ''
                                    }
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A] mt-2"
                                />
                            )}
                        </Field>
                    </div>

                    {/* Next Button */}
                    <div className="mt-8 flex justify-end">
                        <Button
                            onClick={handleNext}
                            className="bg-[#94D42A] text-black font-semibold px-6 py-2 rounded-full"
                        >
                            Next
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BusinessInformationStep;
