/** 로컬 FastAPI LangGraph 전용 UI (백엔드 API·로그인 없이 ai365 UI 사용) */
export const isLangGraphLocal = (): boolean =>
  import.meta.env.VITE_LANGGRAPH_LOCAL === "true" ||
  import.meta.env.VITE_LANGGRAPH_LOCAL === "1";

export const LANGGRAPH_AGENT_ID = "langgraph-local-agent";
