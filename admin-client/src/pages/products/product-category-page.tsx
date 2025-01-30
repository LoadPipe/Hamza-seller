'use client';

import { useQuery } from '@tanstack/react-query';
import { getSecure } from '@/utils/api-calls';
import {
    ColumnDef,
    flexRender,
    useReactTable,
    getCoreRowModel,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AddCategoryDialog from '@/pages/products/utils/add-category-dialog';
import { useNavigate } from '@tanstack/react-router';
import { fetchAllCategories } from '@/pages/products/api/product-categories';

interface Category {
    id: string;
    name: string;
    handle: string;
    parent_category_id: string | null;
    is_active: boolean;
    rank: number;
    description: string;
}

export default function ProductCategoryPage() {
    const navigate = useNavigate();

    // Fetch categories using getSecure and useQuery
    const {
        data: categories,
        isLoading,
        error,
    } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => fetchAllCategories(),
    });

    // Define table productColumns
    const columns: ColumnDef<Category>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
        },
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'handle',
            header: 'Handle',
        },
        {
            accessorKey: 'parent_category_id',
            header: 'Parent',
            cell: ({ row }) => row.original.parent_category_id || 'None',
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ row }) => (
                <Button variant="outline" size="sm">
                    {row.original.is_active ? 'Active' : 'Inactive'}
                </Button>
            ),
        },
    ];

    // Initialize the table without pagination
    const table = useReactTable({
        data: categories || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="min-h-screen bg-black px-8 py-12 text-white">
            <button
                className="mb-4"
                onClick={() =>
                    navigate({
                        to: '/products',
                    })
                }
            >
                Back to All Products
            </button>
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <AddCategoryDialog />
                </div>
                {isLoading ? (
                    <p>Loading categories...</p>
                ) : error ? (
                    <p>Error loading categories.</p>
                ) : (
                    <Table className="table-fixed w-full bg-[#1A1A1A] rounded-lg p-4">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow className="h-10" key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            className="px-4 py-2"
                                            key={header.id}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                className="px-4 py-2"
                                                key={cell.id}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow className="h-10">
                                    <TableCell
                                        colSpan={columns.length}
                                        className="text-center px-4 py-2"
                                    >
                                        No categories found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}
