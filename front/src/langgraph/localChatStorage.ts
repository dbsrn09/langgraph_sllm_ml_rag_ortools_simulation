import type { ChatHistoryByAgent, ChatHistoryByAgentDetail } from "../models/chat.model";
import type { IFetchApiResult } from "../models/api.models";

const KEY_LIST = "langgraph_local_hist_list_v1";
const KEY_DETAIL = "langgraph_local_hist_detail_v1";

function readList(): ChatHistoryByAgent[] {
  try {
    const raw = localStorage.getItem(KEY_LIST);
    if (!raw) return [];
    return JSON.parse(raw) as ChatHistoryByAgent[];
  } catch {
    return [];
  }
}

function writeList(items: ChatHistoryByAgent[]) {
  localStorage.setItem(KEY_LIST, JSON.stringify(items));
}

function readDetailMap(): Record<string, ChatHistoryByAgentDetail[]> {
  try {
    const raw = localStorage.getItem(KEY_DETAIL);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, ChatHistoryByAgentDetail[]>;
  } catch {
    return {};
  }
}

function writeDetailMap(m: Record<string, ChatHistoryByAgentDetail[]>) {
  localStorage.setItem(KEY_DETAIL, JSON.stringify(m));
}

export function localHistoryList(agentId: string): IFetchApiResult<ChatHistoryByAgent[]> {
  const rows = readList().filter((r) => r.dataAgentId === agentId);
  return { success: true, message: "", result: rows };
}

export function upsertSessionRow(meta: ChatHistoryByAgent) {
  const all = readList();
  const idx = all.findIndex(
    (r) => r.sessionId === meta.sessionId && r.dataAgentId === meta.dataAgentId
  );
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...meta };
  } else {
    all.unshift(meta);
  }
  writeList(all);
}

export function deleteSession(agentId: string, sessionId: string) {
  const all = readList().filter(
    (r) => !(r.dataAgentId === agentId && r.sessionId === sessionId)
  );
  writeList(all);
  const dm = readDetailMap();
  delete dm[sessionId];
  writeDetailMap(dm);
}

export function updateLabelById(id: string, msg: string) {
  const all = readList().map((r) => (r.id === id ? { ...r, label: msg } : r));
  writeList(all);
}

export function appendDetailTurn(sessionId: string, row: ChatHistoryByAgentDetail) {
  const dm = readDetailMap();
  const cur = dm[sessionId] ?? [];
  cur.push(row);
  dm[sessionId] = cur;
  writeDetailMap(dm);
}

export function getDetailForSession(sessionId: string): ChatHistoryByAgentDetail[] {
  return readDetailMap()[sessionId] ?? [];
}
