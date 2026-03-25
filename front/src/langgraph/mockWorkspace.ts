import type { CompanyList } from "../models/company.model";
import type { WorkspaceListModel } from "../models/workspace.model";
import type { ChatSuggestion } from "../models/chat.model";
import { LANGGRAPH_AGENT_ID } from "./localMode";

export { LANGGRAPH_AGENT_ID };

export const LANGGRAPH_SUGGESTIONS: ChatSuggestion[] = [
  { keyword: "구매 요청 부서", prompt: "요청부서별 구매요청 건수 상위 5개를 보여줘." },
  { keyword: "중단 위험 Top10", prompt: "지난 30일 기준 중단 위험이 높은 구매요청 상위 10건을 보여줘." },
  { keyword: "담당자별 위험", prompt: "중단 확률 0.6 이상 건을 담당자별로 묶어서 보여줘." },
  { keyword: "근거 문서", prompt: "납기 지연 원인 분석 기준을 근거 문서와 함께 요약해줘." }
];

export const MOCK_COMPANY_LIST: CompanyList[] = [
  {
    companyId: "local-corp",
    companyName: "LangGraph Local",
    branch: [
      {
        branchId: "local-branch",
        branchName: "본사",
        dataAgentBotName: "Ops Assistant",
        dataAgentWelcomeprompt: "운영 데이터에 대해 자연어로 질문해 보세요."
      }
    ]
  }
];

export const mockWorkspacesForBranch = (_branchId: string): WorkspaceListModel[] => [
  {
    workspaceId: "ws-local-1",
    workspaceName: "운영 의사결정",
    workspaceType: "analytics",
    branchId: "local-branch",
    dataAgents: [
      {
        workspaceId: "ws-local-1",
        branchId: "local-branch",
        dataAgentId: LANGGRAPH_AGENT_ID,
        agentName: "Text-to-SQL · RAG",
        seq: 1,
        dataAgentSuggestion: LANGGRAPH_SUGGESTIONS
      }
    ],
    powerBi: []
  }
];
