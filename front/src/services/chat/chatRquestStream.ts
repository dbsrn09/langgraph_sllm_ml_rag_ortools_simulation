import type { ChatRequest } from "../../models/chat.model";

export const streamChat = (
  req: ChatRequest,
  agent: "powerbi" |"text2sql_rag" |"",
  onEvent: (evt: { type: string; data: string }) => void
) => {
  const controller = new AbortController();
  const decoder = new TextDecoder();

  let url = "chat/request_stream";

  if(agent =="powerbi")
    url = "powerbi/chat_stream" ;
 
  (async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_API_URL}/${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
          Authorization: `Bearer ${localStorage.getItem(import.meta.env.VITE_TOKEN_KEY)}`,
        },
        body: JSON.stringify(req),
        signal: controller.signal,
      });

         if (!res.ok) {
        const text = await res.text().catch(() => "");
          onEvent({
            type: "error",
            data: `HTTP ${res.status} ${text || res.statusText}`,
          });
        return;
      }

      if (!res.body) {
        onEvent({
          type: "error",
          data: "Empty response body",
        });
        return;
      }

      const reader = res.body.getReader();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        let boundary;
        while ((boundary = buffer.search(/\r?\n\r?\n/)) !== -1) {
          const rawEvent = buffer.slice(0, boundary);

          const sepMatch = buffer.match(/\r?\n\r?\n/)!;
          buffer = buffer.slice(boundary + sepMatch[0].length);

          const lines = rawEvent.split(/\r?\n/);

          let type = "message";
          const dataLines: string[] = [];

          for (const line of lines) {
            if (line.startsWith("event:")) {
              type = line.slice(6).trim();
            }

            if (line.startsWith("data:")) {
              dataLines.push(line.slice(5)); 
            }
          }

          const data = dataLines.join("\n");

          if (data === "done") {
           onEvent({ type: "done", data });
            controller.abort();
            return;
          }

          onEvent({ type, data });
        }
      }
    } catch (err: any) {
    if (err.name !== "AbortError") {
        onEvent({
          type: "error",
          data: err?.message || "Streaming crashed",
        });
      }
    }
  })();

  return () => controller.abort();
};
