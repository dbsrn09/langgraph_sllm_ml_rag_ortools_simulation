import { create } from "zustand";


type ChatContent = "chat" | "history"

type AgentTab = "chat" | "report"

interface UIState {

  chatContent: ChatContent;
  loadHistory: boolean;
  expandHeader: boolean;
  expandChat: boolean;
  expandSidebar: boolean;
  loadingChat: boolean;
  selectedTabAgent: AgentTab;

  setTabAgent: (val: AgentTab) => void;
  setChatContent: (val: ChatContent, hist: boolean) => void;
  setExpandHeader: (val: boolean) => void;
  setExpandChat: (val: boolean) => void;
  setExpandSidebar: (val: boolean) => void;
  setLoadingChat: (val: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  loadHistory: false,
  chatContent: "chat",
  expandSidebar: true,
  expandHeader: true,
  expandChat: false,
  loadingChat: false,
  selectedTabAgent: "chat",
  setTabAgent: (val: AgentTab) => set({ selectedTabAgent: val }),
  setChatContent: (val, hist: boolean = false) => set({ chatContent: val, loadHistory: hist }),
  setExpandHeader: (val) => set({ expandHeader: val }),
  setExpandChat: (val) => set({ expandChat: val }),
  setLoadingChat: (val) => set({ loadingChat: val }),
  setExpandSidebar: (val) => set({ expandSidebar: val })

}));
