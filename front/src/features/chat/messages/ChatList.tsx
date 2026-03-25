import React from "react";
import type { ChatConversation } from "../../../models/chat.model";
import MessageSource from "./components/MessageSource";
import MessageUser from "./components/MessageUser";
import MessageAI from "./components/MessageAI";
import MessageAgentReport from "./components/MessageAgentReport";
import { Loader2 } from "lucide-react";

interface ChatListProps {

    loadingChat: boolean;
    agentType: string;
    companyId: string;
    list: ChatConversation[];
    isEditMessage: ChatConversation;
    onUpdateMessage: (message: ChatConversation, newMessage: string) => void;
    onEditMessage: (message: ChatConversation) => void;
    onCancelEditMessage: () => void;

}

const ChatList = ({ loadingChat, agentType, companyId, list, isEditMessage, onEditMessage, onCancelEditMessage, onUpdateMessage }: ChatListProps) => {

    return (

        <div className={`max-w-[950px] mx-auto  pb-32 space-y-8 ${agentType == "powerbi" ? "p-3 " : "p-8 "} animate-in slide-in-from-top-2 fade-in duration-300`}>

            {list.map((data: ChatConversation, index: number) => (

                <React.Fragment key={index}>

                    {data.role === "user"

                        ?

                        <MessageUser key={index}
                            loadingChat={loadingChat}
                            isEditMessage={isEditMessage}
                            onUpdateMessage={onUpdateMessage}
                            onEditMessage={onEditMessage}
                            onCancelEditMessage={onCancelEditMessage}
                            data={data} />


                        :

                        <MessageAI key={index} data={data} />

                    }

                
                        <>     
                            {data.loadingChart && (
                                <Loader2 size={15} className="animate-spin text-gray-400  ml-8" />
                            )}

                            {!data.loadingChart &&  data.query && data.chart && data.hasAnswer && (
                                <MessageAgentReport data={data} />
                            )}

                            <MessageSource data={data} companyId={companyId} />
                        </>

              


                </React.Fragment>
            ))}

        </div>
    );
};

export default ChatList;

