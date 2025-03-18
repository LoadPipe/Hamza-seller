import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { sellerStoreDetailsQuery } from '@/pages/settings/api/store-details-query.ts';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { SettingsSchema } from '@/pages/settings/settings-schema';
import { useState } from 'react';
import { updateSettingsByWalletId } from '@/pages/settings/api/update-setting-by-id';
import LogoUpload from './logo-upload';

type Settings = z.infer<typeof SettingsSchema>;

export default function SettingsPage() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { data, isLoading, error } = useQuery({
        queryKey: ['sellerStoreDetails'],
        queryFn: () => sellerStoreDetailsQuery(),
    });

    const [showErrors, setShowErrors] = useState(false);
    const [logoUrl, setLogoUrl] = useState<string | undefined>(data?.icon);

    const defaultValues = {
        // Account Information
        firstName: data?.first_name || '',
        lastName: data?.last_name || '',
        phoneNumber: data?.phoneNumber || '',
        emailAddress: data?.email || '',

        // Business Information
        businessName: data?.businessName || '',
        registrationNumber: data?.registrationNumber || '',
        taxId: data?.taxId || '',
        businessStructure: data?.businessStructure || 'sole-proprietor',
        industry: data?.industry || 'retail',
        addressLine1: data?.addressLine1 || '',
        addressLine2: data?.addressLine2 || '',
        city: data?.city || '',
        state: data?.state || '',
        country: data?.country || '',
        zipCode: data?.zipCode || '',
        primaryContactName: data?.primaryContactName || '',
        primaryContactEmail: data?.primaryContactEmail || '',
        primaryContactNumber: data?.primaryContactNumber || '',
        preferredCurrency: data?.default_currency_code || 'eth',

        // Store Information
        storeName: data?.name || '',
        storeDescription: data?.store_description || '',
        icon: data?.icon || '',

        // Store Category
        categoryElectronics: data?.categoryElectronics || false,
        categoryFashion: data?.categoryFashion || false,
        categoryHomeGarden: data?.categoryHomeGarden || false,
        categoryHealthBeauty: data?.categoryHealthBeauty || false,
        categorySportsOutdoors: data?.categorySportsOutdoors || false,
        categoryDigitalGoods: data?.categoryDigitalGoods || false,
        categoryArtCollectibles: data?.categoryArtCollectibles || false,
        otherCategory: data?.otherCategory || '',

        // Social Media Links
        facebook: data?.facebook || '',
        linkedIn: data?.linkedIn || '',
        x: data?.x || '',
        instagram: data?.instagram || '',
        otherSocial: data?.otherSocial || '',

        // Wallet/Payments Settings
        protocol: data?.protocol || 'loadpipe',

        // Preferred payment cryptos (flattened)
        cryptoBTC: data?.cryptoBTC || false,
        cryptoUSDT: data?.cryptoUSDT || false,
        cryptoETH: data?.cryptoETH || false,
        cryptoBNB: data?.cryptoBNB || false,
        cryptoUSDC: data?.cryptoUSDC || false,

        // Payout wallet addresses (flattened)
        walletBTC: data?.walletBTC || '',
        walletUSDT: data?.walletUSDT || '',
        walletETH: data?.walletETH || '',
        walletBNB: data?.walletBNB || '',
        walletUSDC: data?.walletUSDC || '',

        autoConvert: data?.autoConvert || false,
        preferredCrypto: data?.preferredCrypto || '',
        minimumPayoutThreshold: data?.minimumPayoutThreshold || 'daily',
        paymentFrequency: data?.paymentFrequency || 'daily',
    };

    const settingsForm = useForm<Settings>({ defaultValues });

    const updateSettingsMutation = useMutation({
        mutationFn: async (payload: any) => {
            if (!payload || Object.keys(payload).length === 0) {
                console.log('Empty payload; skipping mutation.');
                throw new Error('No changes detected to update.');
            }
            // console.log(`PAYLOAD: ${JSON.stringify(payload)}`);
            return updateSettingsByWalletId(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sellerStoreDetails'] });
            toast({
                variant: 'default',
                title: 'Success',
                description: 'Settings updated successfully.',
            });
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to update product.',
            });
            console.error('Failed to update product:', error);
        },
    });

    if (isLoading) return <div>Loading store details...</div>;
    if (error instanceof Error) return <div>Error: {error.message}</div>;

    const handleSubmit = () => {
        const values = { ...settingsForm.state.values, logoUrl };
        const result = SettingsSchema.safeParse(values);
        console.log("result", result)
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
        updateSettingsMutation.mutate(values);
    };

    function createUpdateButton(sectionKeys: string[], label = 'Update') {
        return (
            <settingsForm.Subscribe
                selector={(formState) => {
                    // console.log("formState", formState)
                    const fm = formState.fieldMeta as Record<string, any>;
                    const fv = formState.values as Record<string, any>;
                    const dirty: Record<string, any> = {};
                    sectionKeys.forEach((key) => {
                        if (fm[key]?.isDirty) {
                            dirty[key] = fv[key];
                        }
                    });
                    // console.log("dirty", dirty)
                    return { dirtyFields: dirty };
                }}
            >
                {({ dirtyFields }) => (
                    <Button
                        onClick={() => {
                            if (Object.keys(dirtyFields).length === 0) {
                                toast({
                                    variant: 'default',
                                    title: 'No Changes!',
                                    description: 'No changes to submit.',
                                });
                                return;
                            }
                            setShowErrors(true);
                            handleSubmit();
                        }}
                        className="bg-[#94D42A] text-black font-semibold rounded-[37px] px-6 py-2"
                    >
                        {label}
                    </Button>
                )}
            </settingsForm.Subscribe>
        );
    }

    const handleLogoUpload = (newLogoUrl: string) => {
        setLogoUrl(newLogoUrl);
        updateSettingsMutation.mutate({
            ...data,
            icon: newLogoUrl,
        });
    };

    return (
        <div className="min-h-screen bg-black px-8 py-12 text-white">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                }}
            >
                <div className="max-w-6xl mx-auto space-y-8">
                    <h1 className="text-3xl font-bold mb-6">Settings</h1>

                    {/* Account Information */}
                    <Card className="bg-primary-black-90 border-[#040404]">
                        <CardHeader>
                            <CardTitle className="text-white text-lg font-semibold">
                                Account Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-[10px]">
                                {/* Photo Section */}
                                <div className="flex flex-col items-start gap-[18px] border-b border-[#c2c2c2]-700 pb-5 mb-4">
                                    <div className="flex gap-4 mb-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="bg-[#94D42A] text-black font-semibold rounded-[37px] px-4 py-2"
                                        >
                                            Change Photo
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="border border-[#94D42A] text-[#94D42A] font-semibold rounded-[37px] px-4 py-2"
                                        >
                                            Remove Photo
                                        </Button>
                                    </div>
                                    <p className="text-sm text-gray-400">
                                        At least 125 x 125 px PNG or JPG file. 1
                                        MB maximum file size.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <settingsForm.Field name="firstName" validators={{
                                        onBlur: ({ value }) => !value ? 'First Name is required.' : undefined,
                                    }}>
                                        {(field) => (
                                            <div>
                                                <label className="font-sora font-normal text-[16px] pl-[16px] text-white">
                                                    First Name
                                                </label>
                                                <Input
                                                    placeholder="Enter your first name"
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    onBlur={field.handleBlur}
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 h-[50px] focus:ring-2 focus:ring-[#94D42A] mt-[20px]"
                                                />
                                                {((field.state.meta.errors && field.state.meta.errors.length > 0) ||
                                                    (showErrors && !field.state.value)) && (
                                                        <span className="text-red-500 text-sm mt-1">
                                                            {field.state.meta.errors && field.state.meta.errors.length > 0
                                                                ? field.state.meta.errors.join(', ')
                                                                : 'This field is required.'}
                                                        </span>
                                                    )}
                                            </div>
                                        )}
                                    </settingsForm.Field>

                                    {/* New Last Name Field */}
                                    <settingsForm.Field name="lastName" validators={{
                                        onBlur: ({ value }) => !value ? 'Last Name is required.' : undefined,
                                    }}>
                                        {(field) => (
                                            <div>
                                                <label className="font-sora font-normal text-[16px] pl-[16px] text-white">
                                                    Last Name
                                                </label>
                                                <Input
                                                    placeholder="Enter your last name"
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    onBlur={field.handleBlur}
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 h-[50px] focus:ring-2 focus:ring-[#94D42A] mt-[20px]"
                                                />
                                                {((field.state.meta.errors && field.state.meta.errors.length > 0) ||
                                                    (showErrors && !field.state.value)) && (
                                                        <span className="text-red-500 text-sm mt-1">
                                                            {field.state.meta.errors && field.state.meta.errors.length > 0
                                                                ? field.state.meta.errors.join(', ')
                                                                : 'This field is required.'}
                                                        </span>
                                                    )}
                                            </div>
                                        )}
                                    </settingsForm.Field>

                                    <settingsForm.Field
                                        name="phoneNumber"
                                    >
                                        {(field) => (
                                            <div>
                                                <label className="font-sora font-normal text-[16px] pl-[16px] text-white">
                                                    Phone Number
                                                </label>
                                                <Input
                                                    placeholder="Enter your phone number"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 h-[50px] focus:ring-2 focus:ring-[#94D42A] mt-[20px]"
                                                />
                                                {field.state.meta.errors &&
                                                    field.state.meta.errors
                                                        .length > 0 && (
                                                        <span className="text-red-500 text-sm mt-1">
                                                            {field.state.meta.errors.join(
                                                                ', '
                                                            )}
                                                        </span>
                                                    )}
                                            </div>
                                        )}
                                    </settingsForm.Field>

                                    <settingsForm.Field
                                        name="emailAddress"
                                        validators={{
                                            onBlur: ({ value }) =>
                                                !value
                                                    ? 'Email is required.'
                                                    : undefined,
                                        }}
                                    >
                                        {(field) => (
                                            <div>
                                                <label className="font-sora font-normal text-[16px] pl-[16px] text-white">
                                                    Email Address
                                                </label>
                                                <Input
                                                    placeholder="Enter your email address"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-2 h-[50px] focus:ring-2 focus:ring-[#94D42A] mt-[20px]"
                                                />
                                                {((field.state.meta.errors &&
                                                    field.state.meta.errors
                                                        .length > 0) ||
                                                    (showErrors &&
                                                        !field.state
                                                            .value)) && (
                                                        <span className="text-red-500 text-sm mt-1">
                                                            {field.state.meta
                                                                .errors &&
                                                                field.state.meta.errors
                                                                    .length > 0
                                                                ? field.state.meta.errors.join(
                                                                    ', '
                                                                )
                                                                : 'This field is required.'}
                                                        </span>
                                                    )}
                                            </div>
                                        )}
                                    </settingsForm.Field>
                                </div>
                            </div>

                            {/* Action Buttons for Account Info */}
                            <div className="flex justify-start gap-4 mt-6">
                                <Button
                                    type="reset"
                                    variant="ghost"
                                    className="border border-[#94D42A] text-[#94D42A] font-semibold rounded-[37px] px-4 py-2"
                                >
                                    Discard
                                </Button>
                                {createUpdateButton(
                                    [
                                        'firstName',
                                        'lastName',
                                        'phoneNumber',
                                        'emailAddress',
                                    ],
                                    'Update'
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Business Information */}
                    {/* <Card className="bg-primary-black-90 border-[#040404]">
                        <CardHeader>
                            <CardTitle className="text-white text-lg font-semibold">
                                Business Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-[10px]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <settingsForm.Field
                                        name="businessName"
                                    >
                                        {(field) => (
                                            <div>
                                                <label className="font-sora font-normal text-[16px] pl-[16px] text-white">
                                                    Business Name
                                                </label>
                                                <Input
                                                    placeholder="Enter your business name"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-[10px] h-[50px] focus:ring-2 focus:ring-[#94D42A] mt-[20px]"
                                                />
                                                {field.state.meta.errors &&
                                                    field.state.meta.errors
                                                        .length > 0 && (
                                                        <span className="text-red-500 text-sm mt-1">
                                                            {field.state.meta.errors.join(
                                                                ', '
                                                            )}
                                                        </span>
                                                    )}
                                            </div>
                                        )}
                                    </settingsForm.Field>

                                    <settingsForm.Field
                                        name="registrationNumber"
                                    >
                                        {(field) => (
                                            <div>
                                                <label className="font-sora font-normal text-[16px] pl-[16px] text-white">
                                                    Registration Number
                                                </label>
                                                <Input
                                                    placeholder="Enter your registration number"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-[10px] h-[50px] focus:ring-2 focus:ring-[#94D42A] mt-[20px]"
                                                />
                                                {field.state.meta.errors &&
                                                    field.state.meta.errors
                                                        .length > 0 && (
                                                        <span className="text-red-500 text-sm mt-1">
                                                            {field.state.meta.errors.join(
                                                                ', '
                                                            )}
                                                        </span>
                                                    )}
                                            </div>
                                        )}
                                    </settingsForm.Field>

                                    <settingsForm.Field
                                        name="taxId"
                                    >
                                        {(field) => (
                                            <div>
                                                <label className="font-sora font-normal text-[16px] pl-[16px] text-white">
                                                    Tax Identification Number
                                                </label>
                                                <Input
                                                    placeholder="Enter your tax identification number"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-[10px] h-[50px] focus:ring-2 focus:ring-[#94D42A] mt-[20px]"
                                                />
                                                {field.state.meta.errors &&
                                                    field.state.meta.errors
                                                        .length > 0 && (
                                                        <span className="text-red-500 text-sm mt-1">
                                                            {field.state.meta.errors.join(
                                                                ', '
                                                            )}
                                                        </span>
                                                    )}
                                            </div>
                                        )}
                                    </settingsForm.Field>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <settingsForm.Field name="businessStructure">
                                            {(field) => (
                                                <div>
                                                    <label className="font-sora font-normal text-[16px] pl-[16px] text-white">
                                                        Business Structure
                                                    </label>
                                                    <Select
                                                        value={
                                                            field.state.value
                                                        }
                                                        onValueChange={(
                                                            newValue
                                                        ) => {
                                                            if (newValue === '')
                                                                return;
                                                            field.handleChange(
                                                                newValue
                                                            );
                                                        }}
                                                    >
                                                        <SelectTrigger className="rounded-lg bg-black text-white border-[#040404] px-4 h-[50px] py-[10px] mt-[20px]">
                                                            <SelectValue>
                                                                {field.state
                                                                    .value
                                                                    ? field
                                                                        .state
                                                                        .value
                                                                    : 'Select business structure'}
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="sole-proprietor">
                                                                Sole
                                                                Proprietorship
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
                                        </settingsForm.Field>

                                        <settingsForm.Field name="industry">
                                            {(field) => (
                                                <div>
                                                    <label className="font-sora font-normal text-[16px] pl-[16px] text-white">
                                                        Industry
                                                    </label>
                                                    <Select
                                                        value={
                                                            field.state.value
                                                        }
                                                        onValueChange={(
                                                            newValue
                                                        ) => {
                                                            if (newValue === '')
                                                                return;
                                                            field.handleChange(
                                                                newValue
                                                            );
                                                        }}
                                                    >
                                                        <SelectTrigger className="rounded-lg bg-black text-white border-[#040404] px-4 h-[50px] py-[10px] mt-[20px]">
                                                            <SelectValue>
                                                                {field.state
                                                                    .value
                                                                    ? field.state.value
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase() +
                                                                    field.state.value.slice(
                                                                        1
                                                                    )
                                                                    : 'Select industry'}
                                                            </SelectValue>
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
                                        </settingsForm.Field>
                                    </div>
                                </div>

                                <div className="md:col-span-2 mt-6">
                                    <h3 className="font-sora font-semibold text-[16px] pl-[16px] text-white mb-4">
                                        Business Registered Address
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <settingsForm.Field name="addressLine1">
                                            {(field) => (
                                                <Input
                                                    placeholder="Address Line 1"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-[10px] h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                                />
                                            )}
                                        </settingsForm.Field>
                                        <settingsForm.Field name="addressLine2">
                                            {(field) => (
                                                <Input
                                                    placeholder="Address Line 2"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-[10px] h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                                />
                                            )}
                                        </settingsForm.Field>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                        <settingsForm.Field name="city">
                                            {(field) => (
                                                <Input
                                                    placeholder="City"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-[10px] h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                                />
                                            )}
                                        </settingsForm.Field>
                                        <settingsForm.Field name="state">
                                            {(field) => (
                                                <Input
                                                    placeholder="State"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-[10px] h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                                />
                                            )}
                                        </settingsForm.Field>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                        <settingsForm.Field name="country">
                                            {(field) => (
                                                <Input
                                                    placeholder="Country"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-[10px] h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                                />
                                            )}
                                        </settingsForm.Field>
                                        <settingsForm.Field name="zipCode">
                                            {(field) => (
                                                <Input
                                                    placeholder="Zip Code"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-[10px] h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                                />
                                            )}
                                        </settingsForm.Field>
                                    </div>
                                </div>

                                <div className="md:col-span-2 mt-6">
                                    <settingsForm.Field
                                        name="primaryContactName"
                                    >
                                        {(field) => (
                                            <>
                                                <label className="font-sora font-normal text-[16px] pl-[16px] text-white">
                                                    Primary Contact Person
                                                </label>
                                                <Input
                                                    placeholder="Name"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-[10px] h-[42px] focus:ring-2 focus:ring-[#94D42A] mb-[12px] mt-[20px]"
                                                />
                                                {field.state.meta.errors &&
                                                    field.state.meta.errors
                                                        .length > 0 && (
                                                        <span className="text-red-500 text-sm mt-1">
                                                            {field.state.meta.errors.join(
                                                                ', '
                                                            )}
                                                        </span>
                                                    )}
                                            </>
                                        )}
                                    </settingsForm.Field>
                                    <settingsForm.Field
                                        name="primaryContactEmail"
                                    >
                                        {(field) => (
                                            <>
                                                <Input
                                                    placeholder="Email"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-[10px] h-[42px] focus:ring-2 focus:ring-[#94D42A] mb-[12px] "
                                                />
                                                {field.state.meta.errors &&
                                                    field.state.meta.errors
                                                        .length > 0 && (
                                                        <span className="text-red-500 text-sm mt-1">
                                                            {field.state.meta.errors.join(
                                                                ', '
                                                            )}
                                                        </span>
                                                    )}
                                            </>
                                        )}
                                    </settingsForm.Field>
                                    <settingsForm.Field
                                        name="primaryContactNumber"
                                    >
                                        {(field) => (
                                            <>
                                                <Input
                                                    placeholder="Contact Number"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-[10px] h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                                />
                                                {field.state.meta.errors &&
                                                    field.state.meta.errors
                                                        .length > 0 && (
                                                        <span className="text-red-500 text-sm mt-1">
                                                            {field.state.meta.errors.join(
                                                                ', '
                                                            )}
                                                        </span>
                                                    )}
                                            </>
                                        )}
                                    </settingsForm.Field>
                                </div>
                            </div>

                            <div className="flex justify-start gap-4 mt-6">
                                <Button
                                    type="reset"
                                    variant="ghost"
                                    className="border border-[#94D42A] text-[#94D42A] font-semibold rounded-[37px] px-4 py-2"
                                >
                                    Discard
                                </Button>
                                {createUpdateButton(
                                    [
                                        'businessName',
                                        'registrationNumber',
                                        'taxId',
                                        'businessStructure',
                                        'industry',
                                        'addressLine1',
                                        'addressLine2',
                                        'city',
                                        'state',
                                        'country',
                                        'zipCode',
                                        'primaryContactName',
                                        'primaryContactEmail',
                                        'primaryContactNumber',
                                    ],
                                    'Update'
                                )}
                            </div>
                        </CardContent>
                    </Card> */}

                    {/* Store Information */}
                    <Card className="bg-primary-black-90 border-[#040404]">
                        <CardHeader>
                            <CardTitle className="text-white text-lg font-semibold">
                                Store Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <settingsForm.Field
                                        name="storeName"
                                        validators={{
                                            onBlur: ({ value }) =>
                                                !value
                                                    ? 'Store Name is required.'
                                                    : undefined,
                                        }}
                                    >
                                        {(field) => (
                                            <div>
                                                <label className="font-sora font-normal text-[16px] text-white ">
                                                    Store Name
                                                </label>
                                                <Input
                                                    placeholder="Ex. Lily's Clothing"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-[10px] h-[42px] focus:ring-2 focus:ring-[#94D42A] mt-[20px]"
                                                />
                                                {((field.state.meta.errors &&
                                                    field.state.meta.errors
                                                        .length > 0) ||
                                                    (showErrors &&
                                                        !field.state
                                                            .value)) && (
                                                        <span className="text-red-500 text-sm mt-1">
                                                            {field.state.meta
                                                                .errors &&
                                                                field.state.meta.errors
                                                                    .length > 0
                                                                ? field.state.meta.errors.join(
                                                                    ', '
                                                                )
                                                                : 'This field is required.'}
                                                        </span>
                                                    )}
                                            </div>
                                        )}
                                    </settingsForm.Field>
                                </div>
                                <LogoUpload
                                    storeHandle={data?.handle} 
                                    onLogoUpload={handleLogoUpload} 
                                    existingLogoUrl={data?.icon}
                                />
                                <div>
                                    <settingsForm.Field name="preferredCurrency">
                                        {(field) => (
                                            <div>
                                                <label
                                                    htmlFor="preferredCurrency"
                                                    className="font-sora font-normal text-[16px] text-white"
                                                >
                                                    Select Preferred Currency:
                                                </label>
                                                <Select
                                                    value={field.state.value}
                                                    onValueChange={(newValue) => {
                                                        if (newValue === '') return;
                                                        field.handleChange(newValue);
                                                    }}
                                                >
                                                    <SelectTrigger
                                                        className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-[10px] h-[42px] focus:ring-2 focus:ring-[#94D42A] mt-[20px]"
                                                    >
                                                        <SelectValue>
                                                            {field.state.value
                                                                ? field.state.value.toUpperCase()
                                                                : 'Threshold (in selected cryptocurrency)'}
                                                        </SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="eth">ETH</SelectItem>
                                                        <SelectItem value="usdc">USDC</SelectItem>
                                                        <SelectItem value="usdt">USDT</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {((field.state.meta.errors &&
                                                    field.state.meta.errors.length > 0) ||
                                                    (showErrors && !field.state.value)) && (
                                                        <span className="text-red-500 text-sm mt-1">
                                                            {field.state.meta.errors && field.state.meta.errors.length > 0
                                                                ? field.state.meta.errors.join(', ')
                                                                : 'This field is required.'}
                                                        </span>
                                                    )}
                                            </div>
                                        )}
                                    </settingsForm.Field>
                                </div>

                                <div>
                                    <settingsForm.Field
                                        name="storeDescription"
                                        validators={{
                                            onBlur: ({ value }) =>
                                                !value
                                                    ? 'Store Description is required.'
                                                    : undefined,
                                        }}
                                    >
                                        {(field) => (
                                            <div>
                                                <label className="font-sora font-normal text-[16px] text-white">
                                                    Store Description
                                                </label>
                                                <Textarea
                                                    placeholder="Provide a brief description of your business..."
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    className="rounded-[12px] bg-black text-white border-[#040404] placeholder-gray-500 px-[16px] py-[16px] focus:ring-2 focus:ring-[#94D42A] mt-[20px]"
                                                    style={{ height: '215px' }}
                                                />
                                                {((field.state.meta.errors &&
                                                    field.state.meta.errors
                                                        .length > 0) ||
                                                    (showErrors &&
                                                        !field.state
                                                            .value)) && (
                                                        <span className="text-red-500 text-sm mt-1">
                                                            {field.state.meta
                                                                .errors &&
                                                                field.state.meta.errors
                                                                    .length > 0
                                                                ? field.state.meta.errors.join(
                                                                    ', '
                                                                )
                                                                : 'This field is required.'}
                                                        </span>
                                                    )}
                                            </div>
                                        )}
                                    </settingsForm.Field>
                                </div>

                                <div>
                                    <label className="font-sora font-normal text-[16px] text-white">
                                        Store Category
                                    </label>
                                    <div className="grid grid-cols-2 mt-[20px]">
                                        <div className="grid grid-cols-2 gap-[20px]">
                                            <settingsForm.Field name="categoryElectronics">
                                                {(field) => (
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox
                                                            checked={
                                                                field.state
                                                                    .value ||
                                                                false
                                                            }
                                                            onCheckedChange={(
                                                                checked: boolean
                                                            ) =>
                                                                field.handleChange(
                                                                    checked
                                                                )
                                                            }
                                                            className="text-white"
                                                        />
                                                        <span className="text-white">
                                                            Electronics
                                                        </span>
                                                    </div>
                                                )}
                                            </settingsForm.Field>
                                            <settingsForm.Field name="categoryFashion">
                                                {(field) => (
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox
                                                            checked={
                                                                field.state
                                                                    .value ||
                                                                false
                                                            }
                                                            onCheckedChange={(
                                                                checked: boolean
                                                            ) =>
                                                                field.handleChange(
                                                                    checked
                                                                )
                                                            }
                                                            className="text-white"
                                                        />
                                                        <span className="text-white">
                                                            Fashion
                                                        </span>
                                                    </div>
                                                )}
                                            </settingsForm.Field>
                                            <settingsForm.Field name="categoryHomeGarden">
                                                {(field) => (
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox
                                                            checked={
                                                                field.state
                                                                    .value ||
                                                                false
                                                            }
                                                            onCheckedChange={(
                                                                checked: boolean
                                                            ) =>
                                                                field.handleChange(
                                                                    checked
                                                                )
                                                            }
                                                            className="text-white"
                                                        />
                                                        <span className="text-white">
                                                            Home &amp; Garden
                                                        </span>
                                                    </div>
                                                )}
                                            </settingsForm.Field>
                                            <settingsForm.Field name="categoryHealthBeauty">
                                                {(field) => (
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox
                                                            checked={
                                                                field.state
                                                                    .value ||
                                                                false
                                                            }
                                                            onCheckedChange={(
                                                                checked: boolean
                                                            ) =>
                                                                field.handleChange(
                                                                    checked
                                                                )
                                                            }
                                                            className="text-white"
                                                        />
                                                        <span className="text-white">
                                                            Health &amp; Beauty
                                                        </span>
                                                    </div>
                                                )}
                                            </settingsForm.Field>
                                            <settingsForm.Field name="categorySportsOutdoors">
                                                {(field) => (
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox
                                                            checked={
                                                                field.state
                                                                    .value ||
                                                                false
                                                            }
                                                            onCheckedChange={(
                                                                checked: boolean
                                                            ) =>
                                                                field.handleChange(
                                                                    checked
                                                                )
                                                            }
                                                            className="text-white"
                                                        />
                                                        <span className="text-white">
                                                            Sports &amp;
                                                            Outdoors
                                                        </span>
                                                    </div>
                                                )}
                                            </settingsForm.Field>
                                            <settingsForm.Field name="categoryDigitalGoods">
                                                {(field) => (
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox
                                                            checked={
                                                                field.state
                                                                    .value ||
                                                                false
                                                            }
                                                            onCheckedChange={(
                                                                checked: boolean
                                                            ) =>
                                                                field.handleChange(
                                                                    checked
                                                                )
                                                            }
                                                            className="text-white"
                                                        />
                                                        <span className="text-white">
                                                            Digital Goods
                                                        </span>
                                                    </div>
                                                )}
                                            </settingsForm.Field>
                                            <settingsForm.Field name="categoryArtCollectibles">
                                                {(field) => (
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox
                                                            checked={
                                                                field.state
                                                                    .value ||
                                                                false
                                                            }
                                                            onCheckedChange={(
                                                                checked: boolean
                                                            ) =>
                                                                field.handleChange(
                                                                    checked
                                                                )
                                                            }
                                                            className="text-white"
                                                        />
                                                        <span className="text-white">
                                                            Art &amp;
                                                            Collectibles
                                                        </span>
                                                    </div>
                                                )}
                                            </settingsForm.Field>
                                        </div>
                                    </div>
                                    <settingsForm.Field name="otherCategory">
                                        {(field) => (
                                            <Input
                                                placeholder="Others (please specify)"
                                                value={field.state.value}
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value
                                                    )
                                                }
                                                onBlur={field.handleBlur}
                                                className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-[10px] mt-[20px] h-[44px] focus:ring-2 focus:ring-[#94D42A]"
                                            />
                                        )}
                                    </settingsForm.Field>
                                </div>
                                {/* 
                                <div>
                                    <label className="font-sora font-normal text-[16px] text-white mb-[20px]">
                                        Social Media Links
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-[20px]">
                                        <settingsForm.Field name="facebook">
                                            {(field) => (
                                                <Input
                                                    placeholder="Facebook"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-[10px] h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                                />
                                            )}
                                        </settingsForm.Field>
                                        <settingsForm.Field name="linkedIn">
                                            {(field) => (
                                                <Input
                                                    placeholder="LinkedIn"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-[10px] h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                                />
                                            )}
                                        </settingsForm.Field>
                                        <settingsForm.Field name="x">
                                            {(field) => (
                                                <Input
                                                    placeholder="X"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-[10px] h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                                />
                                            )}
                                        </settingsForm.Field>
                                        <settingsForm.Field name="instagram">
                                            {(field) => (
                                                <Input
                                                    placeholder="Instagram"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-[10px] h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                                />
                                            )}
                                        </settingsForm.Field>
                                        <settingsForm.Field name="otherSocial">
                                            {(field) => (
                                                <Input
                                                    placeholder="Others"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-[10px] h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                                />
                                            )}
                                        </settingsForm.Field>
                                    </div>
                                </div> */}
                            </div>

                            {/* Action Buttons for Store Info */}
                            <div className="flex justify-start gap-4 mt-6">
                                <Button
                                    type="reset"
                                    variant="ghost"
                                    className="border border-[#94D42A] text-[#94D42A] font-semibold rounded-[37px] px-4 py-2"
                                >
                                    Discard
                                </Button>
                                {createUpdateButton(
                                    [
                                        'storeName',
                                        'storeDescription',
                                        'preferredCurrency',
                                        'categoryElectronics',
                                        'categoryFashion',
                                        'categoryHomeGarden',
                                        'categoryHealthBeauty',
                                        'categorySportsOutdoors',
                                        'categoryDigitalGoods',
                                        'categoryArtCollectibles',
                                        'otherCategory',
                                        // 'facebook',
                                        // 'linkedIn',
                                        // 'x',
                                        // 'instagram',
                                        // 'otherSocial',
                                    ],
                                    'Update'
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Wallet/Payment Settings */}
                    {/* <Card className="bg-primary-black-90 border-[#040404]">
                        <CardHeader>
                            <CardTitle className="text-white text-lg font-semibold">
                                Wallet/Payments Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <settingsForm.Field name="protocol">
                                        {(field) => (
                                            <div>
                                                <label className="font-sora font-normal text-[16px] text-white">
                                                    Protocol
                                                </label>
                                                <Select
                                                    value={field.state.value}
                                                    onValueChange={(
                                                        newValue
                                                    ) => {
                                                        if (newValue === '')
                                                            return;
                                                        field.handleChange(
                                                            newValue
                                                        );
                                                    }}
                                                >
                                                    <SelectTrigger className="rounded-lg bg-black text-white border-[#040404] px-4 py-[10px] mt-[20px] h-[42px]">
                                                        <SelectValue>
                                                            {field.state
                                                                .value ===
                                                                'other'
                                                                ? 'Other'
                                                                : 'Loadpipe'}
                                                        </SelectValue>
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
                                    </settingsForm.Field>
                                </div>

                                <div>
                                    <label className="font-sora font-normal text-[16px] text-white">
                                        Preferred Payment Cryptocurrencies
                                    </label>
                                    <div className="grid grid-cols-2 gap-4 mt-[20px]">
                                        <div className="flex items-center gap-2">
                                            <settingsForm.Field name="cryptoBTC">
                                                {(field) => (
                                                    <>
                                                        <Checkbox
                                                            checked={
                                                                field.state
                                                                    .value ||
                                                                false
                                                            }
                                                            onCheckedChange={(
                                                                checked: boolean
                                                            ) =>
                                                                field.handleChange(
                                                                    checked
                                                                )
                                                            }
                                                            className="text-white"
                                                        />
                                                        <span className="text-white">
                                                            Bitcoin (BTC)
                                                        </span>
                                                    </>
                                                )}
                                            </settingsForm.Field>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <settingsForm.Field name="cryptoUSDT">
                                                {(field) => (
                                                    <>
                                                        <Checkbox
                                                            checked={
                                                                field.state
                                                                    .value ||
                                                                false
                                                            }
                                                            onCheckedChange={(
                                                                checked: boolean
                                                            ) =>
                                                                field.handleChange(
                                                                    checked
                                                                )
                                                            }
                                                            className="text-white"
                                                        />
                                                        <span className="text-white">
                                                            USDT (Tether)
                                                        </span>
                                                    </>
                                                )}
                                            </settingsForm.Field>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <settingsForm.Field name="cryptoETH">
                                                {(field) => (
                                                    <>
                                                        <Checkbox
                                                            checked={
                                                                field.state
                                                                    .value ||
                                                                false
                                                            }
                                                            onCheckedChange={(
                                                                checked: boolean
                                                            ) =>
                                                                field.handleChange(
                                                                    checked
                                                                )
                                                            }
                                                            className="text-white"
                                                        />
                                                        <span className="text-white">
                                                            Ethereum (ETH)
                                                        </span>
                                                    </>
                                                )}
                                            </settingsForm.Field>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <settingsForm.Field name="cryptoBNB">
                                                {(field) => (
                                                    <>
                                                        <Checkbox
                                                            checked={
                                                                field.state
                                                                    .value ||
                                                                false
                                                            }
                                                            onCheckedChange={(
                                                                checked: boolean
                                                            ) =>
                                                                field.handleChange(
                                                                    checked
                                                                )
                                                            }
                                                            className="text-white"
                                                        />
                                                        <span className="text-white">
                                                            Binance Coin (BNB)
                                                        </span>
                                                    </>
                                                )}
                                            </settingsForm.Field>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <settingsForm.Field name="cryptoUSDC">
                                                {(field) => (
                                                    <>
                                                        <Checkbox
                                                            checked={
                                                                field.state
                                                                    .value ||
                                                                false
                                                            }
                                                            onCheckedChange={(
                                                                checked: boolean
                                                            ) =>
                                                                field.handleChange(
                                                                    checked
                                                                )
                                                            }
                                                            className="text-white"
                                                        />
                                                        <span className="text-white">
                                                            USDC (USD Coin)
                                                        </span>
                                                    </>
                                                )}
                                            </settingsForm.Field>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="font-sora font-normal text-[16px] text-white">
                                        Payout Wallet Addresses
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-[20px]">
                                        <settingsForm.Field name="walletBTC">
                                            {(field) => (
                                                <Input
                                                    placeholder="Bitcoin (BTC)"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-[10px] h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                                />
                                            )}
                                        </settingsForm.Field>
                                        <settingsForm.Field name="walletUSDT">
                                            {(field) => (
                                                <Input
                                                    placeholder="USDT (Tether)"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-[10px] h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                                />
                                            )}
                                        </settingsForm.Field>
                                        <settingsForm.Field name="walletETH">
                                            {(field) => (
                                                <Input
                                                    placeholder="Ethereum (ETH)"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-[10px] h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                                />
                                            )}
                                        </settingsForm.Field>
                                        <settingsForm.Field name="walletBNB">
                                            {(field) => (
                                                <Input
                                                    placeholder="Binance Coin (BNB)"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-[10px] h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                                />
                                            )}
                                        </settingsForm.Field>
                                        <settingsForm.Field name="walletUSDC">
                                            {(field) => (
                                                <Input
                                                    placeholder="USDC (USD Coin)"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-[10px] h-[42px] focus:ring-2 focus:ring-[#94D42A]"
                                                />
                                            )}
                                        </settingsForm.Field>
                                    </div>
                                </div>

                                <div>
                                    <label className="font-sora font-normal text-[16px] text-white mb-[12px]">
                                        Automatic Conversion Options
                                    </label>
                                    <p className="text-sm text-gray-400 mb-[20px]">
                                        Would you like to automatically convert
                                        received cryptocurrencies into a
                                        preferred one?
                                    </p>
                                    <settingsForm.Field name="autoConvert">
                                        {(field) => (
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2 mb-[20px]">
                                                    <Checkbox
                                                        checked={
                                                            field.state.value ||
                                                            false
                                                        }
                                                        onCheckedChange={(
                                                            checked: boolean
                                                        ) =>
                                                            field.handleChange(
                                                                checked
                                                            )
                                                        }
                                                        className="text-white"
                                                    />
                                                    <span className="text-white">
                                                        Yes (please specify the
                                                        preferred
                                                        cryptocurrency)
                                                    </span>
                                                </div>
                                                <div>
                                                    <settingsForm.Field name="preferredCrypto">
                                                        {(cryptoField) => (
                                                            <Input
                                                                placeholder="Ex. BTC"
                                                                value={
                                                                    cryptoField
                                                                        .state
                                                                        .value
                                                                }
                                                                onChange={(e) =>
                                                                    cryptoField.handleChange(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                onBlur={
                                                                    cryptoField.handleBlur
                                                                }
                                                                className="rounded-lg bg-black text-white border-[#040404] placeholder-gray-500 px-4 py-[10px] h-[42px] focus:ring-2 focus:ring-[#94D42A] mb-[20px]"
                                                            />
                                                        )}
                                                    </settingsForm.Field>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        checked={
                                                            !field.state.value
                                                        }
                                                        onCheckedChange={(
                                                            checked: boolean
                                                        ) => {
                                                            if (checked) {
                                                                field.handleChange(
                                                                    false
                                                                );
                                                            }
                                                        }}
                                                        className="text-white"
                                                    />
                                                    <span className="text-white">
                                                        No, I want to receive
                                                        payments in the original
                                                        cryptocurrency.
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </settingsForm.Field>
                                </div>

                                <div>
                                    <settingsForm.Field name="minimumPayoutThreshold">
                                        {(field) => (
                                            <div>
                                                <label className="font-sora font-normal text-[16px] text-white">
                                                    Minimum Payout Threshold
                                                </label>
                                                <Select
                                                    value={field.state.value}
                                                    onValueChange={(
                                                        newValue
                                                    ) => {
                                                        if (newValue === '')
                                                            return;
                                                        field.handleChange(
                                                            newValue
                                                        );
                                                    }}
                                                >
                                                    <SelectTrigger className="rounded-lg bg-black text-white border-[#040404] px-4 py-[10px] mt-[20px] h-[44px]">
                                                        <SelectValue>
                                                            {field.state.value
                                                                ? field.state.value
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                field.state.value.slice(
                                                                    1
                                                                )
                                                                : 'Threshold (in selected cryptocurrency)'}
                                                        </SelectValue>
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
                                    </settingsForm.Field>
                                </div>

                                <div>
                                    <settingsForm.Field name="paymentFrequency">
                                        {(field) => (
                                            <div>
                                                <label className="font-sora font-normal text-[16px] text-white">
                                                    Payment Frequency
                                                </label>
                                                <Select
                                                    value={field.state.value}
                                                    onValueChange={(
                                                        newValue
                                                    ) => {
                                                        if (newValue === '')
                                                            return;
                                                        field.handleChange(
                                                            newValue
                                                        );
                                                    }}
                                                >
                                                    <SelectTrigger className="rounded-lg bg-black text-white border-[#040404] px-4 py-[10px] mt-[20px] h-[42px]">
                                                        <SelectValue>
                                                            {field.state.value
                                                                ? field.state.value
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                field.state.value.slice(
                                                                    1
                                                                )
                                                                : 'Daily'}
                                                        </SelectValue>
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
                                    </settingsForm.Field>
                                </div>
                            </div>

                            <div className="flex justify-start gap-4 mt-6">
                                <Button
                                    type="reset"
                                    variant="ghost"
                                    className="border border-[#94D42A] text-[#94D42A] font-semibold rounded-[37px] px-4 py-2"
                                >
                                    Discard
                                </Button>
                                {createUpdateButton(
                                    [
                                        'protocol',
                                        'cryptoBTC',
                                        'cryptoUSDT',
                                        'cryptoETH',
                                        'cryptoBNB',
                                        'cryptoUSDC',
                                        'walletBTC',
                                        'walletUSDT',
                                        'walletETH',
                                        'walletBNB',
                                        'walletUSDC',
                                        'autoConvert',
                                        'preferredCrypto',
                                        'minimumPayoutThreshold',
                                        'paymentFrequency',
                                    ],
                                    'Update'
                                )}
                            </div>
                        </CardContent>
                    </Card> */}
                </div>
            </form>
        </div>
    );
}
