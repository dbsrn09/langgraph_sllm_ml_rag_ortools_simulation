

import { SquarePen } from "lucide-react";
import { useChatStore } from "../../store/chat.store";
import { useAgentStore } from "../../store/agent.store";
import HeaderTitle from "./components/HeaderTitle";
import HeaderTab from "./components/HeaderTab";
import Language from "../../shared/components/ui/Language";
import Account from "../../shared/components/ui/Account";
import { useParams } from "react-router-dom";


interface ChatHeaderProps {
    tab: "chat" | "report"
    setTab: (val: "chat" | "report") => void;
}

const ChatHeader = ({ tab, setTab }: ChatHeaderProps) => {


    const { chatConversationList, loadinChatHist, setNewCHat } = useChatStore();

    const { selectedAgent } = useAgentStore();

    const { email } = useParams<{ email?: string }>();

    const decodedEmail = email ? decodeURIComponent(email) : null;

    return (

        <div className="h-[56px] flex items-center px-8 border-b border-[#e6e8ec]  bg-white sticky top-0 z-15 shrink-0 justify-between">

            <HeaderTitle
                totalChat={chatConversationList.length}
                label={chatConversationList[0]?.label || ""}
                firstMessage={chatConversationList[0]?.message}
                loadinChatHist={loadinChatHist}
            />

            <div className="flex items-center ml-auto">

                {selectedAgent.agentType == "powerbi" && (<SquarePen onClick={setNewCHat} className="text-[#6c737f] h-5 w-5" />)}

                {selectedAgent.agentType == "text2sql_rag" && chatConversationList.length > 0 && (<HeaderTab tab={tab} onChangeTab={setTab} loadinChatHist={loadinChatHist} />)}

                {selectedAgent.agentType != "powerbi" &&
                    <>
                        <Language />
                        {!decodedEmail && (<Account />)}
                    </>
                }

            </div>

        </div>

    );
}

export default ChatHeader;
