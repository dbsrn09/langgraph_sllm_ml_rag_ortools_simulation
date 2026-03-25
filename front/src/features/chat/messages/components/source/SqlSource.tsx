import { useEffect, useState } from "react";
import type { ChatConversation } from "../../../../../models/chat.model";
import { useChatStore } from "../../../../../store/chat.store";
import { useChatRequestSourceTable } from "../../../../../services/chat/chatSourceQuery";
import { useChatRequestSourceChart } from "../../../../../services/chat/chatSourceChart";
import ToggleSourceButton from "./ToggleSourceButton";
import SqlQuery from "./sql/SqlQuery";



interface MessageSourceProps {
    companyId: string;
    data: ChatConversation;
}

const SqlSource = ({ companyId, data }: MessageSourceProps) => {

    const [isOpen, setIsOpen] = useState(false);

    const { setTableSource, setChartSource, setLoadingTable, setLoadingChart } = useChatStore();

    const { mutate: chatRequestSourceTable} = useChatRequestSourceTable();

    const { mutate: chatRequestSourceChart } = useChatRequestSourceChart();

    const executeQuery = () => {
     
        if (data.query && data.histId && !data.queryResult) {

            const histId = data.histId

            setLoadingTable(true, histId)

            setLoadingChart(true, histId)

            chatRequestSourceTable(
                {
                    companyId: companyId,
                    query: data.query,
                    chatId: histId
                },
                {
                    onSuccess: (res) => {

                        setLoadingTable(false, histId)

                        if (res.success) {
                            const rows = res.result.data;

                            setTableSource(rows, histId)

                            const columns = rows.length > 0
                                ? Object.keys(rows[0])
                                : [];

                            if (rows.length > 0) {



                                chatRequestSourceChart(
                                    {
                                        companyId: companyId,
                                        query: JSON.stringify(rows.slice(0, 20)),
                                        chatId: histId,
                                        question: data.question,
                                        columns: JSON.stringify(columns),

                                    },
                                    {
                                        onSuccess: (resSourceChart) => {

                                            setLoadingChart(false, histId)

                                            if (resSourceChart.success) {
                                                // let convert = JSON.parse(resSourceChart.result.data) as ChartSource
                                                setChartSource("finished", histId)

                                                // selectChat(res.result.chatId)

                                            }

                                        }
                                    }
                                );

                            } else setLoadingChart(false, histId)

                        }
                    },

                }
            );
        }
    }

    useEffect(() => {

        executeQuery()
    }, [data.query, data.chatId])

 



    return (

            <div className="w-full border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">

                <ToggleSourceButton isOpen={isOpen} setIsOpen={setIsOpen} />

                {isOpen && (
                    <div className="content w-full px-5 py-6 bg-white animate-in slide-in-from-top-1 duration-200">
                        <div className="w-full flex flex-col gap-8 animate-in slide-in-from-top-2 fade-in duration-300">
                            <div className="flex flex-col gap-3">

                                {(data.query && data.chatId) && (
                                    <SqlQuery query={data.query} chatId={data.chatId} />
                                )}

                                {/* <TableResult statusChatTable={isFetching} data={dataTable || data.queryResult || []} /> */}
                            </div>
                        </div>
                    </div>
                )}
            </div>
      
    );
};

export default SqlSource;
