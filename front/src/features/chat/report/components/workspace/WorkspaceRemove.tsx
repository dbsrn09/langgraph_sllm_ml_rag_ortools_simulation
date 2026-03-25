import { EllipsisVertical, Loader2 } from "lucide-react";
import { useDeleteReport } from "../../../../../services/reportAgent/deleteReport";
import { useEffect, useRef } from "react";
import { useAgentStore } from "../../../../../store/agent.store";
import type { ReportAgentList } from "../../../../../models/reportagent.model";
import type { IFetchApiResult } from "../../../../../models/api.models";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
interface WorkspaceRemoveProps {
    removeId: string;
    openRemove: string;
    setOpenRemove: (id: string) => void;
    mode: "grid" | "list";
}

const WorkspaceRemove = ({ removeId, openRemove, setOpenRemove, mode }: WorkspaceRemoveProps) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const menuRef = useRef<HTMLDivElement | null>(null);

    const { mutateAsync, isPending } = useDeleteReport();

    const { selectedWorkspace } = useAgentStore();

    const handleDelete = async (id: string) => {

        queryClient.setQueryData<IFetchApiResult<ReportAgentList[]>>(
            ["reportAgents", selectedWorkspace.workspaceId],
            (oldData) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    result: oldData.result.filter(
                        (item) => item.id !== id
                    ),
                };
            }
        );
        
        setOpenRemove("");

        await mutateAsync({ id, workspaceId: selectedWorkspace.workspaceId });

    };

    useEffect(() => {
        if (openRemove !== removeId) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setOpenRemove("");
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [openRemove, removeId, setOpenRemove]);


    return (

        <div ref={menuRef} className="z-50">

            <button disabled={isPending} onClick={() =>
                setOpenRemove(removeId)
            } className={`${mode == "grid" ? "opacity-60 hover:bg-[var(--neutral-surface)]" : "opacity-0 text-[#9A9A9A] hover:text-[#454545]"}  hover:opacity-100 absolute w-7 right-5 top-5  text-center  p-1 rounded transition-colors  group-hover:opacity-100 focus:opacity-100 outline-none `}  >

                {isPending ? <Loader2 size={15} className="animate-spin " /> :
                    <EllipsisVertical className="w-5 h-5 text-[#1A1D1F]" />}
            </button>
            {openRemove == removeId && (
                <div className="absolute right-5 top-13 bg-white border border-gray-200 rounded-md shadow-lg ">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(removeId);
                        }}
                        className="text-xs px-5 py-2 rounded hover:bg-red-50 text-red-600 cursor-pointer outline-none w-25  text-left"
                    >
                        {t("chatNav.delete")}
                    </button>
                </div>
            )}

        </div>

    )
}

export default WorkspaceRemove;
