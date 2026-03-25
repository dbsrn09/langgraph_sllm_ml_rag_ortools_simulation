import { useEffect } from "react";
import type { CompanyList } from "../../../models/company.model";
import SidebarToggleButton from "./components/SidebarToggleButton";
import { useGetCompany } from "../../../services/company/getCompany";
import { useAppStore } from "../../../store/app.store";
import { useUIStore } from "../../../store/ui.store";
import { useAgentStore } from "../../../store/agent.store";
import CompanyComponent from "../../../features/company/CompanyComponent";
import WorkspaceComponent from "../../../features/workspace/WorkspaceComponent";
import BranchComponent from "../../../features/branch/BranchComponent";
import { isLangGraphLocal } from "../../../langgraph/localMode";
import SidebarLocalChatNav from "./SidebarLocalChatNav";


const SidebarLayout = () => {

    const { data: CompanyList, isLoading: isFetchingCompany, refetch } = useGetCompany();

    const {  selectedCredential } = useAppStore();

    const { setExpandSidebar, expandSidebar } = useUIStore();

    const { selectedCompany } = useAgentStore();

    useEffect(() => {

        if (selectedCredential.accessToken && selectedCredential.isAuthenticated) {
            refetch();
        }
    }, [selectedCredential.accessToken, selectedCredential.isAuthenticated]);

    return (
        <div
            className={`text-sm ${expandSidebar
                ? "w-[260px] overflow-y-auto"
                : "w-10 overflow-hidden"}
                flex flex-col bg-white border-r border-gray-200 h-full shrink-0 flex-none text-sm font-['Pretendard'] transition-all duration-300 `}
        >
            <div className="flex flex-col h-full">


                <div className={`${expandSidebar ? " flex w-full px-5 flex-shrink-0" : ""} 
                 h-[60px] border-b border-gray-200 transition-all duration-300`}>


                    <div className={`${expandSidebar ? "opacity-100" : "opacity-0 pointer-events-none h-0"} flex items-center space-x-2 overflow-hidden flex font-bold  items-center text-[18px] truncate font-semibold leading-[24px]`}>

                        <CompanyComponent
                            data={CompanyList?.result ?? []}
                            isFetchingCompany={isFetchingCompany}
                        />
                    </div>


                    <SidebarToggleButton
                        expandSideBar={expandSidebar}
                        setExpandSideBar={(val) => setExpandSidebar(val)}
                    />

                </div>


                <div className="flex-1 overflow-hidden py-3 flex flex-col min-h-0">
         
                    {expandSidebar && (
                        isLangGraphLocal() ? <SidebarLocalChatNav /> : <WorkspaceComponent />
                    )}

                </div>

                <div className={`${expandSidebar ? "opacity-100" : "opacity-0 pointer-events-none"}  flex-shrink-0 bg-gray-800 px-4 py-3`}>

                    <BranchComponent
                        data={
                            CompanyList?.result
                                ?.filter(
                                    (cl: CompanyList) =>
                                        cl.companyId === selectedCompany.companyId
                                )
                                .flatMap((cl: CompanyList) => cl.branch) ?? []
                        }
                    />

                </div>

            </div>

        </div>
    );
};

export default SidebarLayout;
