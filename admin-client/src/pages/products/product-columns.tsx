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
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { formatCryptoPrice } from '@/utils/get-product-price.ts';

// Define Product Schema
// Define Product Schema

// Generate TypeScript type
export type Product = z.infer<typeof ProductSchema>;

// Function to generate productColumns
export const generateColumns = (
    includeColumns: Array<keyof Product | 'actions'>
): ColumnDef<Product>[] => {
    const baseColumns: ColumnDef<Product>[] = includeColumns.map((column) => {
        switch (column) {
            case 'thumbnail':
                return {
                    accessorKey: 'thumbnail',
                    header: '',
                    cell: ({ row }) => {
                        const thumbnail = row.original.thumbnail; // Access thumbnail directly
                        return (
                            <div className="w-[100px] h-[100px] px-[15px] flex items-center justify-center">
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
                                        - {subtitle}
                                    </span>
                                )}
                            </div>
                        );
                    },
                };

            case 'category':
                return {
                    accessorKey: 'category',
                    header: 'Category',
                    cell: ({ row }) => (
                        <div>{row.getValue('category') || 'Uncategorized'}</div>
                    ),
                };

            case 'variants':
                return {
                    accessorKey: 'variants',
                    header: 'Variants',
                    cell: ({ row }) => {
                        const variants = row.original.variants || []; // Handle undefined/null

                        if (!Array.isArray(variants) || variants.length === 0) {
                            return (
                                <div className="text-muted-foreground">
                                    No variants available
                                </div>
                            );
                        }

                        return (
                            <div className="flex flex-col">
                                {/* Collapsible Root */}
                                <Collapsible>
                                    <CollapsibleTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            {variants.length} variant
                                            {variants.length > 1
                                                ? 's'
                                                : ''}{' '}
                                            available
                                        </Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="pt-2">
                                        <table className="table-auto w-full text-sm">
                                            <thead>
                                                <tr>
                                                    <th className="text-left">
                                                        Title
                                                    </th>
                                                    <th className="text-left">
                                                        SKU
                                                    </th>
                                                    <th className="text-left">
                                                        Prices
                                                    </th>
                                                    <th className="text-left">
                                                        Inventory
                                                    </th>
                                                    <th className="text-left">
                                                        Backorder
                                                    </th>
                                                    <th className="text-left">
                                                        Created At
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {variants.map((variant) => (
                                                    <tr key={variant.id}>
                                                        <td>{variant.title}</td>
                                                        <td>
                                                            {variant.sku ||
                                                                'N/A'}
                                                        </td>
                                                        <td>
                                                            {variant.prices
                                                                ?.map(
                                                                    (price) =>
                                                                        `${formatCryptoPrice(price.amount, price.currency_code || 'usdc')} ${price.currency_code}`
                                                                )
                                                                .join(', ') ||
                                                                'N/A'}
                                                        </td>
                                                        <td>
                                                            {
                                                                variant.inventory_quantity
                                                            }
                                                        </td>
                                                        <td>
                                                            {variant.allow_backorder
                                                                ? 'Yes'
                                                                : 'No'}
                                                        </td>
                                                        <td>
                                                            {new Date(
                                                                variant.created_at
                                                            ).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </CollapsibleContent>
                                </Collapsible>
                            </div>
                        );
                    },
                };
            case 'actions':
                return {
                    id: 'actions',
                    cell: ({ row }) => {
                        const product = row.original;

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
                                                product.id
                                            )
                                        }
                                    >
                                        Copy Product ID
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => console.log(product)}
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
export const productColumns = generateColumns([
    'thumbnail',
    'title',
    'category',
    'variants',
    'actions',
]);
