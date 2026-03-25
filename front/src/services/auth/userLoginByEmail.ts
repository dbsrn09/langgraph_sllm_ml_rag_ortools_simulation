import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { IFetchApiResult } from "../../models/api.models";
import api from "../base.service";
import axios from "axios";
import type {  LoginRequestEmail, LoginResponse } from "../../models/auth.model";



export const useLoginByEmail = () => {
    
  const controllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<
    IFetchApiResult<LoginResponse>,
    Error,
    LoginRequestEmail
  >({
    mutationFn: async (req) => {
      controllerRef.current?.abort();
      controllerRef.current = new AbortController();

      const res = await api.post<IFetchApiResult<LoginResponse>>(
        "/auth/email",
        req, {
        signal: controllerRef.current.signal,
      }
      );

      return res.data;
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