import { create } from "zustand";
import { getUUID } from "../utils/uuid";
import type { ChatConversation, ChatPowerBISource } from "../models/chat.model";

interface ChatState {

    chart: string;
    loadingChat: boolean;
    loadinChatHist: boolean;
    chatMode: string;
    sessionId: string;
    chatConversationList: ChatConversation[],
    editMessage: ChatConversation,
    powerBiSource: ChatPowerBISource,
    selectedChatId: string;
    isFetchingChart: string;

    getQueryResult: (id: string) => any[] | null;
    selectChatId: (id: string) => void;

    getChat: () => ChatConversation | null;

    setChart: (val: string) => void;

    getLastChatId: () => void;

    setLoadingTable: (val: boolean, chatId: string) => void;
    setLoadingChart: (val: boolean, chatId: string) => void;
    setPowerBiSource: (val: ChatPowerBISource) => void;
    setChartSource: (val: string, id: string) => void;
    setTableSource: (val: any[], id: string) => void;
    setEditMessage: (val: ChatConversation) => void;
    setUpdateLabel: (val: string) => void;
    setChatMode: (val: string) => void;
    setLoadingChat: (val: boolean) => void;
    setLoadinChatHist: (val: boolean) => void;
    setNewCHat: () => void;
    setSessionId: (val: string) => void;


    setAppendMessage: (msg: ChatConversation) => void;
    setChatConversationList: (val: ChatConversation[]) => void;
    setUpdateMessage: (payload: Partial<ChatConversation>) => void;
    setAiResponse: (args: {
        chatId: string;
        eventType: string;
        data: string;
        question: string;
    }) => void;

    /** 로컬 LangGraph: 스트리밍 없이 AI 말풍선 최종 반영 */
    patchAiMessage: (chatId: string, patch: Partial<ChatConversation>) => void;

}

