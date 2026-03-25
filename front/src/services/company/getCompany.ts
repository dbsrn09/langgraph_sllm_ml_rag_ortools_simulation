import { useQuery } from "@tanstack/react-query";
import type { CompanyList } from "../../models/company.model";

import type { IFetchApiResult } from "../../models/api.models";
import api from "../base.service";
import { isLangGraphLocal } from "../../langgraph/localMode";
import { MOCK_COMPANY_LIST } from "../../langgraph/mockWorkspace";



export const useGetCompany = () =>{
    const token = localStorage.getItem(import.meta.env.VITE_TOKEN_KEY);
    const local = isLangGraphLocal();
    return  useQuery<IFetchApiResult<CompanyList[]>>({
        queryKey: ["companyList"],
        queryFn: async () => {
            if (local) {
                return { success: true, message: "", result: MOCK_COMPANY_LIST };
            }
            const res = await api.get(`company/get`);

            return res.data;
        },
        enabled: local || !!token
    });

}