import type { ChatSuggestion } from "./chat.model";

export interface DataAgentResponse{

    workspaceId: string;
    branchId: string;
    dataAgentId: string;
    agentName: string;
    dataAgentSuggestion?: ChatSuggestion[];
    seq?:number;


}
