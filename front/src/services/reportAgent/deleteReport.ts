import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { IFetchApi } from "../../models/api.models";
import api from "../base.service";
import axios from "axios";
import type { ReportAgentDeleteRequest } from "../../models/reportagent.model";



export const useDeleteReport = () => {
  const controllerRef = useRef<AbortController | null>(null);
  const queryClient = useQueryClient();
  const mutation = useMutation<
    IFetchApi,
    Error,
    ReportAgentDeleteRequest
  >({
    mutationFn: async (req:ReportAgentDeleteRequest) => {

      controllerRef.current?.abort();
      controllerRef.current = new AbortController();

      const res = await api.delete<IFetchApi>(
        `/reportAgent/delete/${req.id}`,
        {
          signal: controllerRef.current.signal,
        }
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
        queryKey: ["reportAgents", variables.workspaceId],
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