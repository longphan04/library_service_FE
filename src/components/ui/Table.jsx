// ==========================================
// Component: Table
// Mô tả: Component table hiển thị dữ liệu
// ==========================================

const Table = ({
    columns = [],
    data = [],
    className = '',
}) => {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="w-full">
                <thead>
                    <tr className="border-b border-border">
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="px-4 py-3 text-left text-sm font-medium text-text-primary"
                            >
                                {column.header || column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="border-b border-border hover:bg-bg-card-hover transition-colors"
                        >
                            {columns.map((column, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="px-4 py-3 text-sm text-text-primary"
                                >
                                    {column.accessor
                                        ? row[column.accessor]
                                        : row[colIndex]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
