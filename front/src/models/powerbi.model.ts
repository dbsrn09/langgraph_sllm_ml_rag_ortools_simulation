export interface PowerBIResponse extends PowerBIEmbedRequest {
    Id: string;
    branchId: string;
    workspace: string;
    agentName: string;
    desc: string;
    isReport: boolean;
    isChatAgent: boolean;
    seq?:number;
}

export interface PowerBIEmbedRequest {
    tenantID: string;
    clientID: string;
    workspaceID: string;
    clientSecret: string;
    reportID: string;
    pageID?: string;

}

export interface PowerBIEmbedResponse {
    success:boolean;
    isProcess:boolean;
    url: string;
    token: string;
    id: string;

}