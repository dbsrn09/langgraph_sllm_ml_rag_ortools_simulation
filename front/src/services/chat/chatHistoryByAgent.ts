import { useQuery } from "@tanstack/react-query";
import type { IFetchApiResult } from "../../models/api.models";
import api from "../base.service";
import type { ChatHistoryByAgent } from "../../models/chat.model";
import { isLangGraphLocal } from "../../langgraph/localMode";
import { localHistoryList } from "../../langgraph/localChatStorage";



export const useGetChatHistoryByAgent = (id:string) =>
    useQuery<IFetchApiResult<ChatHistoryByAgent[]>>({
        queryKey: ["chatHistoryByAgent",id],
        queryFn: async () => {
            if (isLangGraphLocal()) {
                return localHistoryList(id);
            }
            const res = await  api.get(`/chat/history/${id}`);
            
            return res.data;
        },
        enabled:!!id
    });

    