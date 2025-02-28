import React, { useState } from 'react';
import { Field } from '@tanstack/react-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrashIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Member {
    firstName: string;
    lastName: string;
    email: string;
    walletAddress: string;
}

interface AddMemberPageProps {
    form: any;
    onFinish: () => void;
}

const AddMemberPage: React.FC<AddMemberPageProps> = ({ form, onFinish }) => {
    const [members, setMembers] = useState<Member[]>([]);
    const { toast } = useToast();

    const resetFormFields = () => {
        form.setFieldValue('memberFirstName', '');
        form.setFieldValue('memberLastName', '');
        form.setFieldValue('memberEmail', '');
        form.setFieldValue('memberWalletAddress', '');
    };

    const handleAddMember = () => {
        const { memberFirstName, memberLastName, memberEmail, memberWalletAddress } =
            form.state.values;

        if (!memberFirstName) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Please enter the first name for the member.',
            });
            return;
        }
        if (!memberLastName) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Please enter the last name for the member.',
            });
            return;
        }
        if (!memberEmail) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Please enter the email address for the member.',
            });
            return;
        }
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(memberEmail)) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Please enter a valid email address for the member.',
            });
            return;
        }
        if (!memberWalletAddress) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Please enter the wallet address for the member.',
            });
            return;
        }

        const newMember: Member = {
            firstName: memberFirstName,
            lastName: memberLastName,
            email: memberEmail,
            walletAddress: memberWalletAddress.toLowerCase(),
        };

        setMembers((prev) => [...prev, newMember]);
        resetFormFields();
    };

    const handleDeleteMember = (index: number) => {
        setMembers((prev) => prev.filter((_, i) => i !== index));
    };

    const handleFinish = () => {
        if (members.length === 0) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Please add at least one member or choose to skip.',
            });
            return;
        }
        form.setFieldValue('members', members);
        onFinish();
    };

    return (
        <div className="flex flex-col justify-center items-start h-full px-8 py-12">
            <Card className="bg-black border-none text-white w-full">
                <CardHeader className="mb-8">
                    <CardTitle className="mb-2 font-inter font-semibold text-[32px] leading-none tracking-normal">
                        Manage store team
                    </CardTitle>
                    <p className="text-gray-400 text-sm">
                        Add and manage admins or sellers for your store. Control who can access and run your shop on Hamza.
                    </p>
                </CardHeader>

                <CardContent>
                    {/* Display list of added members, if any */}
                    {members.length > 0 && (
                        <div className="mb-8">
                            <ul className="space-y-2">
                                {members.map((member, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center justify-between bg-[#242424] rounded-lg px-4 py-2"
                                    >
                                        <div>
                                            <span className="font-medium">
                                                {member.firstName} {member.lastName}
                                            </span>
                                            <span className="text-gray-400 text-sm ml-2">
                                                ({member.email})
                                            </span>
                                            <span className="text-gray-400 text-sm ml-2">
                                                - {member.walletAddress}
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            className="bg-transparent focus:bg-transparent text-white-400"
                                            onClick={() => handleDeleteMember(index)}
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Member Input Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <Field form={form} name="memberFirstName">
                            {(field) => (
                                <div>
                                    <label className="block mb-2 text-white">First Name</label>
                                    <Input
                                        placeholder="John"
                                        value={typeof field.state.value === 'string' ? field.state.value : ''}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className="rounded-lg bg-black text-white border border-white placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A] w-full"
                                    />
                                </div>
                            )}
                        </Field>

                        {/* Last Name */}
                        <Field form={form} name="memberLastName">
                            {(field) => (
                                <div>
                                    <label className="block mb-2 text-white">Last Name</label>
                                    <Input
                                        placeholder="Doe"
                                        value={typeof field.state.value === 'string' ? field.state.value : ''}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className="rounded-lg bg-black text-white border border-white placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A] w-full"
                                    />
                                </div>
                            )}
                        </Field>
                    </div>

                    {/* Email Address */}
                    <Field
                        form={form}
                        name="memberEmail"
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
                            <div className="mt-6 mb-8">
                                <label className="block mb-2 text-white">Email address</label>
                                <Input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={(field.state.value as string) || ""}
                                    onChange={(e) => field.handleChange(e.target.value)}
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


                    {/* New Wallet Address Field */}
                    <Field form={form} name="memberWalletAddress">
                        {(field) => (
                            <div className="mt-6 mb-8">
                                <label className="block mb-2 text-white">Wallet Address</label>
                                <Input
                                    type="text"
                                    placeholder="0x123..."
                                    value={(field.state.value as string) || ""}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className="rounded-lg bg-black text-white border border-white placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A] w-full"
                                />
                            </div>
                        )}
                    </Field>

                    {/* Action Buttons */}
                    <div className="mt-12 w-full grid grid-cols-2 gap-4">
                        <Button
                            onClick={handleAddMember}
                            className="bg-[#242424] text-white font-semibold px-6 py-3 rounded-full w-full h-12"
                        >
                            {members.length === 0 ? 'Add member' : 'Add another member'}
                        </Button>
                        <Button
                            onClick={handleFinish}
                            className="bg-[#94D42A] text-black font-semibold px-6 py-3 rounded-full w-full h-12"
                        >
                            Proceed
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddMemberPage;