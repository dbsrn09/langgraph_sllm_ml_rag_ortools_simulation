import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { IFetchApiResult } from "../../models/api.models";
import api from "../base.service";
import axios from "axios";
import type { LoginResponse } from "../../models/auth.model";



export const userToken = () => {

    const controllerRef = useRef<AbortController | null>(null);

    const mutation = useMutation<
        IFetchApiResult<LoginResponse>,
        Error
    >({
        mutationFn: async () => {
            controllerRef.current?.abort();
            controllerRef.current = new AbortController();

            const res = await api.get<IFetchApiResult<LoginResponse>>(
                "/auth/token",
                {
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