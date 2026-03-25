import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { IFetchApi } from "../../models/api.models";
import type { ChatHistUpddateLabelRequest } from "../../models/chat.model";
import api from "../base.service";
import axios from "axios";
import { isLangGraphLocal } from "../../langgraph/localMode";
import { updateLabelById } from "../../langgraph/localChatStorage";



export const useChatHistoryUpdateLabel = () => {
  const controllerRef = useRef<AbortController | null>(null);
  const mutation = useMutation<
    IFetchApi,
    Error,
    ChatHistUpddateLabelRequest
  >({
    mutationFn: async (req:ChatHistUpddateLabelRequest) => {

      if (isLangGraphLocal()) {
        updateLabelById(req.id, req.msg);
        return { success: true, message: "" };
      }

      controllerRef.current?.abort();
      controllerRef.current = new AbortController();

      const res = await api.put<IFetchApi>(
        `/chat/history/label`,req,
        {
          signal: controllerRef.current.signal,
        }
      );
      return res.data;
    },
    onSuccess: () => {
     
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