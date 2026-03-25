import type { Trace } from "./types";

function traceByNode(traces: Trace[] | undefined, node: string): Trace | undefined {
  return traces?.find((t) => t.node === node);
}

export function pickSqlRows(trace?: Trace): Record<string, unknown>[] {
  if (!trace || trace.status !== "ok" || !trace.output) return [];
  const rows = trace.output.rows;
  if (Array.isArray(rows)) return rows as Record<string, unknown>[];
  const preview = trace.output.rows_preview;
  if (Array.isArray(preview)) return preview as Record<string, unknown>[];
  return [];
}

export function extractSqlQuery(traces: Trace[] | undefined): string {
  const t = traceByNode(traces, "sql");
  if (!t?.output) return "";
  const sql = t.output.sql;
  if (typeof sql === "string") return sql;
  const raw = t.output.raw_sql;
  return typeof raw === "string" ? raw : "";
}

export function buildSourcePayload(args: {
  chatId: string;
  finalAnswer: string;
  sql: string;
  queryResult: Record<string, unknown>[];
  hasRag: boolean;
}): string {
  return JSON.stringify({
    hasAnswer: true,
    sql: args.sql,
    sql_source: true,
    rag_source: args.hasRag,
    histId: args.chatId,
    rag_reference: []
  });
}
