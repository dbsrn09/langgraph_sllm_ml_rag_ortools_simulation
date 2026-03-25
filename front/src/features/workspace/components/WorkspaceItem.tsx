

interface WorkspaceItemProps {
    onClickWorkspace: () => void;
    id: string;
    selectedWorkspaceId: string;
    workspaceName: string;
}

const WorkspaceItem = ({ onClickWorkspace, id, selectedWorkspaceId, workspaceName }: WorkspaceItemProps) => {

    const workspaceClass = `
    w-full 
    flex 
    items-center 
    px-4
    py-3
     rounded-md 
     text-left
      transition-colors 
    truncate
       text-[var(--neutral-fg-subtle)]
        hover:bg-[var(--neutral-elevated)] hover:text-[var(--neutral-ink)]`


    return (
        <div className={
            `${workspaceClass}
            ${id == selectedWorkspaceId ? "pointer-events-none" : "    cursor-pointer "}
             cursor-pointer  truncate
            `}

            onClick={onClickWorkspace}>

            {workspaceName}

        </div>
    );
};


export default WorkspaceItem;
