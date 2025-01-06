import { z } from 'zod';

// Define the Zod schema for Product
export const ProductSchema = z.object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    handle: z.string().optional().nullable(),
    is_giftcard: z.boolean(),
    status: z.string(),
    thumbnail: z.string().url().optional().nullable(),
    weight: z.number().optional().nullable(),
    collection_id: z.string().optional().nullable(),
    store_id: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
});

// Generate TypeScript type from Zod schema
export type Product = z.infer<typeof ProductSchema>;
