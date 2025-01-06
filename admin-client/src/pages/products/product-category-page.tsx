// Note this is a scaffolded component and should be used as a reference only
// Ideally this follows our Page -> Table -> Column -> Cell component structure
// This is a placeholder for the actual implementation
// DOOMED FOR DELETION
'use client';

import React, { useState } from 'react';
import {
    ColumnDef,
    flexRender,
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
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

interface Category {
    id: string;
    name: string;
    handle: string;
    parent: string | null; // Can be `null` if there's no parent
    status: boolean; // `true` for active, `false` for inactive
    rank: number;
    description: string;
}

const mockData: Category[] = [
    {
        id: '1',
        name: 'Uncategorized',
        handle: 'uncategorized',
        parent: null,
        status: true,
        rank: 1,
        description: 'Default uncategorized category.',
    },
    {
        id: '2',
        name: 'Electronics',
        handle: 'electronics',
        parent: null,
        status: true,
        rank: 2,
        description: 'All electronics products.',
    },
    {
        id: '3',
        name: 'Laptop',
        handle: 'laptop',
        parent: 'Electronics',
        status: true,
        rank: 3,
        description: 'Laptops and notebooks.',
    },
];

export default function ProductCategoryPage() {
    const [data, setData] = useState(mockData);

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
            accessorKey: 'parent',
            header: 'Parent',
            cell: ({ row }) => row.original.parent || 'None',
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <Button variant="outline" size="sm">
                    {row.original.status ? 'Active' : 'Inactive'}
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

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="min-h-screen bg-black px-8 py-12 text-white">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <AddCategoryDialog />
                </div>
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
                <div className="flex justify-end mt-4">
                    <Button variant="ghost">1</Button>
                    <Button variant="ghost">2</Button>
                    <Button variant="ghost">3</Button>
                </div>
            </div>
        </div>
    );
}
