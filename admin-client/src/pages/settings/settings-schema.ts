import { z } from 'zod';

// SQL injection check helper
export const sqlInjectionCheck = (value: string) => {
  const sqlKeywords = ['SELECT', 'INSERT', 'DELETE', 'UPDATE', 'DROP', '--', ';'];
  return !sqlKeywords.some((kw) => value.toUpperCase().includes(kw));
};

// Validation function
export const validateInput = (fieldName: string, value: string) => {
  const sanitized = sqlInjectionCheck(value);
  if (!sanitized) return `${fieldName} contains invalid characters.`;
  return null;
};

// Define the Zod schema for Settings
export const SettingsSchema = z.object({
  // Account Information
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phoneNumber: z.string().optional(),
  emailAddress: z.string().email(),

  // Business Information
  businessName: z.string().optional(),
  registrationNumber: z.string().optional(),
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
  preferredCurrency: z.string().optional(),

  // Store Information
  storeName: z.string().min(1),
  storeDescription: z.string().min(1),

  // Store Category 
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

  // Wallet/Payments Settings 
  protocol: z.string().optional(),
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
  autoConvert: z.boolean().default(false),
  preferredCrypto: z.string().optional(),
  minimumPayoutThreshold: z.string().optional(),
  paymentFrequency: z.string().optional(),
});

// Generate TypeScript type from Zod schema
export type Settings = z.infer<typeof SettingsSchema>;
