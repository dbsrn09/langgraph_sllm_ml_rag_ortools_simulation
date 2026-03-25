import { TableSkeleton } from "../../../../../../shared/components/ui/TableSkeleton";

interface TableResultProps {
    statusChatTable: string;
    data: any[];
}

const TableResult = ({ data, statusChatTable }: TableResultProps) => {

    if (statusChatTable == "error") return "Failed to get data table";

    if (data.length == 0)
        return (
            <>
                {statusChatTable == "pending" && (
                    <TableSkeleton rows={3} cols={3} />
                )}

                {statusChatTable == "error" && (
                    "Failed to get data table"
                )}
            </>
        )

    return (
        <div className="max-h-[400px] bg-white rounded-xl border border-gray-200 shadow-sm relative overflow-auto m-2">
            <div className="w-full h-full overflow-x-auto overflow-y-auto custom-scrollbar rounded-xl">
                <table className="w-max min-w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100 sticky top-0">
                        <tr>
                            <th className="px-4 py-3">No</th>
                            {Object.keys(data[0])?.map((key) => (
                                <th key={key} className="px-4 py-3">
                                    {key}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50">
                        {data?.map((row: Record<string, any>, rowIndex: number) => (
                            <tr key={rowIndex} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-3 font-medium text-gray-900">
                                    {rowIndex + 1}
                                </td>

                                {Object.values(row).map((value, colIndex) => (
                                    <td key={colIndex} className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                                        {String(value)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default TableResult;
