import { useQuery } from "@tanstack/react-query";
import type { WorkspaceListModel } from "../../models/workspace.model";
import api from "../base.service";
import type { IFetchApiResult } from "../../models/api.models";
import { isLangGraphLocal } from "../../langgraph/localMode";
import { mockWorkspacesForBranch } from "../../langgraph/mockWorkspace";


export const getWorkspaceByBranch = (id: string | null | undefined) =>

    useQuery<IFetchApiResult<WorkspaceListModel[]>>({

        queryKey: ["workspaceById", id],

        queryFn: async () => {

            if (!id) return [];

            if (isLangGraphLocal()) {
                return { success: true, message: "", result: mockWorkspacesForBranch(id) };
            }

            const res = await api.get(`/workspace/getWorkspaceByBranch/${id}`);

            return res.data;

        },

        enabled: Boolean(id),
        retry: false,
    });

