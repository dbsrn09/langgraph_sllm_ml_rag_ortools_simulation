import type { Trace } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

export interface LangGraphChatResponse {
  query?: string;
  intents?: string[];
  planned_steps?: string[];
  traces?: Trace[];
  final_answer?: string;
  errors?: string[];
  total_ms?: number;
  result?: LangGraphChatResponse;
}

export async function postLangGraphChat(query: string): Promise<LangGraphChatResponse> {
  const url = `${API_BASE.replace(/\/$/, "")}/langgraph/chat`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  const raw = (await res.json()) as LangGraphChatResponse & { result?: LangGraphChatResponse };
  return raw.result ?? raw;
}
