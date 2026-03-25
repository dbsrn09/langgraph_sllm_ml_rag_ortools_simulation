import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import ChatList from "./messages/ChatList";
import MessageWelcome from "./messages/components/MessageWelcome";
import { ChatSkeletonList } from "../../shared/components/ui/ChatSkeleton";
import SuggestionsWelcome from "./suggestions/SuggestionsWelcome";
import type { ChatConversation, ChatHistoryByAgent, ChatHistoryRequestDelete, ChatRequest } from "../../models/chat.model";
import { useEditChatDeleteHistory } from "../../services/chat/deleteEditChatHistory";
import SuggestionsChat from "./suggestions/SuggestionsChat";
import ChatInput from "./input/ChatInput";
import { useGetChatHistoryByAgentDetail } from "../../services/chat/chatHistoryByAgentDetail";
import { useAgentStore } from "../../store/agent.store";
import { useUIStore } from "../../store/ui.store";
import { useChatStore } from "../../store/chat.store";
import { streamChat } from "../../services/chat/chatRquestStream";
import { useQueryClient } from "@tanstack/react-query";
import type { IFetchApiResult } from "../../models/api.models";
import { isLangGraphLocal } from "../../langgraph/localMode";
import { postLangGraphChat } from "../../langgraph/requestLangGraph";
import { extractSqlQuery, pickSqlRows } from "../../langgraph/extractFromTraces";
import { appendDetailTurn, upsertSessionRow } from "../../langgraph/localChatStorage";

interface ChatComponentProps {
    tab: string;

}

