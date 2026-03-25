import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { IFetchApiResult } from "../../models/api.models";
import type { ChatRequest, ChatResponse } from "../../models/chat.model";
import api from "../base.service";
import axios from "axios";



export const useChatRequest = () => {
  const controllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<
    IFetchApiResult<ChatResponse>,
    Error,
    ChatRequest
  >({
    mutationFn: async (req) => {
      controllerRef.current?.abort();
      controllerRef.current = new AbortController();

      const res = await api.post<IFetchApiResult<ChatResponse>>(
        "/chat/request",
        req, {
        signal: controllerRef.current.signal,
      }
      );

      return res.data;
    },

    onError: (err) => {
          // Ignore abort errors
          if (
            axios.isCancel(err) ||
            (err as any)?.name === "CanceledError"
          ) {
            return;
          }

          console.error("Chat request failed:", err);
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

  return { ...mutation, abort };
};