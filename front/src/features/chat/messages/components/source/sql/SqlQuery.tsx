import { useTranslation } from "react-i18next";
import { Code } from "lucide-react";
import CopyContain from "../../../../../../shared/hooks/CopyContain";
import { format } from "sql-formatter";

interface SqlQueryProps {
    query: string;
    chatId: string;
}

const SqlQuery = ({ query, chatId }: SqlQueryProps) => {

    const { t } = useTranslation();

    return (
        <>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Code className="w-3.5 h-3.5" /> {t("chatSource.generatedSQL")}
            </h3>

            <div className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-sm relative group border border-gray-800">

                <div className="absolute top-2 right-2 z-10">
                    <CopyContain
                        value={query}
                        chatId={chatId}
                        tooltip={t("chatConversation.copySQL")}
                        message={t("chatConversation.copiedSQL")}
                        iconClass="w-3.5 h-3.5"
                        type="sql"
                    />
                </div>

                <div className="overflow-x-auto custom-scrollbar max-h-[350px]">

                    <pre className="text-[13px] font-mono text-blue-300 leading-relaxed whitespace-pre px-5 my-5">
                        {format(query, { language: "transactsql" })}
                    </pre>
                </div>

            </div>
        </>
    );
};

export default SqlQuery;
