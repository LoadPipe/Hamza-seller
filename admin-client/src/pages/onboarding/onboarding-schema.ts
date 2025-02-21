// src/pages/onboarding/onboarding-schema.ts
import { z } from 'zod';

export const OnboardingSchema = z.object({
    // Owner Information
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    emailAddress: z.string().min(1),
    // Business Information
    businessName: z.string().min(1),
    registrationNumber: z.string().optional(),
    defaultCurrencyCode: z.string().optional(),
    taxId: z.string().optional(),
    businessStructure: z.string().optional(),
    industry: z.string().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zipCode: z.string().optional(),
    primaryContactName: z.string().optional(),
    primaryContactEmail: z.string().optional(),
    primaryContactNumber: z.string().optional(),

    // Store Customization
    storeName: z.string().min(1),
    handle: z.string().min(1),
    storeDescription: z.string().min(1),
    mobileNumber: z.string().optional(),
    storeEmail: z.string().optional(),
    // Store Category fields
    categoryElectronics: z.boolean().default(false),
    categoryFashion: z.boolean().default(false),
    categoryHomeGarden: z.boolean().default(false),
    categoryHealthBeauty: z.boolean().default(false),
    categorySportsOutdoors: z.boolean().default(false),
    categoryDigitalGoods: z.boolean().default(false),
    categoryArtCollectibles: z.boolean().default(false),
    otherCategory: z.string().optional(),
    // Social Media Links
    facebook: z.string().optional(),
    linkedIn: z.string().optional(),
    x: z.string().optional(),
    instagram: z.string().optional(),
    otherSocial: z.string().optional(),

    // Payment Preferences
    protocol: z.string().default('loadpipe'),
    autoConvert: z.boolean().default(false),
    preferredCrypto: z.string().optional(),
    minimumPayoutThreshold: z.string().default('daily'),
    paymentFrequency: z.string().default('daily'),

    cryptoBTC: z.boolean().default(false),
    cryptoUSDT: z.boolean().default(false),
    cryptoETH: z.boolean().default(false),
    cryptoBNB: z.boolean().default(false),
    cryptoUSDC: z.boolean().default(false),
    walletBTC: z.string().optional(),
    walletUSDT: z.string().optional(),
    walletETH: z.string().optional(),
    walletBNB: z.string().optional(),
    walletUSDC: z.string().optional(),
    confirmWalletDisclaimer: z.boolean().default(false),
    agreeTermsDisclaimer: z.boolean().default(false),
});

export type OnboardingValues = z.infer<typeof OnboardingSchema>;

export const onboardingDefaultValues: OnboardingValues = {
    // Owner Information
    firstName: '',
    lastName: '',
    emailAddress: '',

    // Business Information
    businessName: '',
    registrationNumber: '',
    taxId: '',
    businessStructure: 'sole-proprietor',
    defaultCurrencyCode : 'eth',
    industry: 'retail',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    primaryContactName: '',
    primaryContactEmail: '',
    primaryContactNumber: '',

    // Store Customization
    storeName: '',
    handle: '',
    storeDescription: '',
    mobileNumber: '',
    storeEmail: '',
    categoryElectronics: false,
    categoryFashion: false,
    categoryHomeGarden: false,
    categoryHealthBeauty: false,
    categorySportsOutdoors: false,
    categoryDigitalGoods: false,
    categoryArtCollectibles: false,
    otherCategory: '',
    facebook: '',
    linkedIn: '',
    x: '',
    instagram: '',
    otherSocial: '',

    // Payment Preferences
    protocol: 'loadpipe',
    autoConvert: false,
    preferredCrypto: '',
    minimumPayoutThreshold: 'daily',
    paymentFrequency: 'daily',

    // Additional Payment Fields
    cryptoBTC: false,
    cryptoUSDT: false,
    cryptoETH: false,
    cryptoBNB: false,
    cryptoUSDC: false,
    walletBTC: '',
    walletUSDT: '',
    walletETH: '',
    walletBNB: '',
    walletUSDC: '',
    confirmWalletDisclaimer: false,
    agreeTermsDisclaimer: false,
};
