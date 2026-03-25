
import { MessageSquare } from "lucide-react";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { ChatHistoryByAgent } from "../../../models/chat.model";


interface HistoryItemProps {
    onClick: (session: string) => void;
    label: string;
    items: ChatHistoryByAgent[]
}

const HistoryItem = ({
    onClick, label, items
}: HistoryItemProps) => {

    const { t } = useTranslation();

    const formatTimestamp = (dateStr: string, groupLabel: string) => {
        const date = new Date(dateStr);

        if (groupLabel === t("previous")) {
            return date.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
            });
        }

        return date.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
        });
    };


    return (


        <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50 "
        >

            {items.map(item => (
                <div key={item.id} className="group relative p-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-start gap-4"
                    onClick={() => onClick(item.sessionId)}>
                    <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:shadow-sm transition-all"><MessageSquare className="" size={12} /></div>
                    <div className="flex-1 min-w-0">
                        <div className="flex">
                            <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-orange-600 transition-colors">{item.human}</h4>
                            <span className="text-xs text-gray-400 font-medium whitespace-nowrap ml-auto">{formatTimestamp(item.createAt, label)}</span>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed truncate">{item.label || item.ai}</p>
                    </div>

                </div>
            ))}
        </motion.div>

    );
};

export default HistoryItem;
