import {  useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Sparkles, X } from "lucide-react";
import type { ChatSuggestion } from "../../../../models/chat.model";



interface SuggestionDialogProps {
    list: ChatSuggestion[];
    sendSuggestion:(value:string) => void;
    setShowAll: (value: boolean) => void;
    showAll:boolean;
}

const SuggestionDialog = ({ list, showAll,setShowAll,sendSuggestion }: SuggestionDialogProps) => {

    const { t } = useTranslation();

    const panelRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setShowAll(false);
            }
        };
        if (showAll) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showAll]);


    return (

        
            showAll && (
                <div
                    ref={panelRef}
                    className="absolute bottom-0 left-0 right-0 bg-white rounded-2xl border border-gray-200 shadow-xl p-4 animate-in fade-in zoom-in-95 duration-200 origin-bottom-left"
                >
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                        <div className="flex items-center gap-2 text-gray-500">
                            <Sparkles className="w-3.5 h-3.5 text-[var(--neutral-fg-subtle)]" />
                            <span className="text-xs font-semibold">{t("suggestion.all")}</span>
                        </div>
                        <button
                            onClick={() => setShowAll(false)}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {list.map((data: ChatSuggestion, index: number) => (
                            <button onClick={() => {
                                setShowAll(false);
                                sendSuggestion(data.prompt)
                            }
                            }
                                className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 text-gray-600 rounded-full text-[13px] transition-all duration-200"
                                key={index}
                            >
                                {data.keyword}
                            </button>
                        ))}
                    </div>
                </div>
            )
       
    );
};

export default SuggestionDialog;
