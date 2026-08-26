"use client";

export default function Table({ columns, data }) {
    return (
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
                <tr>
                    {columns.map((col) => (
                        <th key={col.accessor} className="text-left p-4">{col.header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                        {columns.map((col) => (
                            <td key={col.accessor} className="p-4">{row[col.accessor]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
