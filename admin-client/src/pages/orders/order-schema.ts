import { z } from 'zod';
// Define the Zod schema for the orderColumns you want to display
export const OrderSchema = z.object({
    id: z.string(),
    customer_id: z.string(),
    created_at: z.string(),
    payment_status: z.enum([
        'awaiting',
        'completed',
        'failed',
        'not_paid',
        'requires_action',
        'captured',
        'partially_refunded',
        'refunded',
        'canceled',
    ]),
    fulfillment_status: z.enum([
        'not_fulfilled',
        'partially_fulfilled',
        'fulfilled',
        'partially_shipped',
        'shipped',
        'partially_returned',
        'returned',
        'canceled',
        'requires_action',
    ]),
    price: z.number().optional(), // Optional since it's not always passed
    currency_code: z.string().optional().nullable(), // Optional since it's not always passed
    email: z.string().email(), // Add email back to the schema
    customer: z
        .object({
            first_name: z.string(),
            last_name: z.string(),
        })
        .optional(), // Make it optional in case of any missing data
    payments: z
        .array(
            z
                .object({
                    id: z.string(),
                    amount: z.number(),
                    currency_code: z.string(),
                    provider_id: z.string(),
                    created_at: z.string(),
                    blockchain_data: z
                        .object({
                            chain_id: z
                                .union([z.number(), z.string()])
                                .optional(),
                            payer_address: z.string().optional(),
                            escrow_address: z.string().optional(),
                            transaction_id: z.string().optional(),
                        })
                        .nullable()
                        .optional(),
                })
                .optional()
                .nullable()
        )
        .optional(), // Add payments as an optional array
    items: z
        .array(
            z.object({
                id: z.string(),
                title: z.string(),
                quantity: z.number(),
            })
        )
        .optional(), // Add items as an optional array
});
