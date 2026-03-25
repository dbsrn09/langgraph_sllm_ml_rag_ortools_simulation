import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { IFetchApi } from "../../models/api.models";
import type { ChatHistoryRequestDelete } from "../../models/chat.model";
import api from "../base.service";
import axios from "axios";



export const useEditChatDeleteHistory = () => {
    const controllerRef = useRef<AbortController | null>(null);
    const queryClient = useQueryClient();
    const mutation = useMutation<
        IFetchApi,
        Error,
        ChatHistoryRequestDelete
    >({
        mutationFn: async (req: ChatHistoryRequestDelete) => {

            controllerRef.current?.abort();
            controllerRef.current = new AbortController();

            const res = await api.delete<IFetchApi>(
                `/chat/history/deleteEdited/${req.dataAgentId}/${req.sessionId}/${req.histId}`,
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