import { useTable } from '@tanstack/react-table';
import React from 'react';

function DynamicTable({ data, columnsConfig }) {
    const columns = columnsConfig.map(config => ({
        accessorKey: config.key,
        header: config.header,
        cell: config.cellRenderer || (({ getValue }) => getValue())
    }));

    const table = useTable({ data, columns });

    return (
        <table>
            <thead>
            {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                        <th key={header.id}>{header.isPlaceholder ? null : header.renderHeader()}</th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody>
            {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>{cell.renderCell()}</td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default DynamicTable;
