import { useMutation } from "@tanstack/react-query";
import type { IFetchApiResult } from "../../models/api.models";
import api from "../base.service";
import type { ChatHistoryByAgentDetail } from "../../models/chat.model";
import { isLangGraphLocal } from "../../langgraph/localMode";
import { getDetailForSession } from "../../langgraph/localChatStorage";

export const useGetChatHistoryByAgentDetail = () =>
    useMutation<
        IFetchApiResult<ChatHistoryByAgentDetail[]>,
        Error,
        { id: string; sessionId: string }
    >({
        mutationFn: async ({ id, sessionId }) => {

            if (isLangGraphLocal()) {
                const rows = getDetailForSession(sessionId);
                return { success: true, message: "", result: rows };
            }

            const res = await api.get(`/chat/history/detail/${id}/${sessionId}`);
            

            return res.data;
        },
    });