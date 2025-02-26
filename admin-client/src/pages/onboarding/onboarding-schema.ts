// src/pages/onboarding/onboarding-schema.ts
import { z } from 'zod';

const MemberSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required.' }),
  lastName: z.string().min(1, { message: 'Last name is required.' }),
  email: z.string().email({ message: 'A valid email is required.' }),
  currency: z.string().default('eth'),
});

export const OnboardingSchema = z.object({
  // Owner Information
  firstName: z.string().min(1, { message: 'First name is required.' }),
  lastName: z.string().min(1, { message: 'Last name is required.' }),
  emailAddress: z.string().email().min(1, { message: 'Email address is required.' }),

  // Store Details
  storeName: z.string().min(1, { message: 'Store name is required.' }),
  handle: z.string().min(1, { message: 'Store handle is required.' }),
  storeDescription: z.string().min(1, { message: 'Store description is required.' }),
  defaultCurrencyCode: z.string().default('eth'),

  // Product (Step 1: info)
  productName: z.string().min(1, { message: 'Product name is required.' }),
  productInformation: z.string().min(1, { message: 'Product information is required.' }),
  productDescription: z.string().min(1, { message: 'Product description is required.' }),

  // Product (Step 2: amount)
  productPrice: z.string().nonempty({ message: 'Price is required.' })
    .refine(
      (val) => /^(\d+(\.\d+)?|\.\d+)$/.test(val),
      { message: 'Price must be a valid number.' }
    ),
  productSKU: z.string().min(1, { message: 'SKU is required.' }),
  productQuantity: z.number({ invalid_type_error: 'Quantity must be a number.' }),
  productCategory: z.string().min(1, { message: 'Category is required.' }),

  // Multiple Members
  members: z.array(MemberSchema).optional(),
});

export type OnboardingValues = z.infer<typeof OnboardingSchema>;

export const onboardingDefaultValues: OnboardingValues = {
  // Owner Information
  firstName: '',
  lastName: '',
  emailAddress: '',

  // Store Details
  storeName: '',
  handle: '',
  storeDescription: '',
  defaultCurrencyCode: 'eth',

  // Product (Step 1: info)
  productName: '',
  productInformation: '',
  productDescription: '',

  // Product (Step 2: amount)
  productPrice: '0',
  productSKU: '',
  productQuantity: 0,
  productCategory: '',

  // Multiple Members
  members: [],
};
