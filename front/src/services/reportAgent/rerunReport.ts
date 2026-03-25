import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { IFetchApiResult } from "../../models/api.models";
import axios from "axios";
import api from "../base.service";
import type { RerunReportAgent } from "../../models/reportagent.model";
import { toast } from "sonner";

export const useRerunReport = () => {
    const queryClient = useQueryClient();
    const controllerRef = useRef<AbortController | null>(null);

    const mutation = useMutation<
        IFetchApiResult<any[]>,
        Error,
        RerunReportAgent
    >({
        mutationFn: async (req) => {

            controllerRef.current?.abort();

            controllerRef.current = new AbortController();

            const res = await api.post<IFetchApiResult<any[]>>(
                "/reportAgent/rerun",
                req, {
                signal: controllerRef.current.signal,
            }
            );

            return res.data;

        },


        onSuccess: (_, variables) => {

            queryClient.invalidateQueries({
                queryKey: ["reportAgents_ver_list", variables.id],
            });
            queryClient.invalidateQueries({
                queryKey: ["chart_source", variables.id],
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