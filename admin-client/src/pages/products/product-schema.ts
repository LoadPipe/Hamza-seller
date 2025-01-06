import { z } from 'zod';

// Define the Zod schema for Product
export const ProductSchema = z.object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string().optional().nullable(),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
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
    variants: z
        .array(
            z.object({
                id: z.string(),
                title: z.string(),
                sku: z.string().nullable(),
                inventory_quantity: z.number(),
                variant_rank: z.number(),
                allow_backorder: z.boolean(),
                manage_inventory: z.boolean(),
                prices: z.array(
                    z.object({
                        id: z.string(),
                        currency_code: z.string(),
                        amount: z.string(), // Assuming it's a string
                        min_quantity: z.number().nullable(),
                        max_quantity: z.number().nullable(),
                        price_list_id: z.string().nullable(),
                        region_id: z.string().nullable(),
                    })
                ),
                // Optional fields
                external_source: z.string().nullable(),
                external_metadata: z.any().nullable(),
                bucky_metadata: z.any().nullable(),
                created_at: z.string(),
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
        )
        .optional()
        .nullable(), // Ensure optional/nullable for edge cases
});

// Generate TypeScript type from Zod schema
export type Product = z.infer<typeof ProductSchema>;
