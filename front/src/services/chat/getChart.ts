import { useQuery } from "@tanstack/react-query";
import type { IFetchApiResult } from "../../models/api.models";
import api from "../base.service";
import type { ChartSource } from "../../models/chat.model";
import { isLangGraphLocal } from "../../langgraph/localMode";

export const useGetChart = (id: string) => {

    return useQuery<IFetchApiResult<ChartSource>>({

        queryKey: ["chart_source", id],

        queryFn: async () => {
            if (isLangGraphLocal()) {
                return {
                    success: true,
                    message: "",
                    result: {
                        title: "",
                        subtitle: "",
                        charts: [],
                        summaryCards: [],
                    },
                };
            }
            const res = await api.get(`chat/chart/${id}`);

            return res.data;
        },

        enabled: !!id,
        retry: false
    });

}