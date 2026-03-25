import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { IFetchApiResult } from "../../models/api.models";
import type {   ChatSourceRequest, ChatSourceResponse } from "../../models/chat.model";
import api from "../base.service";
import axios from "axios";


export const useChatRequestSourceChart = () => {
  const controllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<
    IFetchApiResult<ChatSourceResponse>,
    Error,
    ChatSourceRequest
  >({
    mutationFn: async (req) => {
      controllerRef.current?.abort();
      controllerRef.current = new AbortController();

      const res = await api.post<IFetchApiResult<ChatSourceResponse>>(
        "/chat/source/chart",
        req, {
        signal: controllerRef.current.signal,
      }
      );

      return res.data;
      // const res = await fetch(`${BASE_API_URL}/chat/source/chart`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(req),
      //   signal: controllerRef.current.signal,
      // });

      // return res.json();
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