import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import axios from "axios";

import type {
  PowerBIEmbedRequest,
  PowerBIEmbedResponse,
} from "../../models/powerbi.model";
import type { IFetchApiResult } from "../../models/api.models";

import api from "../base.service";

export const usePowerBiEmbed = () => {
  const controllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<
    IFetchApiResult<PowerBIEmbedResponse>,
    Error,
    PowerBIEmbedRequest
  >({
    mutationFn: async (req: PowerBIEmbedRequest) => {
      // cancel previous request
      controllerRef.current?.abort();
      controllerRef.current = new AbortController();

      const res = await api.post<IFetchApiResult<PowerBIEmbedResponse>>(
        `/powerbi/getEmbed`,
        req,
        {
          signal: controllerRef.current.signal,
        }
      );

      return res.data;
    },

    onError: (err) => {
      // Ignore cancel errors
      if (
        axios.isCancel(err) ||
        (err as any)?.name === "CanceledError"
      ) {
        return;
      }

      console.error("PowerBI embed request failed:", err);
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
