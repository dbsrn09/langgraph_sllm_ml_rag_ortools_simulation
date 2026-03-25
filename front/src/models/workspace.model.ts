import type { DataAgentResponse } from "./dataagent.model"
import type { PowerBIResponse } from "./powerbi.model"

export interface WorkspaceListModel {
    workspaceId: string
    workspaceName: string
    workspaceType:string
    branchId: string
    dataAgents: DataAgentResponse[]
    powerBi: PowerBIResponse[]
}