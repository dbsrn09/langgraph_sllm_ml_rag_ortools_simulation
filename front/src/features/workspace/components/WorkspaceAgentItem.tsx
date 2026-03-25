

interface WorkspaceAgentProps {
    onClickAgent: () => void;
    id: string;
    selectedAgentId: string;
    agentName: string;
}

const WorkspaceAgentItem = ({ onClickAgent, id, selectedAgentId, agentName }: WorkspaceAgentProps) => {


    return (

            <div key={id} onClick={() => onClickAgent() }
                className={` truncate rounded-md cursor-pointer
                ${selectedAgentId === id ? " bg-orange-50 text-orange-700 font-medium pointer-events-none" : " hover:bg-[var(--neutral-elevated)] hover:text-[var(--neutral-ink)] "}
               items-center px-3 py-1.5 rounded-md text-left transition-colors
          
                `}
                title={agentName}>

                {agentName}

            </div>
    
    );
};


export default WorkspaceAgentItem;


