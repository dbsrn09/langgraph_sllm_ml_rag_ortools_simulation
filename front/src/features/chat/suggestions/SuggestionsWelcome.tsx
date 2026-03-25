
import type { ChatSuggestion } from "../../../models/chat.model";




interface SuggestionsWelcomeProps {
    list: ChatSuggestion[]
    sendSuggestion: (value: string) => void;
}

const SuggestionsWelcome = ({ list, sendSuggestion }: SuggestionsWelcomeProps) => {
 


    const buttonClass = `text-left px-5 py-3.5
     bg-[var(--neutral-surface)] border border-[var(--neutral-border)]
      hover:border-gray-300 hover:bg-[var(--neutral-elevated)] 
      rounded-xl text-sm text-[var(--neutral-fg-subtle)] hover:text-[var(--neutral-ink)]
       transition-all shadow-sm h-full`

    return (
        <div className="grid grid-cols-2 gap-3 w-full max-w-[600px]">
            {list
                ?.slice(0, 4)
                .map((data: ChatSuggestion, index: number) => (
                    <button className={buttonClass} key={index} onClick={() =>

                        sendSuggestion(data.prompt)

                    }>
                        {data.keyword}
                    </button>
                ))}
        </div>


    );
}

export default SuggestionsWelcome;
