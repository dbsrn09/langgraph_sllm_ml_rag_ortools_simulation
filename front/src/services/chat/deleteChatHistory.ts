import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { IFetchApi } from "../../models/api.models";
import type { ChatHistoryRequestDelete } from "../../models/chat.model";
import api from "../base.service";
import axios from "axios";
import { isLangGraphLocal } from "../../langgraph/localMode";
import { deleteSession } from "../../langgraph/localChatStorage";



export const useChatDeleteHistory = () => {
  const controllerRef = useRef<AbortController | null>(null);
  const queryClient = useQueryClient();
  const mutation = useMutation<
    IFetchApi,
    Error,
    ChatHistoryRequestDelete
  >({
    mutationFn: async (req:ChatHistoryRequestDelete) => {

      if (isLangGraphLocal()) {
        deleteSession(req.dataAgentId, req.sessionId);
        return { success: true, message: "" };
      }

      controllerRef.current?.abort();
      controllerRef.current = new AbortController();

      const res = await api.delete<IFetchApi>(
        `/chat/history/delete/${req.dataAgentId}/${req.sessionId}`,
        {
          signal: controllerRef.current.signal,
        }
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
        queryKey: ["chatHistoryByAgent", variables.dataAgentId],
        });
    },

    onError: (err) => {

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