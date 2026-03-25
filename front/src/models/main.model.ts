import type { ChatSuggestion } from "./chat.model";
import type { PowerBIResponse } from "./powerbi.model";

export interface MainReducerState {
    expandSideBar:boolean;
    showMenu: boolean;
    showCompanyList: boolean;
    showBranchList: boolean;
    selectedCompany: SelectedCompany;
    selectedWorkspace: string;
    selectedBranch: SelectedBranch;
    selectedAgent: SelectedAgent;
};

export interface SelectedAgent {
    id: string;
    agentType: "powerbi" | "text2sql_rag" | "";
    powerBi?: PowerBIResponse
    dataAgentSuggestion?:ChatSuggestion[]
}

export interface SelectedCompany {
    companyId: string;
    companyName: string;

}
export interface SelectedWorkspace{
    workspaceId:string;
}
export interface SelectedBranch {
    branchId: string;
    branchName: string;
    botName?:string;
    welcomePrompt?:string;
    logo?:string;
    bgImg?:string;
}