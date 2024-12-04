import { z } from 'zod';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { openOrderSidebar } from '@/stores/order-sidebar/order-sidebar-store.ts';
import { formatStatus, formatDate, customerName } from '@/utils/format-data.ts';

// Define the Zod schema for the columns you want to display
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
    email: z.string().email(), // Add email back to the schema
    customer: z
        .object({
            first_name: z.string(),
            last_name: z.string(),
        })
        .optional(), // Make it optional in case of any missing data
});

// Generate TypeScript type from Zod schema
type Order = z.infer<typeof OrderSchema>;

// Define a dynamic column generation function
export const generateColumns = (
    includeColumns: Array<keyof Order | 'select' | 'actions'>
): ColumnDef<Order>[] => {
    const baseColumns: ColumnDef<Order>[] = includeColumns.map((column) => {
        switch (column) {
            case 'select':
                return {
                    id: 'select',
                    header: ({ table }) => (
                        <div className="flex">
                            <Checkbox
                                checked={
                                    table.getIsAllPageRowsSelected() ||
                                    (table.getIsSomePageRowsSelected() &&
                                        'indeterminate')
                                }
                                onCheckedChange={(value) =>
                                    table.toggleAllPageRowsSelected(!!value)
                                }
                                aria-label="Select all"
                            />
                        </div>
                    ),
                    cell: ({ row }) => (
                        <div className="flex">
                            <Checkbox
                                checked={row.getIsSelected()}
                                onCheckedChange={(value) =>
                                    row.toggleSelected(!!value)
                                }
                                aria-label="Select row"
                            />
                        </div>
                    ),
                    enableSorting: false,
                    enableHiding: false,
                    size: 40, // Fix column size
                };

            case 'id':
                return {
                    accessorKey: 'id',
                    header: ({ column }) => (
                        <Button
                            variant={'ghost'}
                            className=" text-white hover:text-opacity-70 "
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === 'asc'
                                )
                            }
                        >
                            Order
                            {column.getIsSorted() === 'asc' && (
                                <ArrowUp className="ml-2 h-4 w-4" />
                            )}
                            {column.getIsSorted() === 'desc' && (
                                <ArrowDown className="ml-2 h-4 w-4" />
                            )}
                            {!column.getIsSorted() && (
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            )}
                        </Button>
                    ),
                    cell: ({ row }) => {
                        const orderId: string = row.getValue('id');
                        // Truncate after 11 characters and add ellipsis
                        const cleanedId = orderId.replace(/^order_/, '#');
                        const truncatedId =
                            cleanedId.length > 11
                                ? `${cleanedId.slice(0, 11)}...`
                                : cleanedId;
                        return <div>{truncatedId}</div>;
                    },
                };
            case 'customer':
                return {
                    accessorKey: 'customer', // Use accessor key as customer
                    header: ({ column }) => (
                        <Button
                            variant={'ghost'}
                            className=" text-white hover:text-opacity-70 "
                            onClick={() => {
                                column.toggleSorting(
                                    column.getIsSorted() === 'asc'
                                );
                            }}
                        >
                            Customer
                            {column.getIsSorted() === 'asc' && (
                                <ArrowUp className="ml-2 h-4 w-4" />
                            )}
                            {column.getIsSorted() === 'desc' && (
                                <ArrowDown className="ml-2 h-4 w-4" />
                            )}
                            {!column.getIsSorted() && (
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            )}
                        </Button>
                    ),
                    cell: ({ row }) => {
                        const customer = row.getValue(
                            'customer'
                        ) as Order['customer'];
                        if (!customer) return <div>Unknown Customer</div>;
                        return (
                            <div>
                                {customerName(
                                    customer.first_name,
                                    customer.last_name
                                )}
                            </div>
                        );
                    },
                };
            case 'created_at':
                return {
                    accessorKey: 'created_at',
                    header: ({ column }) => (
                        <Button
                            variant={'ghost'}
                            className=" text-white hover:text-opacity-70 "
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === 'asc'
                                )
                            }
                        >
                            Date
                            {column.getIsSorted() === 'asc' && (
                                <ArrowUp className="ml-2 h-4 w-4" />
                            )}
                            {column.getIsSorted() === 'desc' && (
                                <ArrowDown className="ml-2 h-4 w-4" />
                            )}
                            {!column.getIsSorted() && (
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            )}
                        </Button>
                    ),
                    cell: ({ row }) => {
                        const date = new Date(row.getValue('created_at'));
                        return (
                            <div className="flex flex-row ">
                                {formatDate(date)}
                            </div>
                        );
                    },
                };
            case 'payment_status':
                return {
                    accessorKey: 'payment_status',
                    header: ({ column }) => (
                        <Button
                            variant={'ghost'}
                            className=" text-white hover:text-opacity-70 "
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === 'asc'
                                )
                            }
                        >
                            Payment
                            {column.getIsSorted() === 'asc' && (
                                <ArrowUp className="ml-2 h-4 w-4" />
                            )}
                            {column.getIsSorted() === 'desc' && (
                                <ArrowDown className="ml-2 h-4 w-4" />
                            )}
                            {!column.getIsSorted() && (
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            )}
                        </Button>
                    ),
                    cell: ({ row }) => {
                        const paymentStatus = row.getValue(
                            'payment_status'
                        ) as Order['payment_status'];
                        return <div>{formatStatus(paymentStatus)}</div>;
                    },
                };
            case 'fulfillment_status':
                return {
                    accessorKey: 'fulfillment_status',
                    header: ({ column }) => (
                        <Button
                            variant={'ghost'}
                            className=" text-white hover:text-opacity-70 "
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === 'asc'
                                )
                            }
                        >
                            Fulfillment Status
                            {column.getIsSorted() === 'asc' && (
                                <ArrowUp className="ml-2 h-4 w-4" />
                            )}
                            {column.getIsSorted() === 'desc' && (
                                <ArrowDown className="ml-2 h-4 w-4" />
                            )}
                            {!column.getIsSorted() && (
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            )}
                        </Button>
                    ),
                    cell: ({ row }) => {
                        const orderStatus = row.getValue(
                            'fulfillment_status'
                        ) as Order['fulfillment_status'];

                        // Determine the class based on the fulfillment status
                        let statusClass = 'bg-gray-800 text-white'; // Default gray class
                        if (
                            orderStatus === 'fulfilled' ||
                            orderStatus === 'returned'
                        ) {
                            statusClass = 'bg-green-800 text-green-800'; // Green box for fulfilled or returned
                        } else if (orderStatus === 'canceled') {
                            statusClass = 'bg-red-800 text-red-800'; // Red box for canceled
                        }

                        // Format the status using your `formatStatus` function
                        const formattedStatus = formatStatus(orderStatus);

                        return (
                            <div
                                className={`inline-block px-4 py-1 rounded-lg ${statusClass}`}
                            >
                                {formattedStatus}
                            </div>
                        );
                    },
                };

            // case 'price':
            //     return {
            //         accessorKey: 'price',
            //         header: ({ column }) => (
            //             <Button
            //                 variant={'ghost'}
            //                 className=" text-white hover:text-opacity-70 "
            //                 onClick={() =>
            //                     column.toggleSorting(
            //                         column.getIsSorted() === 'asc'
            //                     )
            //                 }
            //             >
            //                 Price
            //                 {column.getIsSorted() === 'asc' && (
            //                     <ArrowUp className="ml-2 h-4 w-4" />
            //                 )}
            //                 {column.getIsSorted() === 'desc' && (
            //                     <ArrowDown className="ml-2 h-4 w-4" />
            //                 )}
            //                 {!column.getIsSorted() && (
            //                     <ArrowUpDown className="ml-2 h-4 w-4" />
            //                 )}
            //             </Button>
            //         ),
            //         cell: ({ row }) => {
            //             const price = row.getValue('price') as Order['price'];
            //             if (price === undefined) return <div>--</div>;
            //             const formatted = new Intl.NumberFormat('en-US', {
            //                 style: 'currency',
            //                 currency: 'USD',
            //             }).format(price);
            //             return (
            //                 <div className="text-right font-medium">
            //                     {formatted}
            //                 </div>
            //             );
            //         },
            //     };
            case 'email':
                return {
                    accessorKey: 'email',
                    header: ({ column }) => (
                        <Button
                            variant={'ghost'}
                            className=" text-white hover:text-opacity-70 "
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === 'asc'
                                )
                            }
                        >
                            Email
                            {column.getIsSorted() === 'asc' && (
                                <ArrowUp className="ml-2 h-4 w-4" />
                            )}
                            {column.getIsSorted() === 'desc' && (
                                <ArrowDown className="ml-2 h-4 w-4" />
                            )}
                            {!column.getIsSorted() && (
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            )}
                        </Button>
                    ),
                    cell: ({ row }) => {
                        const email = row.getValue('email') as string;
                        // Check if email contains @evm
                        if (email.includes('@evm')) {
                            return <div>--</div>; // Render placeholder for undefined
                        }
                        return <div>{email}</div>; // Render the email otherwise
                    },
                };
            case 'actions':
                return {
                    id: 'actions',
                    cell: ({ row }) => {
                        const order = row.original;

                        return (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                    >
                                        <span className="sr-only">
                                            Open menu
                                        </span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                        Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            navigator.clipboard.writeText(
                                                order.id
                                            )
                                        }
                                    >
                                        Copy order ID
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        View customer
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            openOrderSidebar(order.id)
                                        }
                                    >
                                        View order details
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        );
                    },
                };
            default:
                return null as never;
        }
    });

    return baseColumns.filter(Boolean);
};

// Usage
export const columns = generateColumns([
    'select',
    'id',
    'customer_id',
    'customer',
    'created_at',
    'payment_status',
    'price',
    'email',
    'fulfillment_status',
    'actions',
]);
