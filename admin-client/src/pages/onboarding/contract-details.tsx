import React from 'react';
import { Field } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
        const { firstName, lastName, emailAddress } = form.state.values;

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

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(emailAddress)) {
          toast({
            variant: 'destructive',
            title: 'Validation Error',
            description: 'Please enter a valid email address.',
          });
          return;
        }
        
        onUpdate({ firstName, lastName, emailAddress });
        onNext();
    };

    return (
        <div>
            {/* Contact Details Card */}
            <Card className="bg-black border-none mb-5">
                <CardHeader>
                    <CardTitle className="mb-2 font-inter font-semibold text-[32px] leading-none tracking-normal">Contact Details</CardTitle>
                    <p className="text-gray-400 text-sm">
                        Provide your contact details so we can reach you for updates and support.
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <Field
                            form={form}
                            name="firstName"
                            validators={{
                                onBlur: ({ value }) =>
                                    !value ? "First name is required." : undefined,
                            }}
                        >
                            {(field) => (
                                <div>
                                    <label className="block mb-2 text-white">First Name</label>
                                    <Input
                                        placeholder="First Name"
                                        value={typeof field.state.value === "string" ? field.state.value : ""}
                                        onChange={(e) => field.handleChange(e.target.value)}
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

                        {/* Last Name */}
                        <Field
                            form={form}
                            name="lastName"
                            validators={{
                                onBlur: ({ value }) =>
                                    !value ? "Last name is required." : undefined,
                            }}
                        >
                            {(field) => (
                                <div>
                                    <label className="block mb-2 text-white">Last Name</label>
                                    <Input
                                        placeholder="Last Name"
                                        value={typeof field.state.value === "string" ? field.state.value : ""}
                                        onChange={(e) => field.handleChange(e.target.value)}
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

                        {/* Email Address */}
                        <Field
                            form={form}
                            name="emailAddress"
                            validators={{
                                onBlur: ({ value }) => {
                                    const email = value as string;
                                    if (!email) return "Email address is required.";
                                    const emailRegex = /\S+@\S+\.\S+/;
                                    if (!emailRegex.test(email)) return "A valid email is required.";
                                    return undefined;
                                },
                            }}
                        >
                            {(field) => (
                                <div className="md:col-span-2">
                                    <label className="block mb-2 text-white">Email Address</label>
                                    <Input
                                        type="email"
                                        placeholder="Email Address"
                                        value={(field.state.value as string) || ""}
                                        onChange={(e) => field.handleChange(e.target.value)}
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

                    {/* Continue Button */}
                    <div className="mt-8">
                        <Button
                            onClick={handleNext}
                            className="w-full h-10 bg-[#94D42A] text-black font-semibold px-6 py-2 rounded-full"
                        >
                            Continue
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BusinessInformationStep;
