import type { SelectedAgent, SelectedBranch, SelectedCompany } from "./main.model";

export interface SidebarReducerState {
    expandSideBar:boolean;
    showMenu: boolean;
    showCompanyList: boolean;
    showBranchList: boolean;
    selectedCompany: SelectedCompany;
    selectedWorkspace: string;
    selectedBranch: SelectedBranch;
    selectedAgent: SelectedAgent;
};