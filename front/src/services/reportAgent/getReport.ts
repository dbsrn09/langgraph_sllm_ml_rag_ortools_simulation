import { useQuery } from "@tanstack/react-query";
import type { IFetchApiResult } from "../../models/api.models";
import api from "../base.service";
import type { ReportAgentList } from "../../models/reportagent.model";


export const useGetReport = (workspaceId: string) => {

    return useQuery<IFetchApiResult<ReportAgentList[]>>({

        queryKey: ["reportAgents", workspaceId],

        queryFn: async () => {
            const res = await api.get(`reportAgent/${workspaceId}`);

            return res.data;
        },

        enabled: !!workspaceId,
        retry: false
    });

}