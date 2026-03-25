import { useState } from "react";
import type { ChatSuggestion } from "../../../models/chat.model";
import SuggestionList from "./components/SuggestionList";
import SuggestionDialog from "./components/SuggestionDialog";
import ShowAllSuggestionButton from "./components/ShowAllSuggestionButton";


interface SuggestionsChatProps {
    list: ChatSuggestion[];
    sendSuggestion: (value: string) => void;
}

const SuggestionsChat = ({ list, sendSuggestion }: SuggestionsChatProps) => {

    const [showAll, setShowAll] = useState(false);

    return (
        <div className="w-full max-w-full mx-auto px-0 mb-3 relative z-30 flex gap-3">

            <SuggestionList list={list} sendSuggestion={sendSuggestion} setShowAll={setShowAll} />

            <ShowAllSuggestionButton total={list.length} setShowAll={setShowAll} showAll={showAll} />

            <SuggestionDialog list={list} sendSuggestion={sendSuggestion} setShowAll={setShowAll} showAll={showAll} />

        </div>
    );
};

export default SuggestionsChat;