const Chat = ({ tab }: ChatComponentProps) => {
    const queryClient = useQueryClient();
    const { i18n } = useTranslation();

    const lang = i18n.language;

    const { t } = useTranslation();

    const stopStreamRef = useRef<(() => void) | null>(null);

    const { mutate: fetchDetail } = useGetChatHistoryByAgentDetail();

    const { selectedBranch, selectedCompany, selectedAgent } = useAgentStore();

    const { loadHistory } = useUIStore();

    const chatRef = useRef<HTMLDivElement | null>(null);

    const { mutate: chatEditHistRequestDelete } = useEditChatDeleteHistory();

    const {
        loadinChatHist,
        setEditMessage,
        editMessage,
        setUpdateMessage,

        chatConversationList,
        setChatConversationList,
        setAppendMessage,
        setAiResponse,
        patchAiMessage,
        sessionId,
        loadingChat,
        
        setLoadingChat,
        setLoadinChatHist,
        powerBiSource,
        selectChatId
    } = useChatStore();

    const deletedEditedHistory = (histId: string) => {
        return new Promise<void>((resolve, reject) => {
            const par: ChatHistoryRequestDelete = {
                dataAgentId: selectedAgent.id,
                sessionId: sessionId,
                histId: histId
            };

            chatEditHistRequestDelete(par, {
                onSuccess: () => resolve(),
                onError: (err) => reject(err)
            });
        });
    };

    const updateMessage = async (item: ChatConversation, newMessage: string) => {
        if (loadingChat) return;
        item.isEdit = true;
        item.message = newMessage;

        setUpdateMessage(item)

        setEditMessage({
            chatId: "",
            role: "user",
            message: ""
        })

        const deletePromise = item.histId
            ? deletedEditedHistory(item.histId)
            : Promise.resolve();

        const sendPromise = sendChat(newMessage, true);

        await Promise.all([deletePromise, sendPromise]);

    }

    const sendChat = (message: string, isEdit: boolean = false) => {

        if (loadingChat || loadinChatHist) return;

        setLoadingChat(true)

        const param: ChatRequest = {
            source: "",
            message: message,
            sessionId: sessionId,
            branchId: selectedBranch.branchId,
            companyId: selectedCompany.companyId,
            agentType: selectedAgent.agentType,
            id: selectedAgent.id,
            lang: lang
        };


        const chatId = uuidv4();

        // let lastUserMessage;

        // let lastAiMessage;


        queryClient.setQueryData<
            IFetchApiResult<ChatHistoryByAgent[]>
        >(
            ["chatHistoryByAgent", selectedAgent.id],
            (oldData: any) => {
                const newSession: ChatHistoryByAgent = {
                    id: chatId,
                    ai: "",
                    human: message,
                    sessionId: sessionId,
                    dataAgentId: selectedAgent.id,
                    label: message.slice(0, 40),
                    loadingHistory: true,
                    createAt: new Date().toISOString(),
                };

                if (!oldData) {
                    return {
                        success: true,
                        result: [newSession],
                    };
                }

                const sessionExists = oldData.result?.some(
                    (item: ChatHistoryByAgent) => item.sessionId === sessionId
                );

                if (!sessionExists) {
                    return {
                        ...oldData,
                        result: [newSession, ...oldData.result],
                    };
                }

                return {
                    ...oldData,
                    result: oldData.result.map((item: ChatHistoryByAgent) =>
                        item.sessionId === sessionId
                            ? { ...item, loadingHistory: true }
                            : item
                    ),
                };
            }
        );


        if (selectedAgent.agentType == "powerbi") {
            // lastUserMessage = [...chatConversationList]
            //     .reverse()
            //     .find(msg => msg.role === "user");

            // lastAiMessage = [...chatConversationList]
            //     .reverse()
            //     .find(msg => msg.role === "ai");

            // param.hist = [];

            // if (lastUserMessage) {
            //     param.hist.push({
            //         role: "user",
            //         content: lastUserMessage.message
            //     });
            // }

            // if (lastAiMessage) {
            //     param.hist.push({
            //         role: "assistant",
            //         content: lastAiMessage.message
            //     });
            // }

            if (powerBiSource.powerBILoaded && powerBiSource.powerBISource)
                param.source = powerBiSource.powerBISource
            else {

                toast.error("Failed", {
                    description: "Please try again until Power BI loaded",
                });
                setLoadingChat(false)
                return;

            }
        }

        if (!isEdit)
            setAppendMessage({
                role: "user",
                message,
                chatId
            });


        setAppendMessage({
            role: "ai",
            message: "",
            chatId,
            streamingStatus: t("thinking")
        });

        if (isLangGraphLocal()) {
            void (async () => {
                try {
                    const res = await postLangGraphChat(message);
                    const traces = res.traces ?? [];
                    const sqlT = traces.find((x) => x.node === "sql");
                    const rows = pickSqlRows(sqlT);
                    const sql = extractSqlQuery(traces);
                    const finalAnswer = res.final_answer ?? "";
                    const ragSource = traces.some((x) => x.node === "rag" && x.status === "ok");

                    patchAiMessage(chatId, {
                        message: finalAnswer,
                        query: sql,
                        queryResult: rows,
                        histId: chatId,
                        question: message,
                        hasAnswer: true,
                        sqlSource: !!sql,
                        ragSource,
                        chart: rows.length ? "history" : undefined,
                    });

                    upsertSessionRow({
                        id: sessionId,
                        sessionId,
                        human: message,
                        ai: finalAnswer.slice(0, 200),
                        label: message.slice(0, 40),
                        dataAgentId: selectedAgent.id,
                        createAt: new Date().toISOString(),
                        loadingHistory: false,
                    });

                    appendDetailTurn(sessionId, {
                        id: chatId,
                        human: message,
                        ai: finalAnswer,
                        label: message.slice(0, 40),
                        hasAnswer: true,
                        agentType: "text2sql_rag",
                        source: [],
                    });

                    queryClient.invalidateQueries({
                        queryKey: ["chatHistoryByAgent", selectedAgent.id],
                    });
                } catch (err) {
                    patchAiMessage(chatId, {
                        message: err instanceof Error ? err.message : String(err),
                        streamingStatus: "",
                    });
                    queryClient.invalidateQueries({
                        queryKey: ["chatHistoryByAgent", selectedAgent.id],
                    });
                }
            })();
            return;
        }

        const stop = streamChat(
            param,
            selectedAgent.agentType,
            (evt) => {

                setAiResponse({
                    chatId,
                    eventType: evt.type,
                    data: evt.data,
                    question: message,
                });
                if (evt.type === "done" || evt.type === "Cancelled" || evt.type === "error") {
                    queryClient.invalidateQueries({
                        queryKey: ["chatHistoryByAgent", selectedAgent.id]
                    });
                }
            });

        stopStreamRef.current = stop;

    }

    const handleCancelStream = () => {
        if (stopStreamRef.current) {
            stopStreamRef.current();
            stopStreamRef.current = null;

            setLoadingChat(false);

            queryClient.setQueryData<
                IFetchApiResult<ChatHistoryByAgent[]>
            >(
                ["chatHistoryByAgent", selectedAgent.id],
                (oldData: any) => {
                    if (!oldData?.result) return oldData;

                    return {
                        ...oldData,
                        result: oldData.result.map((item: ChatHistoryByAgent) =>
                            item.sessionId === sessionId
                                ? { ...item, loadingHistory: false }
                                : item
                        ),
                    };
                }
            );

            setAiResponse({
                chatId: "",
                eventType: "Cancelled",
                data: "cancelled",
                question: "",
            });
        }

    };

    useEffect(() => {

        return () => {
            handleCancelStream()
            // stopStreamRef.current?.();
        };

    }, [sessionId]);

    const loadChatHistory = () => {

        setLoadinChatHist(true);

        fetchDetail(
            {
                id: selectedAgent.id,
                sessionId,
            },
            {
                onSuccess: (data) => {

                    setLoadinChatHist(false);

                    if (!data.success) return;

                    const ChatList = data.result.flatMap((data) => {
                        const messages: any[] = [];

                        if (data.human) {
                            messages.push({
                                chatId: data.id,
                                role: "user",
                                message: data.human,
                                label: data.label,
                                histId: data.id,
                            });
                        }

                        if (data.ai) {
                            let query = "";
                            const chart = "history";
                            let queryResult: any[] = [];
                            let docSource: any[] = [];
                            let dashboard: any = {};

                            if (data.source?.length > 0) {

                                const src = data.source[0];

                                query = src.query ?? "";

                                //chart = JSON.parse(src.chart) ?? null;

                                dashboard = src.dashboard
                                    ? JSON.parse(src.dashboard)
                                    : {};

                                try {
                                    queryResult = src.queryResult
                                        ? JSON.parse(src.queryResult)
                                        : [];
                                    docSource = src.docSource
                                        ? JSON.parse(src.docSource)
                                        : [];
                                } catch { }
                            }

                            messages.push({
                                chatId: data.id,
                                role: "ai",
                                message: data.ai,
                                query,
                                chart,
                                queryResult,
                                hasAnswer: data.hasAnswer,
                                ragSource: data.agentType?.includes("rag"),
                                sqlSource: data.agentType?.includes("sql"),
                                dashboard,
                                ragReference: docSource,
                                histId: data.id
                            });
                        }

                        return messages;
                    });

                    if (ChatList.length > 0)
                        selectChatId(ChatList[ChatList.length - 1].chatId)


                    setChatConversationList(ChatList);

                },
                onError: () => {

                    setLoadinChatHist(false);
                },
            }
        );



    }

    useEffect(() => {

        if (loadHistory) {
            loadChatHistory()
        }


    }, [loadHistory, sessionId]);


    useEffect(() => {

        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }

    }, [chatConversationList]);

    return (

        <>
            <div ref={chatRef} className={`${tab != "chat" ? "hidden" : " flex-1  flex-col overflow-y-auto custom-scrollbar bg-white scroll-smooth"}`} >


                {loadinChatHist ? <ChatSkeletonList rows={6} /> :
                    chatConversationList.length == 0 ?

                        <>
                            <MessageWelcome>

                                <SuggestionsWelcome list={selectedAgent.dataAgentSuggestion || []} sendSuggestion={sendChat} />

                            </MessageWelcome>
                        </>

                        :

                        <ChatList
                            loadingChat={loadingChat}
                            agentType={selectedAgent.agentType}
                            list={chatConversationList}
                            companyId={selectedCompany.companyId}
                            isEditMessage={editMessage}
                            onUpdateMessage={updateMessage}
                            onEditMessage={(message: ChatConversation) => setEditMessage(message)}
                            onCancelEditMessage={() => setEditMessage({
                                chatId: "",
                                role: "user",
                                message: ""
                            })} />

                }

            </div>

            <div className={`${tab != "chat" ? "hidden" : ""}  max-w-[950px]  m-auto bg-white pt-2 pb-6 z-10 w-full  bottom-0  ${selectedAgent.agentType == "powerbi" ? "px-3" : "px-8"}  `}>

                {selectedAgent.agentType == "text2sql_rag" && (
                    <SuggestionsChat list={selectedAgent.dataAgentSuggestion || []} sendSuggestion={sendChat} />
                )}

                <ChatInput sendChat={sendChat} />

            </div>

        </>
    );
}

export default Chat;
