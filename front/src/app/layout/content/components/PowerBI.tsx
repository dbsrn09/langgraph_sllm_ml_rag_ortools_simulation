
import { useState } from "react";
import PowerBI from "../../../../features/powerbi/PowerBI";
import { useAgentStore } from "../../../../store/agent.store";
import ChatHeader from "../../../../features/header/ChatHeader";
import Chat from "../../../../features/chat/Chat";


const PowerBILayout = () => {

    const { selectedAgent } = useAgentStore();

    const [tab, setTab] = useState<"chat" | "report">("report");
    return (

        selectedAgent.agentType == "powerbi" && (

            <div className="flex-1 flex flex-col h-full overflow-hidden ">

                <PowerBI tab={tab} setTab={setTab}>
                    
                    <div className={`
                        flex flex-col overflow-hidden
                        transition-all ease-in-outz
                        ${tab === "chat"
                            ? "w-[420px] opacity-100 border-l border-[#e6e8ec]"
                            : "w-0 opacity-0 pointer-events-none"}
                    `}>

                        <ChatHeader tab={"chat"} setTab={() => { }} />

                        <Chat tab={"chat"} />

                    </div>

                </PowerBI>

            </div>

        )
    )
}

export default PowerBILayout;
