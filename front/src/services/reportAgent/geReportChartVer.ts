import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IFetchApiResult } from "../../models/api.models";
import api from "../base.service";

export const useGetReportChartVer = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IFetchApiResult<any[]>,
    Error,
    { id: string; chatId: string }
  >({
    mutationFn: async ({ id }) => {
      const res = await api.get(`reportAgent/chart/${id}`);
      return res.data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chart_source", variables.chatId],
      });
    },
  });
};

