import type { PowerBIEmbedResponse } from "./powerbi.model";



export interface ChatReducerState {
    powerBISource: PowerBISource;
    powerBIEmbed: PowerBIEmbedResponse;
    chatMessage: string;
    chatMessageList: ChatMessage[];
    chatLoading: boolean;
    sessionId: string;
    selectedSourceTab: string;
    expandedSourceChat: string;
    expandedChatHistory: boolean;
    ChatHistoryByAgentList: ChatHistoryByAgent[];
    selectedCHatHistSessionId: string;
    detectChat: Date | null
    suggestion: string



    chatConversationList: ChatConversation[]
    editMessage: ChatConversation;
    streamingStatus: string;
}

export interface PowerBISource {
    powerBILoaded: boolean;
    powerBISource: string;


}

export interface ChatConversation {
    chatId?: string;
    role: "user" | "ai";
    message: string;
    label?: string;
    loadingTable?: boolean;
    loadingChart?: boolean;
    streamingStatus?: string;
    query?: string;
    isEdit?: boolean;
    ragSource?: boolean;
    sqlSource?: boolean;
    queryResult?: any[];
    chart?: string;
    hasAnswer?: boolean;
    ragReference?: RagReference[];
    histId?: string;
    question?: string;
}

export interface ChatMessage {
    chatId?: string;
    role: string;
    message: string;
    query?: string;
    ragSource?: boolean;
    sqlSource?: boolean;
    queryResult?: any[];
    chart?: string;
    hasAnswer?: boolean;
    dashboard?: any
    suggestions?: string[]
    ragReference?: RagReference[]
}

export interface ChatRequest {
    id: string;
    branchId?: string;
    agentType: string;
    companyId: string;
    sessionId: string;
    message: string;
    source?: string;
    hist?: any[];
    lang?: string;

}
export interface ChatSourceRequest {
    chatId: string;
    companyId: string;
    query: string;
    columns?: string;
    question?: string;

}

export interface ChatResponse {
    chatId: string;
    role: string;
    message: string;
    query: string;
    ragSource: boolean;
    sqlSource: boolean;
    hasAnswer: boolean;
    suggestions: string[]
    ragReference?: RagReference[]
}

export interface ChatSourceResponse {
    chatId: string;
    data: any;
}
export interface ChatSourceHistory {
    query: string
    queryResult: string;
    chart: string;
    dashboard: string;
    docSource: string;

}

export interface ChatHistoryByAgent {
    id: string;
    ai: string;
    human: string;
    sessionId: string;
    dataAgentId: string;
    label: string;
    createAt: string;
    loadingHistory?: boolean;

}
export interface ChatHistoryByAgentDetail {
    id: string;
    ai: string;
    human: string;
    label: string;
    hasAnswer: boolean;
    agentType: string;
    source: ChatSourceHistory[]
}


export interface ChatHistoryRequestDelete {
    dataAgentId: string;
    sessionId: string;
    histId?: string;
}

export interface RagReference {
    file_reference: string;
    file_detail_reference: RagReferenceDetail[];

}

export interface RagReferenceDetail {
    file_reference_page: number;
    snippet_text: string[];
}

export interface ChatHistUpddateLabelRequest {
    id: string;
    msg: string;
}

export interface ChatSuggestion {
    keyword: string;
    prompt: string
}

export interface ChatPowerBISource {
    powerBILoaded: boolean;
    powerBISource: string;
}

export interface ChartSource {

    title: string;
    subtitle: string;
    charts: ChartData[];
    summaryCards: SummaryCards[];
}

export  type ChartType = "line" | "bar" | "pie" | "cards" | "table" | "gantt";

export  interface SummaryCards{
    type: "total" | "average" | "max" | "min";
    label:string;
    field:string;
      dimension?: string;
}
export interface ChartData {
    chartType: ChartType;
    groupField: string[];
    xField: string;
    yFields: string[];
    isTimeSeries: boolean;
    valueType: "percentage" | "number";
}