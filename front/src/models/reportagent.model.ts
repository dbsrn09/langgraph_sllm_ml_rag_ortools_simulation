import type { ChartSource } from "./chat.model";

export interface ReportAgentRequest {
    workspaceId: string;
}
export interface ReportAgentList {
    id: string;
    chart: string;
    source: string;
    createAt: string;
}
export interface SaveReportAgent {
    workspaceId: string;
    dataAgentId: string;
    sourceId: string;
    sql: string;
}

export interface ReportAgentDeleteRequest {
    id: string;
    workspaceId: string;
}


export interface RerunReportAgent {
    companyId: string;
    id: string;
}
export interface RerunReportAgentResponse {
    data: string;

}


export interface ReportAgentVersion {
    id: string;
    ver: number;
    create: string;
}

export interface ReportAgentShare {
    chart: ChartSource;
    data: any[];

}

