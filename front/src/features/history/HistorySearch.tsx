import { useGetChatHistoryByAgent } from "../../services/chat/chatHistoryByAgent";
import type { ChatHistoryByAgent } from "../../models/chat.model";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useChatStore } from "../../store/chat.store";
import { useAgentStore } from "../../store/agent.store";
import { useUIStore } from "../../store/ui.store";
import { useTranslation } from "react-i18next";
import HistorySearchInput from "./search/HistorySearchInput";
import HistoryItem from "./search/HistoryItem";


const HistorySearch = () => {

    const { t } = useTranslation();

    const { selectedAgent } = useAgentStore();
    const { setChatContent ,setTabAgent} = useUIStore();
    const { setSessionId } = useChatStore();

    const { data: ChatHistoryByAgent} = useGetChatHistoryByAgent(selectedAgent.id)
    const [search, setSearch] = useState("");

    const getGroupLabel = (dateStr: string) => {

        const d = new Date(dateStr);

        const now = new Date();

        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const yesterday = new Date(today);

        yesterday.setDate(today.getDate() - 1);

        const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());

        if (target.getTime() === today.getTime()) return t("today");

        if (target.getTime() === yesterday.getTime()) return t("yesterday");

        return t("previous");

    };

    const filtered = useMemo(() => {
        if (!ChatHistoryByAgent?.result) return [];

        const q = search.toLowerCase();

        return ChatHistoryByAgent.result.filter(item =>
            !q ||
            item.human?.toLowerCase().includes(q) ||
            item.ai?.toLowerCase().includes(q) ||
            item.label?.toLowerCase().includes(q)
        );
    }, [ChatHistoryByAgent, search]);

    const grouped = filtered?.reduce(
        (acc, item) => {
            const label = getGroupLabel(item.createAt);

            if (!acc[label]) acc[label] = [];
            acc[label].push(item);

            return acc;
        },
        {} as Record<string, ChatHistoryByAgent[]>
    );

    const orderedGroups = [t("today"), t("yesterday"), t("previous")]
        .filter(key => grouped?.[key])
        .map(key => [key, grouped![key]] as const);

    return (
        <motion.div
            key="chatHistSearch"
            initial={{ opacity: 0, }}
            animate={{ opacity: 1, }}
            exit={{ opacity: 0, }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex-1 flex flex-col h-full bg-[#F7F8FA] overflow-hidden min-w-0 px-8"
        >

            <HistorySearchInput
                value={search}
                onChange={setSearch} />

            <div className="mt-6 mb-6
            w-fit flex px-4 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-900 shadow-sm hover:bg-gray-50 transition-colors">
                {t("all")}
            </div>
            <div className="overflow-y-auto">

                {orderedGroups?.length == 0 && (<div className="text-center text-sm text-gray-400 py-12">{t("noResult")}</div>)}

                {orderedGroups?.map(([label, items]) => (

                    <div key={label} className="mb-6">

                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                            {label}
                        </h3>

                        <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 16 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50 "
                        >
                            <HistoryItem onClick={(sessionId) => {
                                 setTabAgent("chat")
                                setSessionId(sessionId)
                                setChatContent("chat", true)

                            }} label={label} items={items} />

                        </motion.div>
                    </div>
                ))}
            </div>  </motion.div>
    );
};

export default HistorySearch;
