import { z } from 'zod';

// Validation Helpers

// SQL injection check helper
export const sqlInjectionCheck = (value: string) => {
    const sqlKeywords = [
        'SELECT',
        'INSERT',
        'DELETE',
        'UPDATE',
        'DROP',
        '--',
        ';',
    ];
    return !sqlKeywords.some((kw) => value.toUpperCase().includes(kw));
};

// Validation function
export const validateInput = (fieldName: string, value: string) => {
    const sanitized = sqlInjectionCheck(value);
    if (!sanitized) return `${fieldName} contains invalid characters.`;
    return null;
};

// Define the Zod schema for Product
export const ProductSchema = z.object({
    id: z.string(),
    title: z.string(),
    created_at: z.string(),
    subtitle: z.string().optional().nullable(),
    description: z.string().optional(),
    thumbnail: z
        .string()
        .url({ message: 'Invalid URL format for thumbnail' })
        .optional(),
    weight: z.number().nullable(),
    length: z.number().nullable(),
    height: z.number().nullable(),
    width: z.number().nullable(),
    categories: z
        .array(
            z.object({
                id: z.string(),
                created_at: z.string(),
                updated_at: z.string(),
                name: z.string(),
                description: z.string().optional().nullable(),
                handle: z.string(),
                is_active: z.boolean(),
                is_internal: z.boolean(),
                parent_category_id: z.string().nullable(),
                rank: z.number(),
                metadata: z
                    .object({
                        icon_url: z.string().optional().nullable(),
                    })
                    .optional()
                    .nullable(),
            })
        )
        .optional()
        .nullable(), // Ensure categories can be optional and nullable
    variants: z.array(
        z.object({
            id: z.string(),
            product_id: z.string(),
            title: z.string(),
            created_at: z.string(),
            sku: z.string().nullable(),
            inventory_quantity: z.number(),
            variant_rank: z.number(),
            allow_backorder: z.boolean(),
            manage_inventory: z.boolean(),
            prices: z
                .array(
                    z.object({
                        id: z.string(),
                        currency_code: z.string(),
                        amount: z.string(), // Assuming it's a string
                        min_quantity: z.number().nullable(),
                        max_quantity: z.number().nullable(),
                        price_list_id: z.string().nullable(),
                        region_id: z.string().nullable(),
                    })
                )
                .optional()
                .default([]),
            // Optional fields
            external_source: z.string().nullable(),
            external_metadata: z.any().nullable(),
            updated_at: z.string(),
            deleted_at: z.string().nullable(),
            barcode: z.string().nullable(),
            ean: z.string().nullable(),
            upc: z.string().nullable(),
            hs_code: z.string().nullable(),
            origin_country: z.string().nullable(),
            mid_code: z.string().nullable(),
            material: z.string().nullable(),
            weight: z.number().nullable(),
            length: z.number().nullable(),
            height: z.number().nullable(),
            width: z.number().nullable(),
            metadata: z.any().nullable(),
        })
    ),
});

// Generate TypeScript type from Zod schema
export type Product = z.infer<typeof ProductSchema>;


export const AddProductSchema = z.object({
    title: z.string(),
    subtitle: z.string(),
    handle: z.string(),
    description: z.string(),
    weight: z.number(),
    length: z.number(),
    height: z.number(),
    width: z.number(),
    basePrice: z
        .string()
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0),
    discountPercentage: z
        .string()
        .optional()
        .refine((val) => {
            if (!val) return true;
            const num = Number(val.replace('%', ''));
            return !isNaN(num) && num >= 0 && num <= 100;
        }),
    discountType: z.enum(['flat', 'percentage']),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    quantity: z
        .string()
        .optional()
        .refine((val) => {
            if (!val) return true;
            return !isNaN(Number(val)) && Number(val) >= 0;
        }),
    variants: z.array(z.any()),
    status: z.enum(['active', 'draft', 'archived']),
    productImages: z.array(z.string().url()),
    productCategory: z.string(),
});

export type AddProductFormValues = z.infer<typeof AddProductSchema>;
