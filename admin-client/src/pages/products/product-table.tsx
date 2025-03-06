'use client';

import React, { useEffect, useState } from 'react';
import { Download, FilePlus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
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
import { ChevronDown, Settings, ChevronUp } from 'lucide-react';
import {
    productStore,
    setProductFilter,
    clearProductFilter,
} from '@/stores/product-filter/product-filter-store.tsx';
import { useStore } from '@tanstack/react-store';
import ProductImportModal from '@/pages/products/utils/product-import-dialog.tsx';
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
import { formatCryptoPrice } from '@/utils/get-product-price.ts';
import { useCustomerAuthStore } from '@/stores/authentication/customer-auth.ts';

type Product = z.infer<typeof ProductSchema>;
type Category = NonNullable<
    z.infer<typeof ProductSchema>['categories']
>[number];

interface Price {
    id: string;
    currency_code: string; // Use camelCase for consistency
    amount: string; // Assuming amount is stored as a string
    minQuantity?: number | null; // Optional
    maxQuantity?: number | null; // Optional
    priceListId?: string | null; // Optional
    regionId?: string | null; // Optional
}

import DropdownMultiselectFilter from '@/components/dropdown-checkbox/dropdown-multiselect-filter.tsx';
import { ProductCategory } from '@/utils/status-enum.ts';
import { z } from 'zod';
import { ProductSchema } from '@/pages/products/product-schema.ts';
import { fetchAllCategories } from './api/product-categories';
import { useQuery } from '@tanstack/react-query';

interface ProductTableProps {
    columns: ColumnDef<Product, any>[];
    data: Product[];
    pageIndex: number;
    pageSize: number;
    productCategories: Record<string, string>;
    setPageIndex: React.Dispatch<React.SetStateAction<number>>;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
    totalRecords: number;
    filteredProductsCount: number;
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
    filteredProductsCount,
    sorting,
    setSorting,
    isLoading,
}: ProductTableProps) {
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const pageCount = Math.ceil(filteredProductsCount / pageSize);
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>(
        {}
    );
    const [isModalOpen, setModalOpen] = useState(false);
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);

    const { filters } = useStore(productStore);

    const getFilterValues = (key: string) => filters?.[key]?.in || [];

    // Fetch categories using getSecure and useQuery
    const {
        data: categories,
        isLoading: catIsLoading,
        error: catError,
    } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => fetchAllCategories(),
    });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        // manualSorting: true,
        // manualPagination: true,
        pageCount,
        onSortingChange: setSorting,
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
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

    useEffect(() => {
        console.log(table.getRowModel().rows);
    }, [table]);
    const navigate = useNavigate();
    const localStorageProductColumnSettingsKey = 'productTableColumnVisibility';

    useEffect(() => {
        const savedVisibility = JSON.parse(
            localStorage.getItem(localStorageProductColumnSettingsKey) || '{}'
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

    const toggleRowExpansion = (rowId: string) => {
        setExpandedRows((prev) => ({
            ...prev,
            [rowId]: !prev[rowId],
        }));
    };

    const preferredCurrency = useCustomerAuthStore(
        (state) => state.preferred_currency_code ?? 'eth'
    );

    // const handleFilterChange = (selected: string[] | null) => {
    //     if (selected) {
    //         setProductFilter('categories', { isLoading: selected });
    //     } else {
    //         clearProductFilter('categories');
    //     }
    // };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="max-w-[1280px] w-full mx-4 bg-primary-black-90 rounded-xl p-[24px]">
                {/* Filters and Actions */}
                <div className="flex flex-row gap-4 ml-auto ">
                    <div className="mb-4">
                        <Button
                            variant="outline"
                            className="hover:text-primary-purple-90 hover:bg-white  whitespace-nowrap bg-[#242424] hover:border-none w-[200px] h-[44px] text-white"
                            onClick={() =>
                                navigate({
                                    to: '/add-product',
                                })
                            }
                        >
                            Add new product
                            <FilePlus />
                        </Button>
                    </div>
                    <div className="text-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="hover:text-primary-purple-90 whitespace-nowrap bg-[#242424] hover:border-none w-[200px] h-[44px] text-white">
                                    <Download />
                                    Import
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem
                                    className="px-4 py-2 w-full "
                                    onClick={() => setModalOpen(true)} // Open the modal
                                >
                                    Import product as CSV
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <br />
                        <a
                            href="/sample.csv"
                            download="sample.csv"
                            className="text-xs underline"
                            style={{ fontSize: '0.7rem' }}
                        >
                            Sample CSV
                        </a>
                        &nbsp;|&nbsp;
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setCategoryModalOpen(true);
                            }}
                            className="text-xs underline"
                            style={{ fontSize: '0.7rem' }}
                        >
                            Category List
                        </button>
                    </div>

                    {/* Render the Modal */}
                    <ProductImportModal
                        open={isModalOpen}
                        onClose={() => setModalOpen(false)} // Close the modal
                    />

                    {/* Add this new modal */}
                    {isCategoryModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-[#242424] p-6 rounded-lg max-w-md w-full">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">
                                        Category List
                                    </h3>
                                    <button
                                        onClick={() =>
                                            setCategoryModalOpen(false)
                                        }
                                        className="text-gray-400 hover:text-white"
                                        style={{ padding: '5px 10px' }}
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="text-white">
                                    <ul
                                        style={{
                                            listStyle: 'disc',
                                            padding: '0rem 2rem 1rem',
                                        }}
                                    >
                                        {!catError && catIsLoading && (
                                            <span>Loading...</span>
                                        )}
                                        {catError && (
                                            <span>Sorry, error occurred.</span>
                                        )}
                                        {!catError &&
                                            !catIsLoading &&
                                            categories?.map((category) => (
                                                <li>{category.handle}</li>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-start">
                        <DropdownMultiselectFilter
                            title="Filter By Category"
                            optionsEnum={ProductCategory} // Pass the enum directly
                            selectedFilters={getFilterValues('categories')} // Extract `in` property as an array
                            onFilterChange={(values) => {
                                if (values) {
                                    setProductFilter('categories', {
                                        in: values,
                                    }); // Apply filter
                                } else {
                                    clearProductFilter('categories'); // Clear filter if no values
                                }
                                setPageIndex(0); // Reset to the first page
                            }}
                        />
                    </div>
                    <div className="ml-auto flex flex-row relative w-[376px]">
                        {/*TODO: Improve this search.... yarn add [algoliasearch || @meilisearch/instant-meilisearch] pkgs. */}
                        <Input
                            placeholder="Search Products..."
                            value={
                                (table
                                    .getColumn('title')
                                    ?.getFilterValue() as string) ?? ''
                            }
                            onChange={(event) =>
                                table
                                    .getColumn('title')
                                    ?.setFilterValue(event.target.value)
                            }
                            className="w-full h-[44px] pl-5 border-none placeholder-[#C2C2C2] active:border-primary-purple-90  text-white rounded bg-black pr-10"
                        />
                    </div>
                </div>
                <div className="flex text-sm text-muted-foreground m-2 justify-between">
                    <div className="flex items-center gap-4">
                        <p className="text-sm text-white">Showing</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="bg-[#242424] text-white w-[72px] h-[36px] rounded"
                                    size="sm"
                                >
                                    {pageSize} {/* Display current page size */}
                                    <ChevronDown className="w-4 h-4 text-white" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-[#242424]">
                                {[5, 10, 20, 50, 100].map((size) => (
                                    <DropdownMenuCheckboxItem
                                        key={size}
                                        checked={pageSize === size}
                                        onCheckedChange={() => {
                                            setPageSize(size); // Update page size
                                            setPageIndex(0); // Reset to the first page
                                        }}
                                        onSelect={(e) => e.preventDefault()} // Prevent menu close on select
                                    >
                                        {size}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                            <div className="text-sm text-white">
                                of {filteredProductsCount} filtered entries.{' '}
                                {''}
                                {totalRecords} total entries.
                            </div>
                        </DropdownMenu>
                    </div>
                    <div className="flex">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="ml-auto whitespace-nowrap bg-[#242424] hover:border-primary-purple-90 text-white"
                                >
                                    <Settings />
                                    Toggle Columns
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-[#242424] border-primary-purple-90">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => {
                                                column.toggleVisibility(
                                                    !!value
                                                );
                                                // handleCheckedChange(
                                                //     column.id as any,
                                                //     !!value as any
                                                // );
                                            }}
                                            onSelect={(e) => e.preventDefault()} // Prevent menu close on select
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-md mt-9 overflow-x-auto">
                    <Table className="min-w-full">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {/* Extra header for collapsible button */}
                                    <TableHead className="w-[40px]"></TableHead>
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
                            {/*{console.log('Table Rows:', table.getRowModel().rows)}*/}
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
                            ) : table.getRowModel().rows?.length > 0 ? (
                                table.getRowModel().rows.map((row) => (
                                    <React.Fragment key={row.id}>
                                        <TableRow>
                                            {/* Collapsible Button */}
                                            <TableCell className="w-[40px]">
                                                {row.original.variants &&
                                                row.original.variants.length >
                                                    1 ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            toggleRowExpansion(
                                                                row.id
                                                            )
                                                        }
                                                    >
                                                        {expandedRows[
                                                            row.id
                                                        ] ? (
                                                            <ChevronUp />
                                                        ) : (
                                                            <ChevronDown />
                                                        )}
                                                    </Button>
                                                ) : null}{' '}
                                                {/* Prevents button from rendering for non-variant products */}
                                            </TableCell>

                                            {/* Main Row Data */}
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                ))}
                                        </TableRow>

                                        {/* Expanded Content for Variants */}
                                        {expandedRows[row.id] &&
                                            row.original.variants?.length >
                                                1 && (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={
                                                            columns.length + 1
                                                        }
                                                    >
                                                        <div className="p-4 border rounded-md bg-primary-dark text-white">
                                                            {/* Scrollable Table Wrapper */}
                                                            <div className="max-h-[300px] overflow-y-auto">
                                                                <table className="w-full table-auto">
                                                                    <thead>
                                                                        <tr>
                                                                            <th className="text-left p-2">
                                                                                Variant
                                                                                ID
                                                                            </th>
                                                                            <th className="text-left p-2">
                                                                                Title
                                                                            </th>
                                                                            <th className="text-left p-2">
                                                                                Price
                                                                            </th>
                                                                            <th className="text-left p-2">
                                                                                Inventory
                                                                            </th>
                                                                            <th className="text-left p-2">
                                                                                Created
                                                                                At
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {row.original.variants?.map(
                                                                            (
                                                                                variant
                                                                            ) => (
                                                                                <tr
                                                                                    key={
                                                                                        variant.id
                                                                                    }
                                                                                >
                                                                                    <td className="p-2">
                                                                                        {
                                                                                            variant.id
                                                                                        }
                                                                                    </td>
                                                                                    <td className="p-2">
                                                                                        {variant.title ||
                                                                                            'N/A'}
                                                                                    </td>

                                                                                    <td className="p-2">
                                                                                        {variant.prices
                                                                                            ? variant.prices
                                                                                                  .filter(
                                                                                                      (
                                                                                                          price: Price
                                                                                                      ) =>
                                                                                                          price.currency_code ===
                                                                                                          preferredCurrency
                                                                                                  )
                                                                                                  .map(
                                                                                                      (
                                                                                                          price,
                                                                                                          idx
                                                                                                      ) => (
                                                                                                          <div
                                                                                                              key={
                                                                                                                  idx
                                                                                                              }
                                                                                                          >
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
                                                                                                              )}{' '}
                                                                                                              {[
                                                                                                                  'usdc',
                                                                                                                  'usdt',
                                                                                                              ].includes(
                                                                                                                  price.currency_code.toLowerCase()
                                                                                                              )
                                                                                                                  ? 'USD'
                                                                                                                  : price.currency_code.toUpperCase()}
                                                                                                          </div>
                                                                                                      )
                                                                                                  )
                                                                                            : [] // Replace this with an empty array or another logic
                                                                                                  .filter(
                                                                                                      (
                                                                                                          price: any
                                                                                                      ) =>
                                                                                                          price.currency_code ===
                                                                                                          'eth'
                                                                                                  )
                                                                                                  .map(
                                                                                                      (
                                                                                                          price: any,
                                                                                                          idx: number
                                                                                                      ) => (
                                                                                                          <div
                                                                                                              key={
                                                                                                                  idx
                                                                                                              }
                                                                                                          >
                                                                                                              {formatCryptoPrice(
                                                                                                                  price.amount,
                                                                                                                  price.currency_code
                                                                                                              )}{' '}
                                                                                                              {price.currency_code.toUpperCase()}
                                                                                                          </div>
                                                                                                      )
                                                                                                  )}
                                                                                    </td>

                                                                                    <td className="p-2">
                                                                                        {variant.inventory_quantity ||
                                                                                            'N/A'}
                                                                                    </td>
                                                                                    <td className="p-2">
                                                                                        {new Date(
                                                                                            variant.created_at
                                                                                        ).toLocaleString()}
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length + 1}
                                        className="text-center"
                                    >
                                        No products found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>{' '}
            {/* Pagination */}
            <div className="max-w-[1280px] w-full mx-4 rounded-xl p-[24px]">
                <div className="flex justify-center items-center gap-2">
                    {/* Previous Button */}
                    <Button
                        variant="outline"
                        className="bg-primary-black-90 mr-1"
                        size="sm"
                        onClick={() =>
                            setPageIndex((old) => Math.max(old - 1, 0))
                        }
                        disabled={pageIndex === 0}
                    >
                        Previous
                    </Button>

                    {/* First Page */}
                    <button
                        className={`w-8 h-8 flex items-center justify-center rounded text-xs ${
                            pageIndex === 0
                                ? 'bg-[#94D42A] text-black'
                                : 'bg-[#121212] text-white'
                        }`}
                        onClick={() => setPageIndex(0)}
                    >
                        1
                    </button>

                    {/* Left Ellipsis */}
                    {pageIndex > 2 && (
                        <span className="text-gray-500">...</span>
                    )}

                    {/* Middle Pages */}
                    {(() => {
                        const pages = [];
                        const start = Math.max(1, pageIndex - 1); // Start from one page before
                        const end = Math.min(pageCount - 2, pageIndex + 1); // End one before the last page

                        for (let i = start; i <= end; i++) {
                            pages.push(
                                <button
                                    key={i}
                                    className={`w-6 h-8 flex items-center justify-center rounded text-xs ${
                                        pageIndex === i
                                            ? 'bg-[#94D42A] text-black'
                                            : 'bg-[#121212] text-white'
                                    }`}
                                    onClick={() => setPageIndex(i)}
                                >
                                    {i + 1}
                                </button>
                            );
                        }
                        return pages;
                    })()}

                    {/* Right Ellipsis */}
                    {pageIndex < pageCount - 3 && (
                        <span className="text-gray-500">...</span>
                    )}

                    {/* Last Page */}
                    {pageCount > 1 && (
                        <button
                            className={`w-8 h-8 flex items-center justify-center rounded text-xs ${
                                pageIndex === pageCount - 1
                                    ? 'bg-[#94D42A] text-black'
                                    : 'bg-[#121212] text-white'
                            }`}
                            onClick={() => setPageIndex(pageCount - 1)}
                        >
                            {pageCount}
                        </button>
                    )}

                    {/* Next Button */}
                    <Button
                        variant="outline"
                        className="bg-primary-black-90 ml-1"
                        size="sm"
                        onClick={() =>
                            setPageIndex((old) =>
                                Math.min(old + 1, pageCount - 1)
                            )
                        }
                        disabled={pageIndex === pageCount - 1}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
