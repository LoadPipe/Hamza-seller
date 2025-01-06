import { z } from 'zod';

// Define the Zod schema for Product
export const ProductSchema = z.object({
    store_id: z.string(),
    massmarket_prod_id: z.string().nullable(),
    external_source: z.string().nullable(),
    external_metadata: z.any().nullable(),
    bucky_metadata: z.any().nullable(),
    id: z.string(),
    created_at: z.string(),
    updated_at: z.string().nullable(),
    deleted_at: z.string().nullable(),
    title: z.string(),
    subtitle: z.string().nullable(),
    description: z.string().nullable(),
    handle: z.string(),
    is_giftcard: z.boolean(),
    status: z.enum(['draft', 'proposed', 'published', 'rejected']),
    thumbnail: z.string().url().nullable(),
    weight: z.number().nullable(),
    length: z.number().nullable(),
    height: z.number().nullable(),
    width: z.number().nullable(),
    hs_code: z.string().nullable(),
    origin_country: z.string().nullable(),
    mid_code: z.string().nullable(),
    material: z.string().nullable(),
    collection_id: z.string().nullable(),
    type_id: z.string().nullable(),
    discountable: z.boolean(),
    external_id: z.string().nullable(),
    metadata: z.any().nullable(),
});

// Generate TypeScript type from Zod schema
export type Product = z.infer<typeof ProductSchema>;
