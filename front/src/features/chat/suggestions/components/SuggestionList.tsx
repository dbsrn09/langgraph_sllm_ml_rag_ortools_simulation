
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ChatSuggestion } from "../../../../models/chat.model";

interface SuggestionListProps {
    list: ChatSuggestion[];
    sendSuggestion: (value: string) => void;
    setShowAll: (val: boolean) => void;
}

const SuggestionList = ({ list, sendSuggestion, setShowAll }: SuggestionListProps) => {

    const { t } = useTranslation();

    const buttonClass = `px-5 py-1.5 bg-[var(--neutral-elevated)] border border-[var(--neutral-border)]
     text-[var(--neutral-ink)] hover:bg-[var(--neutral-elevated-2)]
      hover:border-gray-300 rounded-full text-[12.5px] font-medium transition-all shadow-sm active:scale-95 shrink-0`;

    return (
        <>

            <div className="flex items-center gap-2 transition-opacity duration-200 opacity-100">
                <Sparkles className="w-3.5 h-3.5 text-[var(--neutral-fg-subtle)]" />
                <span className="text-xs font-medium text-[var(--neutral-fg-subtle)]">{t("suggestion.questions")}</span>
            </div>

            {list?.slice(0, 2).map((data: ChatSuggestion, index: number) => (
                <button className={buttonClass} key={index} onClick={() => {
                    setShowAll(false);
                    sendSuggestion(data.prompt)
                }
                }>
                    {data.keyword}
                </button>
            ))}

        </>
    );
};

export default SuggestionList;
