import { z } from 'zod';
import { ProductStatusSchema } from './product-schema';


// Example only – adapt to your needs:
export const CreateProductSchema = z.object({
    title: z.string({ required_error: 'Title is required' }).nonempty('Title is required'),
    subtitle: z.string({ required_error: 'Subtitle is required' }).nonempty('Subtitle is required'),
    description: z.string({ required_error: 'Description is required' }).nonempty('Description is required'),
    thumbnail: z.string().optional(),
    weight: z.number().min(0).optional(),
    length: z.number().min(0).optional(),
    height: z.number().min(0).optional(),
    width: z.number().min(0).optional(),
    basePrice: z.string().optional(),
    status: ProductStatusSchema.default('draft'),
    discountPercentage: z.string().optional(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    quantity: z.string().optional(),
    categoryHandle: z.string({ required_error: 'Category is required' }).nonempty('Category is required'),
    productTags: z.string().optional(),
    defaultCurrencyCode: z.string().optional(),

    variants: z
        .array(
            z.object({
                product_id: z.string().optional(),
                title: z.string().nonempty('Variant title is required'),
                sku: z.string().optional(),
                barcode: z.string().optional(),
                ean: z.string().optional(),
                upc: z.string().optional(),
                weight: z.number().min(0).optional(),
                length: z.number().min(0).optional(),
                height: z.number().min(0).optional(),
                width: z.number().min(0).optional(),
                price: z.string().nonempty('Price is required'),
                metadata: z
                    .object({
                        imgUrl: z.string().url().optional(),
                    })
                    .optional(),
                inventory_quantity: z.number().min(1, 'Quantity must be >= 1'),
            })
        )
        .min(1, 'At least one variant is required'),

    images: z
        .array(
            z.object({
                id: z.string().optional(),
                url: z.string().url('Invalid image URL'),
                fileName: z.string().optional(),
            })
        )
        .optional()
        .default([]),
});

// TypeScript type derived from Zod
export type CreateProductInput = z.infer<typeof CreateProductSchema>;