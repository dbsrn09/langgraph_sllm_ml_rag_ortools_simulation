import { useState } from "react";
import { useAgentStore } from "../../../../store/agent.store";
import { useGetReport } from "../../../../services/reportAgent/getReport";
import { TableSkeleton } from "../../../../shared/components/ui/TableSkeleton";

import WorskspaceSearch from "./workspace/WorskspaceSearch";
import WorkspaceToggleButton from "./workspace/WorkspaceToggleButton";
import WorkspaceGridList from "./workspace/WorkspaceGridList";


interface ReportWorkspaceProps {
    open: "chart" | "workspace" | "";
    setOpen: (val: "chart" | "workspace" | "") => void;
}

const ReportWorkspace = ({ open, setOpen }: ReportWorkspaceProps) => {

    const [tab, setTab] = useState<"grid" | "list">("grid");
    const [search, setSearch] = useState("");
    const { selectedWorkspace } = useAgentStore();

    const {
        data,
        isLoading
    } = useGetReport(selectedWorkspace?.workspaceId);



    return (

        <section className="bg-white border border-[#E6E6E6] rounded-xl overflow-hidden shadow-[0px_1px_2px_rgba(0,0,0,0.04)] w-full">

            <WorkspaceToggleButton total={data?.result.length || 0} setOpen={() => setOpen(open == "workspace" ? "" : "workspace")} open={open} />

            <div
                className={`border-t border-[#EFEFEF]  bg-[#FAFAFA] animate-in slide-in-from-top-2 duration-200 ${open == "workspace" ? "p-8 max-h-auto  opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <WorskspaceSearch setTab={(v) => setTab(v)} tab={tab} search={search} setSearch={setSearch} />
         
            

                    {isLoading && (<TableSkeleton rows={3} cols={1} />)}

                    <WorkspaceGridList data={data?.result || []} mode={tab} search={search} />

               

            </div>

        </section>

    );
};

export default ReportWorkspace;
