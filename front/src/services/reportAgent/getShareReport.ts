import { useQuery } from "@tanstack/react-query";
import type { IFetchApiResult } from "../../models/api.models";
import api from "../base.service";
import type {  ReportAgentShare } from "../../models/reportagent.model";


export const getShareReport = (id: string) => {

    return useQuery<IFetchApiResult<ReportAgentShare>>({

        queryKey: ["reportAgentsShare", id],

        queryFn: async () => {
            const res = await api.get(`share/report/${id}`);

            return res.data;
        },

        enabled: !!id,
        retry: false
    });

}