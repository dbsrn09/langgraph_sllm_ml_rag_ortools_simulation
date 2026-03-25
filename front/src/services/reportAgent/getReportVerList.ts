
import { useQuery } from "@tanstack/react-query";
import type { IFetchApiResult } from "../../models/api.models";
import api from "../base.service";
import type { ReportAgentVersion } from "../../models/reportagent.model";



export const useGetReportVerList = (id: string) => {

    return useQuery<IFetchApiResult<ReportAgentVersion[]>>({

        queryKey: ["reportAgents_ver_list", id],

        queryFn: async () => {
            const res = await api.get(`reportAgent/version/${id}`);

            return res.data;
        },

        enabled: !!id,
        retry: false
    });

}