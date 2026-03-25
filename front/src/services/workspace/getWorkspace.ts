import { useQuery } from "@tanstack/react-query";
import type { WorkspaceListModel } from "../../models/workspace.model";
import type { IFetchApiResult } from "../../models/api.models";
import api from "../base.service";


export const useGetWorkspace = () =>

    useQuery<IFetchApiResult<WorkspaceListModel[]>>({

        queryKey: ["workspaceList"],

        queryFn: async () => {

            const res = await  api.get(`workspace/get`);
            
            return res.data;

        }

    });

    