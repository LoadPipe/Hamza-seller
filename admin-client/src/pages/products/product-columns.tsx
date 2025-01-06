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

// Define Product Schema
export const ProductSchema = z.object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string().optional().nullable(),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    category: z.string().optional(),
    variants: z
        .array(
            z.object({
                id: z.string(),
                title: z.string(),
                sku: z.string().nullable(),
                inventory_quantity: z.number(),
                prices: z.array(
                    z.object({
                        id: z.string(),
                        currency_code: z.string(),
                        amount: z.string(),
                    })
                ),
            })
        )
        .optional()
        .nullable(),
});

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
                        const variants = row.original.variants || []; // Access variants directly from row.original

                        if (!variants.length) {
                            return (
                                <div className="text-muted-foreground">
                                    No variants available
                                </div>
                            );
                        }

                        if (variants.length === 1) {
                            const variant = variants[0];
                            const price = variant.prices?.[0]?.amount || 'N/A'; // Get the first price
                            const currency =
                                variant.prices?.[0]?.currency_code || '';
                            return (
                                <div>
                                    <div>
                                        Price: {price} {currency}
                                    </div>
                                    <div>SKU: {variant.sku || 'N/A'}</div>
                                </div>
                            );
                        }

                        // Render dropdown for multiple variants
                        return (
                            <div className="flex flex-col">
                                <div className="text-sm text-muted-foreground">
                                    {variants.length} variants available
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            View Variants
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {variants.map((variant) => (
                                            <DropdownMenuItem key={variant.id}>
                                                <div>
                                                    <div>
                                                        Title: {variant.title}
                                                    </div>
                                                    <div>
                                                        SKU:{' '}
                                                        {variant.sku || 'N/A'}
                                                    </div>
                                                    <div>
                                                        Price:{' '}
                                                        {variant.prices?.[0]
                                                            ?.amount ||
                                                            'N/A'}{' '}
                                                        {variant.prices?.[0]
                                                            ?.currency_code ||
                                                            ''}
                                                    </div>
                                                </div>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
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
