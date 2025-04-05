interface TableRow<T> {
    id: string;
    original: T;
}

interface RowModel<T> {
    rows: TableRow<T>[];
}

interface Table<T> {
    getRowModel: () => RowModel<T>;
}

interface DownloadToCSVProps<T extends Record<string, unknown>> {
    table: Table<T>;
    selectedRows: string[];
}

export const downloadToCSV = <T extends Record<string, unknown>>({ table, selectedRows }: DownloadToCSVProps<T>) => {
    // Gather the selected rows' original data from the table model.
    const selectedData = table.getRowModel().rows
        .filter((row: TableRow<T>) => selectedRows.includes(row.id))
        .map((row: TableRow<T>) => row.original);

    if (selectedData.length === 0) return;

    // Use keys from the first selected row as CSV header.
    const keys = Object.keys(selectedData[0]);
    const csvRows: string[] = [];
    csvRows.push(keys.join(",")); // header row

    // Build CSV rows.
    selectedData.forEach((item: T) => {
        const values = keys.map((key) => {
            let val = item[key];
            if (val === null || val === undefined) val = "";
            // Escape double quotes inside content and wrap in quotes.
            return `"${String(val).replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "selected_rows.csv");
    a.style.visibility = "hidden";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};