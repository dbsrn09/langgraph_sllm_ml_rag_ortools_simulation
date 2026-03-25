import { AnimatePresence } from "framer-motion";
import HistorySearch from "../../../../features/history/HistorySearch";
import ChatHeader from "../../../../features/header/ChatHeader";
import Chat from "../../../../features/chat/Chat";
import ChatReport from "../../../../features/chat/report/ChatReport";
import { useUIStore } from "../../../../store/ui.store";
import { useAgentStore } from "../../../../store/agent.store";
import NavigationLayout from "../../navigation/NavigationLayout";
import { isLangGraphLocal } from "../../../../langgraph/localMode";




const Text2sqlLayout = () => {

    const { selectedTabAgent, setTabAgent, chatContent } = useUIStore()

    const { selectedAgent } = useAgentStore();
    const hideMiddleNav = isLangGraphLocal();
    return (

        selectedAgent.agentType == "text2sql_rag" && (

            <>

                {!hideMiddleNav && <NavigationLayout />}

                <div className="flex flex-1 min-w-0  relative">

                    <div className="flex flex-col w-full h-full">

                        <AnimatePresence mode="wait">

                            {chatContent == "history" && (<HistorySearch />)}

                            {chatContent == "chat" && (

                                <div className="flex-1 flex flex-col relative min-w-0 bg-white overflow-y-auto custom-scrollbar">

                                    <ChatHeader tab={selectedTabAgent} setTab={setTabAgent} />

                                    <Chat tab={selectedTabAgent} />

                                    <ChatReport tab={selectedTabAgent} />

                                </div>

                            )}

                        </AnimatePresence>
                    </div>

                </div>

            </>

        )
    )
}

export default Text2sqlLayout;
