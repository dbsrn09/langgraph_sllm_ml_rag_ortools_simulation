export type NodeName =
  | "intent_router"
  | "execution_planner"
  | "sql"
  | "rag"
  | "ml"
  | "simulation"
  | "or_tools"
  | "response";

export interface Trace {
  node: NodeName | string;
  status: "ok" | "error";
  elapsed_ms?: number;
  output?: Record<string, unknown>;
  error?: string;
}
