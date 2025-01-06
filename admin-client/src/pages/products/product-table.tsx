'use client';

import React, { useEffect } from 'react';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, RefreshCw, Settings, Download } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
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
import { convertJSONToCSV, downloadCSV } from '@/utils/json-to-csv';

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    sku: string;
}

interface ProductTableProps {
    columns: ColumnDef<Product, any>[];
    data: Product[];
    pageIndex: number;
    pageSize: number;
    setPageIndex: React.Dispatch<React.SetStateAction<number>>;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
    totalRecords: number;
    sorting: SortingState;
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
    isLoading: boolean;
}

export function ProductTable({
    columns,
    data,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    totalRecords,
    sorting,
    setSorting,
    isLoading,
}: ProductTableProps) {
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const pageCount = Math.ceil(totalRecords / pageSize);

    const table = useReactTable({
        data,
        columns,
        manualSorting: true,
        pageCount,
        onSortingChange: setSorting,
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination: {
                pageIndex,
                pageSize,
            },
        },
    });

    const localStorageColumnSettingsKey = 'productTableColumnVisibility';

    useEffect(() => {
        const savedVisibility = JSON.parse(
            localStorage.getItem(localStorageColumnSettingsKey) || '{}'
        );
        if (savedVisibility) {
            table.getAllColumns().forEach((column) => {
                if (
                    column.getCanHide() &&
                    savedVisibility[column.id] !== undefined
                ) {
                    column.toggleVisibility(savedVisibility[column.id]);
                }
            });
        }
    }, [table]);

    const handleCheckedChange = (columnId: string, value: boolean) => {
        const currentVisibility = JSON.parse(
            localStorage.getItem(localStorageColumnSettingsKey) || '{}'
        );
        currentVisibility[columnId] = value;
        localStorage.setItem(
            localStorageColumnSettingsKey,
            JSON.stringify(currentVisibility)
        );
    };

    const handleDownloadCSV = () => {
        const dataCSV = convertJSONToCSV(
            data,
            columns.map((col) => col.id)
        );
        downloadCSV(`${dataCSV}`, 'products.csv');
    };

    return (
        <div className="flex flex-col min-h-screen max-w-[1280px] mx-auto bg-[#121212] rounded-lg">
            {/* Filters and Actions */}
            <div className="flex justify-between items-center py-4 px-6 bg-[#1E1E1E]">
                <Input
                    placeholder="Search products..."
                    className="bg-[#242424] text-white w-1/3 rounded-lg border-none"
                />
                <div className="flex gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="bg-[#242424] text-white"
                            >
                                {pageSize} per page
                                <ChevronDown className="ml-2 w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {[5, 10, 20, 50].map((size) => (
                                <DropdownMenuCheckboxItem
                                    key={size}
                                    checked={pageSize === size}
                                    onCheckedChange={() => setPageSize(size)}
                                >
                                    {size}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        variant="outline"
                        className="bg-[#242424] text-white"
                        onClick={handleDownloadCSV}
                    >
                        <Download />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-auto px-6">
                <Table className="table-fixed w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            [...Array(pageSize)].map((_, idx) => (
                                <TableRow key={idx}>
                                    {columns.map((col) => (
                                        <TableCell key={col.id}>
                                            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows.length > 0 ? (
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
                                    No products found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center py-4 px-6 bg-[#1E1E1E]">
                <Button
                    variant="outline"
                    className="bg-[#242424] text-white"
                    disabled={pageIndex === 0}
                    onClick={() => setPageIndex(pageIndex - 1)}
                >
                    Previous
                </Button>
                <span className="text-white">
                    Page {pageIndex + 1} of {pageCount}
                </span>
                <Button
                    variant="outline"
                    className="bg-[#242424] text-white"
                    disabled={pageIndex === pageCount - 1}
                    onClick={() => setPageIndex(pageIndex + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
