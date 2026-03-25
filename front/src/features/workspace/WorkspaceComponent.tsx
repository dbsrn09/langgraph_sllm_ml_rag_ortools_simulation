import type { DataAgentResponse } from "../../models/dataagent.model";
import type { ChatSuggestion } from "../../models/chat.model";
import type { PowerBIResponse } from "../../models/powerbi.model";
import type { WorkspaceListModel } from "../../models/workspace.model";
import { getWorkspaceByBranch } from "../../services/workspace/getWorkspaceByBranch";
import { AnimatePresence, motion } from "framer-motion";
import EmptyWorkspace from "./components/EmptyWorkspace";
import WorkspaceAgentItem from "./components/WorkspaceAgentItem";
import WorkspaceItem from "./components/WorkspaceItem";
import { TableSkeleton } from "../../shared/components/ui/TableSkeleton";
import { useAgentStore } from "../../store/agent.store";
import { useUIStore } from "../../store/ui.store";
import { useChatStore } from "../../store/chat.store";


const WorkspaceComponent = () => {

    const { setChatContent ,setTabAgent } = useUIStore();

    const { setAgent ,selectedAgent ,setWorkspace ,selectedBranch ,selectedWorkspace} = useAgentStore();

    const { data: workspaceList, isLoading } = getWorkspaceByBranch(selectedBranch.branchId);
    const { setNewCHat} = useChatStore();
    const getWorkspaceId = selectedWorkspace.workspaceId

    const getAgentId = selectedAgent.id

    const onClickWorkspace = (workspaceId: string) => {

        setAgent({ id: "", agentType: "" });

        setWorkspace({workspaceId:workspaceId})
  

    }

    const onClickText2sqlAgent = (agentId: string, dataAgentSuggestion: ChatSuggestion[]) => {

        setAgent({ 
            id: agentId, 
            agentType: "text2sql_rag" ,
            dataAgentSuggestion:dataAgentSuggestion});

 
        setChatContent("chat",false)
        setTabAgent("chat")
        setNewCHat()
    }

    const onClickPowerBIAgent = (pbi: PowerBIResponse) => {

        setAgent({ id: pbi.Id, agentType: "powerbi", powerBi: pbi });

        setNewCHat()
    }

    if (isLoading)
        return <TableSkeleton rows={3} cols={1} />

    if (!selectedBranch|| !workspaceList?.result || workspaceList?.result?.length === 0)
        return <EmptyWorkspace />;

    return (

        <div className="space-y-2 text-[#6c737f] truncate flex-1  overflow-y-auto">

            {workspaceList?.result?.map((workspace: WorkspaceListModel) => (

                <div key={workspace.workspaceId}
                    className={` mx-1 truncate`}>

                    <WorkspaceItem key={workspace.workspaceId}
                        onClickWorkspace={() => onClickWorkspace(workspace.workspaceId)}
                        id={workspace.workspaceId}
                        selectedWorkspaceId={getWorkspaceId}
                        workspaceName={workspace.workspaceName}
                    />

                    <AnimatePresence>

                        {getWorkspaceId === workspace.workspaceId && (
                            <motion.div
                                key={workspace.workspaceId}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                className="ml-5 mt-1 space-y-0.5 border-l border-gray-200 pl-1 pt-1 truncate">
                                {
                                    workspace.dataAgents
                                    .sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0))
                                    .map((da: DataAgentResponse) => (

                                        <WorkspaceAgentItem key={da.dataAgentId}

                                            onClickAgent={() => onClickText2sqlAgent(da.dataAgentId,da.dataAgentSuggestion || [])}
                                            id={da.dataAgentId}
                                            selectedAgentId={getAgentId}
                                            agentName={da.agentName + " (AI) "} />

                                    ))}

                                {workspace.dataAgents.length > 0 && workspace.powerBi.length > 0 && (
                                    <hr className="my-2 mx-5 border-gray-300 w-35" />
                                )}


                                {workspace.powerBi
                                   .sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0))
                                    .map((pbi: PowerBIResponse) => (

                                    <WorkspaceAgentItem key={pbi.Id}
                                        onClickAgent={
                                            () => onClickPowerBIAgent(pbi)
                                        }
                                        id={pbi.Id}
                                        selectedAgentId={getAgentId}
                                        agentName={pbi.agentName + " (BI) "} />

                                ))}
                            </motion.div>
                        )}

                    </AnimatePresence>

                </div>

            ))}

        </div>
    );
};


export default WorkspaceComponent;
