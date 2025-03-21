import { z } from 'zod';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, HelpCircle } from 'lucide-react';
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
// import { openOrderEscrowDialog } from '@/stores/order-escrow/order-escrow-store.ts';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    convertCryptoPrice,
    formatCryptoPrice,
} from '@/utils/get-product-price';
import React from 'react';
import { OrderSchema } from '@/pages/orders/order-schema.ts';

// Generate TypeScript type from Zod schema
export type Order = z.infer<typeof OrderSchema>;

// Pure Function; We aren't using sideEffects here, the purpose of this function is to generate orderColumns
export const generateColumns = (
    includeColumns: Array<keyof Order | 'select' | 'actions'>
): ColumnDef<Order>[] => {
    const baseColumns: ColumnDef<Order>[] = includeColumns.map((column) => {
        switch (column) {
            case 'select':
                return {
                    id: 'select',
                    header: ({ table }) => (
                        <div className="flex ">
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
                                className="order-table-checkbox"
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
                                className="order-table-checkbox"
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
                            variant="ghost"
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
                        // Truncate to show the end of the string and add ellipsis
                        const cleanedId = orderId.replace(/^order_/, '#');
                        const truncatedId =
                            cleanedId.length > 11
                                ? `...${cleanedId.slice(-11)}` // Show the last 11 characters
                                : cleanedId;
                        return <div>{truncatedId}</div>;
                    },
                };
            case 'items':
                return {
                    accessorKey: 'items',
                    header: () => (
                        <Button
                            variant={'ghost'}
                            className=" text-white hover:text-opacity-70 w-40" // Added width to make the column wider
                            onClick={() => {
                                // column.toggleSorting(
                                //     column.getIsSorted() === 'asc'
                                // );
                            }}
                        >
                            Items
                        </Button>
                    ),
                    cell: ({ row }) => {
                        const items = row.getValue('items') as Order['items'];
                        return (
                            <div>
                                {items && items.length === 1 ? (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span>
                                                <HelpCircle
                                                    className="mr-1 h-4 w-4 inline mb-1"
                                                    style={{
                                                        color: 'mediumslateblue',
                                                        marginBottom: '1px',
                                                    }}
                                                />
                                                <span>{`${items.length} item ordered`}</span>
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {items[0].quantity} x{' '}
                                            {items[0].title}
                                        </TooltipContent>
                                    </Tooltip>
                                ) : items && items.length > 1 ? (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span>
                                                <HelpCircle
                                                    className="mr-1 h-4 w-4 inline mb-1"
                                                    style={{
                                                        color: 'mediumslateblue',
                                                        marginBottom: '3px',
                                                    }}
                                                />
                                                <span>{`${items.length} items ordered`}</span>
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <ul className="list-disc pl-4">
                                                {items.map((item, index) => (
                                                    <li key={index}>
                                                        {item.quantity} x{' '}
                                                        {item.title}
                                                    </li>
                                                ))}
                                            </ul>
                                        </TooltipContent>
                                    </Tooltip>
                                ) : (
                                    '0 items ordered'
                                )}
                            </div>
                        );
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
                        // Determine the class based on the fulfillment status
                        let statusClass = 'bg-amber-700 text-black'; // Default gray class

                        if (paymentStatus === 'captured') {
                            statusClass = 'bg-amber-500 text-black';
                        } else if (paymentStatus === 'refunded') {
                            statusClass = 'bg-lime-400 text-black';
                        } else if (paymentStatus === 'partially_refunded') {
                            statusClass = 'bg-gray-700 text-white';
                        } else if (paymentStatus === 'canceled') {
                            statusClass = 'bg-zinc-900 text-white';
                        } else if (paymentStatus === 'requires_action') {
                            statusClass = 'bg-rose-500 text-white';
                        }

                        return (
                            <div
                                className={`inline-block px-4 py-2 rounded-md ${statusClass}`}
                            >
                                {formatStatus(paymentStatus)}
                            </div>
                        );
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
                        let statusClass = 'bg-gray-700 text-white'; // Default gray class
                        if (
                            orderStatus === 'fulfilled' ||
                            orderStatus === 'returned' ||
                            orderStatus === 'shipped'
                        ) {
                            statusClass = 'bg-lime-400 text-black'; // Green box for fulfilled or returned
                        } else if (orderStatus === 'canceled') {
                            statusClass = 'bg-zinc-900 text-white'; // Red box for canceled
                        } else if (orderStatus === 'requires_action') {
                            statusClass = 'bg-rose-500 text-white';
                        }

                        // Format the status using your `formatStatus` function
                        const formattedStatus = formatStatus(orderStatus);

                        return (
                            <div
                                className={`inline-block px-4 py-2 rounded-md ${statusClass}`}
                            >
                                {formattedStatus}
                            </div>
                        );
                    },
                };

            case 'price':
                return {
                    accessorKey: 'payments',
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
                            Price
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
                        const payments = row.getValue('payments') as
                            | {
                                  amount: number;
                                  currency_code: string;
                              }[]
                            | undefined;

                        if (!payments || payments.length === 0) {
                            return <div>--</div>; // No payments available
                        }
                        const formatted = `${formatCryptoPrice(
                            payments[0]?.amount,
                            payments[0]?.currency_code
                        )}`;

                        // Use state to handle the asynchronous value
                        const [convertedPrice, setConvertedPrice] =
                            React.useState<string | null>(null);

                        React.useEffect(() => {
                            const fetchConvertedPrice = async () => {
                                const result = await convertCryptoPrice(
                                    Number(formatted),
                                    'eth',
                                    'usdc'
                                );
                                const formattedResult =
                                    Number(result).toFixed(2);
                                setConvertedPrice(formattedResult);
                            };

                            if (payments[0]?.currency_code === 'eth') {
                                fetchConvertedPrice();
                            }
                        }, [payments]);

                        return (
                            <div className="font-medium">
                                {/* Render the synchronous formatted value */}
                                {formatted}

                                {/* Render the asynchronous converted value */}
                                {convertedPrice !== null &&
                                    payments[0]?.currency_code === 'eth' && (
                                        <div className="text-[12px] text-[#94D42A]">
                                            ≅ {convertedPrice} (usdc)
                                        </div>
                                    )}
                            </div>
                        );
                    },
                };

            case 'currency_code':
                return {
                    accessorKey: 'currency_code',
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
                            Currency
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
                        const currencyCode = row.getValue(
                            'currency_code'
                        ) as string;

                        return (
                            <div className="font-medium">{currencyCode}</div>
                        );
                    },
                };

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

                                    <DropdownMenuItem
                                        onClick={() =>
                                            openOrderSidebar(order.id)
                                        }
                                    >
                                        View order details
                                    </DropdownMenuItem>
                                    {/*/!*TODO: We have temp removed this for now.. it will be back*!/*/}
                                    {/*{order.payment_status !== 'refunded' &&*/}
                                    {/*    order.payment_status !== 'canceled' &&*/}
                                    {/*    order.payment_status !== 'not_paid' && (*/}
                                    {/*        <DropdownMenuItem*/}
                                    {/*            onClick={() =>*/}
                                    {/*                openOrderEscrowDialog(order)*/}
                                    {/*            }*/}
                                    {/*        >*/}
                                    {/*            Release Escrow*/}
                                    {/*        </DropdownMenuItem>*/}
                                    {/*    )}*/}
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
export const orderColumns = generateColumns([
    'actions',
    'select',
    'id',
    'items',
    'customer_id',
    'customer',
    'created_at',
    'payment_status',
    'price',
    'currency_code',
    'email',
    'fulfillment_status',
]);
