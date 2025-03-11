import { z } from 'zod';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProductSchema } from '@/pages/products/product-schema.ts';
import { formatCryptoPrice } from '@/utils/get-product-price.ts';
import { useNavigate } from '@tanstack/react-router';
import { useCustomerAuthStore } from '@/stores/authentication/customer-auth';
import { Checkbox } from '@/components/ui/checkbox.tsx';

import { downloadProductsCSV } from './utils/export-product-csv';

// Generate TypeScript type
export type Product = z.infer<typeof ProductSchema>;

// Function to generate orderColumns
export const generateColumns = (
    includeColumns: Array<
        keyof Product | 'actions' | 'price' | 'inventory_quantity' | 'select'
    >
): ColumnDef<Product>[] => {
    const baseColumns: ColumnDef<Product>[] = includeColumns.map((column) => {
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
            case 'thumbnail':
                return {
                    accessorKey: 'thumbnail',
                    header: 'Thumbnail',
                    cell: ({ row }) => {
                        const thumbnail = row.original.thumbnail; // Access thumbnail directly
                        return (
                            <div className="w-[56px] h-[56px] px-[2px] flex items-center justify-center">
                                {thumbnail ? (
                                    <img
                                        src={thumbnail}
                                        alt={
                                            row.original.title ||
                                            'Product Image'
                                        }
                                        className="object-cover rounded-md"
                                    />
                                ) : null}
                            </div>
                        );
                    },
                    enableSorting: false,
                    enableHiding: false,
                };

            case 'title':
                return {
                    accessorKey: 'title',
                    header: ({ column }) => (
                        <Button
                            variant="ghost"
                            className="text-white hover:text-opacity-70"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === 'asc'
                                )
                            }
                        >
                            Product Name
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
                        const title = row.getValue('title') as string;
                        const subtitle = row.original.subtitle;
                        return (
                            <div>
                                <span className="font-medium">{title}</span>
                                {subtitle && (
                                    <span className="text-muted-foreground text-sm">
                                        {' '}
                                        -{' '}
                                        {subtitle.length > 20
                                            ? `${subtitle.slice(0, 20)}...`
                                            : subtitle}
                                    </span>
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
                        const createdAt = new Date(row.original.created_at);
                        return createdAt.toLocaleDateString();
                    },
                    enableSorting: true,
                    sortingFn: (rowA, rowB) => {
                        const dateA = new Date(
                            rowA.original.created_at
                        ).getTime();
                        const dateB = new Date(
                            rowB.original.created_at
                        ).getTime();
                        return dateA - dateB;
                    },
                };

            case 'categories':
                return {
                    accessorKey: 'categories',
                    header: 'Categories',
                    cell: ({ row }) => {
                        const categories = row.original.categories || [];
                        return categories.length
                            ? categories.map((cat) => cat.name).join(', ')
                            : 'Uncategorized';
                    },
                    accessorFn: (row) =>
                        row.categories?.map((cat) => cat.name).join(', ') ||
                        'Uncategorized',
                    enableSorting: true,
                    sortingFn: (rowA, rowB) => {
                        const catA = rowA.original.categories?.[0]?.name || '';
                        const catB = rowB.original.categories?.[0]?.name || '';
                        return catA.localeCompare(catB);
                    },
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
                            Product
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
                        const cleanedId = orderId.replace(/^products_/, '#');
                        const truncatedId =
                            cleanedId.length > 11
                                ? `...${cleanedId.slice(-11)}` // Show the last 11 characters
                                : cleanedId;
                        return <div>{truncatedId}</div>;
                    },
                };

            case 'price':
                return {
                    accessorKey: 'price',
                    accessorFn: (row) => row.variants?.[0]?.prices || 'N/A',
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
                        const variants = row.original.variants || [];
                        const preferredCurrency = useCustomerAuthStore(
                            (state) => state.preferred_currency_code ?? 'eth'
                        );
                        if (variants.length === 1) {
                            const variant = variants[0];
                            return (
                                <div className="flex gap-4 items-center">
                                    {/* Prices */}
                                    <div className="space-y-1">
                                        {variant.prices?.length > 0 ? (
                                            variant.prices
                                                .filter(
                                                    (price) =>
                                                        price.currency_code ===
                                                        preferredCurrency
                                                )
                                                .map((price, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <span>
                                                            {[
                                                                'usdc',
                                                                'usdt',
                                                            ].includes(
                                                                price.currency_code.toLowerCase()
                                                            )
                                                                ? '≈ '
                                                                : ''}
                                                            {formatCryptoPrice(
                                                                Number(
                                                                    price.amount
                                                                ),
                                                                price.currency_code
                                                            )}
                                                        </span>
                                                        <span>
                                                            {[
                                                                'usdc',
                                                                'usdt',
                                                            ].includes(
                                                                price.currency_code.toLowerCase()
                                                            )
                                                                ? 'USD'
                                                                : price.currency_code.toUpperCase()}
                                                        </span>
                                                    </div>
                                                ))
                                        ) : (
                                            <div>N/A</div>
                                        )}
                                    </div>
                                </div>
                            );
                        }
                    },
                };

            case 'inventory_quantity':
                return {
                    id: 'inventory_quantity',
                    header: 'Inventory Quantity',
                    accessorFn: (row) =>
                        row.variants?.[0]?.inventory_quantity || 'N/A',
                    cell: ({ row }) => {
                        const variants = row.original.variants || [];
                        if (variants.length > 1) return; // Inventory shown in dropdown for multi-variant products
                        return variants[0]?.inventory_quantity || 'N/A';
                    },
                    enableSorting: false,
                };

            case 'actions':
                return {
                    id: 'actions',
                    cell: ({ row }) => {
                        const product = row.original;
                        const navigate = useNavigate();
                        return (
                            <div className="flex justify-end">
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
                                                    product.id
                                                )
                                            }
                                        >
                                            Copy Product ID
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                downloadProductsCSV(product.id)
                                            }
                                        >
                                            Export Product CSV
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() =>
                                                navigate({
                                                    to: `/products/${product.id}/edit`,
                                                })
                                            }
                                        >
                                            Edit Product
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => console.log(product)}
                                        >
                                            Delete Product
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
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
    'variants',
    'actions',
    'select',
    'thumbnail',
    'id',
    'title',
    'categories',
    'created_at',
    'price',
    'inventory_quantity',
]);
