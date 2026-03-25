
import { create } from "zustand";
import type { SelectedAgent, SelectedBranch } from "../models/main.model";
import type { User } from "../models/auth.model";
import { getUUID } from "../utils/uuid";

type MainContent = "chat" | "powerbi" 
type ChatContent = "chat" | "history" | ""
const initialSelectedBranch: SelectedBranch = {
    branchId: "",
    branchName: "",
    botName: "",
    welcomePrompt: "",
    logo: "",
    bgImg:""
};

const initialSelectedAgent: SelectedAgent = {
    id: "",
    agentType: "",
    dataAgentSuggestion:[]
};

export const initialCredential: User = {
    user: {
        name: "",
        email: "",
        defaultLang: ""
    },
    accessToken: "",
    isAuthenticated: false
};

interface AppState {
    selectedChatControl:string;
    chatContent:ChatContent
    mainContent: MainContent;
    loadingChat: boolean;
    expandHeader: boolean;
    expandChat: boolean;
    selectedCompanyId: string;
    selectedBranch: SelectedBranch;
    selectedAgent: SelectedAgent;
    selectedCredential: User;
    sessionId: string;

    setChatControl: (val: string) => void;
    setResetCredential: () => void;
    setCredential: (val: User) => void;
    setLoadingChat: (val: boolean) => void;
    setExpandHeader: (val: boolean) => void;
    setExpandChat: (val: boolean) => void;
    setCompanyId: (val: string) => void;
    setSelectedAgent: (val: SelectedAgent) => void;
    setSelectedBranch: (val: Partial<SelectedBranch>) => void;
    resetAgent: () => void;
    resetAgentBranch: () => void;

    resetChatFn?: () => void;
    setResetChatFn: (fn: () => void) => void;
    resetChat: () => void;
    setSessionId: (val: string) => void;
    setMainContent:(val: MainContent) => void;
    setChatContent:(val: ChatContent) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
    selectedChatControl:"",
    selectedCompanyId: "",
    expandChat: false,
    expandHeader: true,
    selectedBranch: initialSelectedBranch,
    selectedAgent: initialSelectedAgent,
    loadingChat: false,
    selectedCredential: initialCredential,
    resetChatFn: undefined,
    sessionId: getUUID(),
    mainContent: "chat",
    chatContent:"",
    setChatControl: (val: string) =>
        set({
            selectedChatControl: val
        }),
    setChatContent: (val: ChatContent) =>
        set({
            chatContent: val
        }),
    setMainContent: (val: MainContent) =>
        set({
            mainContent: val
        }),
    setSessionId: (val: string) =>
        set({
            sessionId: val
        }),
    setResetCredential: () =>
        set({
            selectedCredential: initialCredential,
        }),
    setCredential: (val) =>
        set({
            selectedCredential: val,
        }),
    setResetChatFn: (fn) =>
        set({
            resetChatFn: fn,
        }),

    resetChat: () => {
        const fn = get().resetChatFn;
        fn?.();
    },
    setExpandHeader: (val) =>
        set({
            expandHeader: val,
        }),
    setExpandChat: (val) =>
        set({
            expandChat: val,
        }),

    setCompanyId: (val) =>
        set({
            selectedCompanyId: val,
        }),

    setLoadingChat: (val) =>
        set({
            loadingChat: val,
        }),
    setSelectedAgent: (val) =>
        set({
            selectedAgent: val,
        }),

    setSelectedBranch: (val) =>
        set((state) => ({
            selectedBranch: {
                ...state.selectedBranch,
                ...val,
            },
        })),

    resetAgentBranch: () =>
        set({
            selectedBranch: initialSelectedBranch,
            selectedAgent: initialSelectedAgent,
        }),
    resetAgent: () =>
        set({
            selectedAgent: initialSelectedAgent,
        }),
}));
