import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { IFetchApi } from "../../models/api.models";
import axios from "axios";
import api from "../base.service";
import type { SaveReportAgent } from "../../models/reportagent.model";
import { toast } from "sonner";

export const useSaveReport = () => {
    const queryClient = useQueryClient();
    const controllerRef = useRef<AbortController | null>(null);

    const mutation = useMutation<
        IFetchApi,
        Error,
        SaveReportAgent
    >({
        mutationFn: async (req) => {

            controllerRef.current?.abort();

            controllerRef.current = new AbortController();

            const res = await api.post<IFetchApi>(
                "/reportAgent/save",
                req, {
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

        onError: (err: any) => {

            if (
                axios.isCancel(err) ||
                (err as any)?.name === "CanceledError"
            ) {
                return;
            }
            
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Something went wrong";

            toast.error(message)
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