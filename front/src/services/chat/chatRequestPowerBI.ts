import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { IFetchApiResult } from "../../models/api.models";
import type { ChatMessage, ChatRequest } from "../../models/chat.model";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export const useChatRequestPowerBI = () => {
  const controllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<IFetchApiResult<ChatMessage>, Error, ChatRequest>({
    mutationFn: async (req) => {
      // Abort previous request if any
      controllerRef.current?.abort();
      controllerRef.current = new AbortController();

      const res = await fetch(`${BASE_API_URL}/powerbi/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
        signal: controllerRef.current.signal,
      });

      return res.json();
    },

    onError: (err) => {
      if ((err as any)?.name === "AbortError") return;
      console.error(err);
    },
  });


  const abort = () => {
    controllerRef.current?.abort();
  };

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  return {
    ...mutation,
    abort,
  };
};