export const useChatStore = create<ChatState>((set, get) => ({
    chart: "",
    chatMode: "chat",
    loadinChatHist: false,
    loadingChat: false,
    chatConversationList: [],
    resetChatFn: undefined,
    sessionId: getUUID(),
    mainContent: "",
    editMessage: {
        chatId: "",
        role: "user",
        message: ""

    },

    powerBiSource: {
        powerBILoaded: false,
        powerBISource: ""
    },
    selectedChatId: "",
    isFetchingChart: "",
    selectChatId: (id: string) => set({
        selectedChatId: id
    }),

    setChart: (val: string) =>
        set({
            chart: val
        }),

    setPowerBiSource: (val: ChatPowerBISource) =>
        set({
            powerBiSource: val
        }),

    setEditMessage: (val: ChatConversation) =>
        set({
            editMessage: val
        }),



    setUpdateLabel: (msg: string) =>
        set((state) => {
            if (!state.chatConversationList.length) return state;

            const updated = [...state.chatConversationList];

            updated[0] = {
                ...updated[0],
                label: msg,
            };

            return { chatConversationList: updated };
        }),
    setChatMode: (val: string) =>
        set({
            chatMode: val
        }),

    setSessionId: (val: string) =>
        set({
            sessionId: val
        }),

    setNewCHat: () => {
        set({
            chatConversationList: [],
            chatMode: "chat",
            sessionId: getUUID(),
            loadingChat: false,
            loadinChatHist: false,
            selectedChatId: ""
        })
    },


    setLoadingChat: (val) =>
        set({
            loadingChat: val,
        }),
    setLoadinChatHist: (val) =>
        set({
            loadinChatHist: val
        }),
    setChatConversationList: (val: ChatConversation[]) =>
        set({
            chatConversationList: val,
        }),

    setAppendMessage: (msg) =>
        set((state) => ({
            chatConversationList: [
                ...state.chatConversationList,
                msg
            ]
        })),

    getQueryResult: (id:string) => {
        const { chatConversationList } = get();

        if (!id) return null;

        const chat = chatConversationList.find(
            (e) => e.role === "ai" && e.histId === id
        ) ?? null;

        return chat?.queryResult || null;
    },
    getChat: () => {
        const { chatConversationList, selectedChatId } = get();

        if (!selectedChatId) return null;

        const chat = chatConversationList.find(
            (e) => e.role === "ai" && e.histId === selectedChatId
        ) ?? null;

        return chat;
    },


    getLastChatId: () => {
        const { chatConversationList } = get();

        const lastAI = [...chatConversationList]
            .reverse()
            .find((item) => item.role === "ai");

        if (!lastAI) return;

        set({
            selectedChatId: lastAI.histId
        });
    },

    setLoadingTable: (val: boolean, chatId: string) =>
        set((state) => ({
            chatConversationList: state.chatConversationList.map(item =>
                item.role === "ai" && item.histId === chatId
                    ? { ...item, loadingTable: val }
                    : item
            )
        })),
    setLoadingChart: (val: boolean, id: string) =>
        set((state) => ({
            chatConversationList: state.chatConversationList.map((item) =>
                item.role === "ai" && item.histId === id
                    ? { ...item, loadingChart: val }
                    : item
            ),
            isFetchingChart: !val ? "":id,
        })),

    setTableSource: (val: any[], id: string) =>
        set((state) => ({
            chatConversationList: state.chatConversationList.map(item =>
                item.role === "ai" && item.histId === id
                    ? { ...item, queryResult: val }
                    : item
            )
        })),
    setChartSource: (val: string, id: string) =>
        set((state) => ({
            chatConversationList: state.chatConversationList.map(item =>
                item.role === "ai" && item.histId === id
                    ? { ...item, chart: val }
                    : item
            )
        })),

    setUpdateMessage: (payload) =>
        set((state) => {
            const idx = state.chatConversationList.findIndex(
                m => m.role === "user" && m.chatId === payload.chatId
            );

            if (idx < 0) return state;

            return {
                chatConversationList: state.chatConversationList
                    .slice(0, idx)
                    .concat({
                        ...state.chatConversationList[idx],
                        ...payload
                    })
            };
        }),
    setAiResponse: ({ chatId, eventType, data, question }) =>
        set((state) => {

            const update = (patch: Partial<ChatConversation>, loadingChat?: boolean) => ({
                loadingChat: loadingChat ?? state.loadingChat,
                chatConversationList: state.chatConversationList.map(item =>
                    item.role === "ai" && item.chatId === chatId
                        ? { ...item, ...patch }
                        : item
                )
            });

            switch (eventType.toLowerCase()) {

                case "progress":
                    return update({
                        streamingStatus: data
                    });

                case "output":
                    return update({
                        message: (state.chatConversationList
                            .find(i => i.chatId === chatId && i.role === "ai")?.message || "") + data,
                        streamingStatus: ""
                    });

                case "done":
                    let source = {} as any

                    if (data) {
                        source = JSON.parse(data)
                    }

                    return update({
                        question: question,
                        ragReference: source.rag_reference,
                        ragSource: source.rag_source,
                        sqlSource: source.sql_source,
                        hasAnswer: source.hasAnswer,
                        query: source.sql,
                        histId: source.histId
                    }, false);

                case "cancelled":
                    return update({
                        streamingStatus: "Cancelled"
                    }, false);

                case "error":
                    return update({
                        streamingStatus: "Error",
                        message: (state.chatConversationList
                            .find(i => i.chatId === chatId && i.role === "ai")?.message || "") +
                            `\n\n ${data}`
                    }, false);


                default:
                    return state;


            }
        }),

    patchAiMessage: (chatId, patch) =>
        set((state) => ({
            loadingChat: false,
            chatConversationList: state.chatConversationList.map((item) =>
                item.role === "ai" && item.chatId === chatId
                    ? { ...item, ...patch, streamingStatus: patch.streamingStatus ?? "" }
                    : item
            )
        })),

    // setAiResponse: ({ chatId, eventType, data }) =>
    //     set((state) => {
    //         if (eventType === "Progress") {
    //             return {
    //                 chatConversationList: state.chatConversationList.map(item =>
    //                     item.role === "ai" && item.chatId === chatId
    //                         ? {
    //                             ...item,
    //                             streamingStatus: data
    //                         }
    //                         : item
    //                 )
    //             };
    //         }

    //         if (eventType === "Output") {

    //             return {
    //                 chatConversationList: state.chatConversationList.map(item =>
    //                     item.role === "ai" && item.chatId === chatId
    //                         ? {
    //                             ...item,
    //                             message: item.message + data,
    //                             streamingStatus: ""
    //                         }
    //                         : item
    //                 )
    //             };
    //         }

    //         return state;
    //     }),
}));
