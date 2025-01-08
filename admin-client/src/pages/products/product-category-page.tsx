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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
        queryFn: async () => {
            const response = await getSecure('/seller/product/categories', {});
            return response;
        },
    });

    // Define table columns
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
        {
            accessorKey: 'rank',
            header: 'Rank',
        },
        {
            accessorKey: 'description',
            header: 'Description',
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            ...
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => console.log('Edit', row.original)}
                        >
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => console.log('Delete', row.original)}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
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
                    {/*<AddCategoryDialog />*/}
                </div>
                {isLoading ? (
                    <p>Loading categories...</p>
                ) : error ? (
                    <p>Error loading categories.</p>
                ) : (
                    <Table className="table-fixed w-full bg-[#1A1A1A] rounded-lg">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
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
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="text-center"
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
