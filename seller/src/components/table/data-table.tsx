import * as React from 'react';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
// import { Search } from 'lucide-react';

import OrderTabs from '@/components/orders/order-tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DropdownMultiselectFilter from '@/components/dropdown-checkbox/dropdown-multiselect-filter.tsx';
import {
    PaymentStatus,
    FulfillmentStatus,
    OrderStatus,
} from '@/utils/status-enum';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
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
import { useStore } from '@tanstack/react-store';
import {
    filterStore,
    setFilter,
    clearFilter,
    setDatePickerFilter,
} from '@/stores/order-filter/order-filter-store.ts';
import DatePickerFilter from '@/components/date-picker-filter/date-picker-filter.tsx';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pageIndex,
    pageSize,
    setPageIndex,
    // setPageSize,
    totalRecords,
    sorting,
    setSorting,
}: DataTableProps<TData, TValue> & {
    pageIndex: number;
    pageSize: number;
    setPageIndex: React.Dispatch<React.SetStateAction<number>>;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
    totalRecords: number;
    sorting: SortingState;
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
}) {
    // const { setSort } = useSortStore();
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);

    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const { filters } = useStore(filterStore); // Subscribe to filter store

    const pageCount = Math.ceil(totalRecords / pageSize);
    const getFilterValues = (key: string) => filters[key]?.in || [];
    const table = useReactTable({
        data,
        columns,
        manualSorting: true,
        manualPagination: true,
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

    return (
        <div className="flex min-h-screen">
            <div className="max-w-[1280px] w-full mx-4 bg-primary-black-90 rounded-xl p-[24px]">
                <OrderTabs />

                <div className="flex flex-row">
                    <div className="flex pb-[40px] gap-5">
                        <DropdownMultiselectFilter
                            title="Payment Status"
                            optionsEnum={PaymentStatus}
                            selectedFilters={getFilterValues('payment_status')} // Prepopulate selected filters
                            onFilterChange={(values) =>
                                values
                                    ? setFilter('payment_status', {
                                          in: values,
                                      })
                                    : clearFilter('payment_status')
                            }
                        />

                        <DropdownMultiselectFilter
                            title="Order Status"
                            optionsEnum={OrderStatus}
                            selectedFilters={getFilterValues('status')}
                            onFilterChange={(values) =>
                                values
                                    ? setFilter('status', { in: values })
                                    : clearFilter('status')
                            }
                        />

                        <DropdownMultiselectFilter
                            title="Fulfillment Status"
                            optionsEnum={FulfillmentStatus}
                            selectedFilters={getFilterValues(
                                'fulfillment_status'
                            )}
                            onFilterChange={(values) =>
                                values
                                    ? setFilter('fulfillment_status', {
                                          in: values,
                                      })
                                    : clearFilter('fulfillment_status')
                            }
                        />

                        <DatePickerFilter
                            title="Date Picker"
                            selectedFilters={filters['created_at']}
                            onDateRangeChange={(range, selectedOption) => {
                                console.log('[Parent] Received range:', range);
                                console.log(
                                    '[Parent] Received option:',
                                    selectedOption
                                );

                                if (range) {
                                    setDatePickerFilter(
                                        'created_at',
                                        { gte: range.start, lte: range.end },
                                        selectedOption || 'Custom Date Range' // Default if label is null
                                    );
                                } else {
                                    clearFilter('created_at');
                                }
                            }}
                        />
                    </div>

                    <div className="ml-auto flex flex-row relative w-[376px]">
                        <Input
                            placeholder="Search Order"
                            value={
                                (table
                                    .getColumn('id')
                                    ?.getFilterValue() as string) ?? ''
                            }
                            onChange={(event) =>
                                table
                                    .getColumn('id')
                                    ?.setFilterValue(event.target.value)
                            }
                            className="w-full h-[34px] pl-5 border-none placeholder-[#C2C2C2]  text-white rounded-full bg-black pr-10"
                        />
                        {/*<Search*/}
                        {/*    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"*/}
                        {/*    size={14}*/}
                        {/*/>*/}
                    </div>
                </div>

                <div className="rounded-md mt-9 overflow-x-auto">
                    <Table className="min-w-full">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext()
                                                      )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && 'selected'
                                        }
                                    >
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
                                    <TableCell colSpan={columns.length}>
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                {/* </div> */}

                {/* Pagination Controls */}

                <div className="flex justify-between mt-10">
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="ml-auto whitespace-nowrap"
                                >
                                    Columns
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                            onSelect={(e) => e.preventDefault()} // Prevent menu close on select
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex items-center justify-center space-x-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setPageIndex((old) => Math.max(old - 1, 0))
                            }
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <span className="flex items-center justify-center w-8 h-8">
                            {pageIndex + 1}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPageIndex((old) => old + 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                    <div className="flex text-sm text-muted-foreground m-2 justify-end">
                        {table.getFilteredSelectedRowModel().rows.length} of{' '}
                        {table.getFilteredRowModel().rows.length} row(s)
                        selected.
                    </div>
                </div>
            </div>
        </div>
    );
}
