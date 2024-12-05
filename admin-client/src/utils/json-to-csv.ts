export const convertJSONToCSV = (data: any[], headers: string[]): string => {
    const csvRows = [];

    // Add headers
    csvRows.push(headers.join(','));

    // Add rows
    for (const item of data) {
        const row = headers.map((header) => JSON.stringify(item[header] ?? ''));
        csvRows.push(row.join(','));
    }

    return csvRows.join('\n');
};

export const downloadCSV = (csvData: string, filename: string) => {
    // Add subtitle above the CSV table with a blank row in between

    const blob = new Blob([csvData], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
