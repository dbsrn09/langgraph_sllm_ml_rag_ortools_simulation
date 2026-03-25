import { create } from "zustand";
import type { SelectedAgent, SelectedBranch, SelectedCompany, SelectedWorkspace } from "../models/main.model";

const initialSelectedWorkspace: SelectedWorkspace = {
    workspaceId: "",

};

const initialSelectedCompany: SelectedCompany = {
    companyId: "",
    companyName: ""
};

const initialSelectedBranch: SelectedBranch = {
    branchId: "",
    branchName: "",
    botName: "",
    welcomePrompt: "",
    logo: "",
};

const initialSelectedAgent: SelectedAgent = {
    id: "",
    agentType: "",
    dataAgentSuggestion: [],
};

interface AgentState {
    selectedCompany: SelectedCompany;
    selectedBranch: SelectedBranch;
    selectedWorkspace:SelectedWorkspace;
    selectedAgent: SelectedAgent;

    setCompany: (val: SelectedCompany) => void;
    setAgent: (val: SelectedAgent) => void;
    setBranch: (val: Partial<SelectedBranch>) => void;
    setWorkspace: (val: SelectedWorkspace) => void;

    resetAgent: () => void;
    resetAgentBranch: () => void;
}

export const useAgentStore = create<AgentState>((set) => ({
    selectedCompany: initialSelectedCompany,
    selectedBranch: initialSelectedBranch,
    selectedWorkspace:initialSelectedWorkspace,
    selectedAgent: initialSelectedAgent,

    setCompany: (val) => set({ selectedCompany: val }),

    setAgent: (val) => set({ selectedAgent: val }),

    setBranch: (val) =>
        set((state) => ({
            selectedBranch: {
                ...state.selectedBranch,
                ...val,
            },
        })),

    setWorkspace: (val) => set({ selectedWorkspace: val }),

    resetAgent: () => set({ selectedAgent: initialSelectedAgent }),

    resetAgentBranch: () =>
        set({
            selectedBranch: initialSelectedBranch,
            selectedAgent: initialSelectedAgent,
        }),
}));
