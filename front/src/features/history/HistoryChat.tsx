import { Ellipsis, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useChatHistoryUpdateLabel } from "../../services/chat/chatHistoryUpdate";
import { useGetChatHistoryByAgent } from "../../services/chat/chatHistoryByAgent";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useChatDeleteHistory } from "../../services/chat/deleteChatHistory";
import type { ChatHistoryRequestDelete } from "../../models/chat.model";
import { useChatStore } from "../../store/chat.store";
import { TableSkeleton } from "../../shared/components/ui/TableSkeleton";
import { useUIStore } from "../../store/ui.store";
import { useAgentStore } from "../../store/agent.store";
import HistoryDeleteDialog from "./chat/HistoryDeleteDialog";
import HistoryEdit from "./chat/HistoryEdit";
import HistoryRename from "./chat/HistoryRename";
import { toast } from "sonner";



const HistoryChat = () => {


    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [draftName, setDraftName] = useState("");

    const { t } = useTranslation();

    const queryClient = useQueryClient();

    const { setChatContent, setTabAgent } = useUIStore();

    const { sessionId, setSessionId, setUpdateLabel, setNewCHat ,loadingChat} = useChatStore();

    const { selectedAgent } = useAgentStore();

    const { data: ChatHistoryByAgent, isLoading: isFetchingChat } = useGetChatHistoryByAgent(selectedAgent.id)

    const { mutate: mutateUpdateLabel, status: statusUpdate, } = useChatHistoryUpdateLabel();

    const { mutate: chatHistRequestDelete, status: statusChatDelete } = useChatDeleteHistory();

    const menuRef = useRef<HTMLDivElement | null>(null);

    const deleteChat = () => {

        if (!deleteId) return;

        setEditingId(null);
        setOpenMenu(null)

        const par: ChatHistoryRequestDelete = {
            dataAgentId: selectedAgent.id, sessionId: deleteId
        }

        chatHistRequestDelete(par, {
            onSuccess: () => {
                setDeleteId("")
                setDeleteConfirm(false)
                if (sessionId == deleteId) {
                    setChatContent("chat", false)
                    setTabAgent("chat")
                    setNewCHat()
                }

            },
        });

    }

    const onStatusUpdateLabel = statusUpdate == "pending" || statusChatDelete == "pending";

    const onUpdateLabel = (id: string, msg: string) => {

        mutateUpdateLabel(
            {
                id,
                msg
            },
            {
                onSuccess: () => {
                    queryClient.setQueryData(
                        ["chatHistoryByAgent", selectedAgent.id],
                        (old: any) => {
                            if (!old) return old;

                            return {
                                ...old,
                                result: old.result.map((item: any) =>
                                    item.id === id
                                        ? { ...item, label: msg }
                                        : item
                                )
                            };
                        }
                    );

                    setUpdateLabel(msg)

                    setEditingId(null);

                },

                onError: () => {

                }
            }
        );
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenMenu(null);
                setEditingId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getRowClass = (sessionIdHist: string) => {
   
        let base =
            "relative flex items-center px-2 py-2 rounded-lg cursor-pointer transition-colors group text-gray-500";

        if (editingId === sessionIdHist) {
            base += " bg-white border border-orange-200 ring-2 ring-orange-100/50 text-gray-900";
        } else if (sessionIdHist === sessionId) {
            base += " bg-white shadow-sm ring-1 ring-gray-200/80 text-gray-900";
        } else base += " hover:bg-gray-200"

        return base;
    };

    const getEllipsisClass = (sessionIdHist: string) => {
        const base =
            "p-1 rounded-md transition-colors focus:outline-none text-gray-500 hover:text-gray-700 hover:bg-gray-100";

        const visibility =
            sessionIdHist === sessionId
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100";

        return `${base} ${visibility}`;
    };


    const onClickChat = (sessionId: string) => {


        setEditingId(null);
        setOpenMenu(null)
        setSessionId(sessionId)
        setTabAgent("chat")
        setChatContent("chat", true)

    }

    const onClickRename = (sessionId: string, human: string) => {
        onClickChat(sessionId)
        setOpenMenu(null);
        setEditingId(sessionId);
        setDraftName(human);
    }

    const onClickEllpis = (e: React.MouseEvent, session: string) => {
        e.stopPropagation();
        setOpenMenu(prev =>
            prev === session ? null : session
        );
    }

    if (isFetchingChat)
        return <TableSkeleton rows={5} cols={1} />

    return (

        <div className="flex-1 flex flex-col h-full  overflow-hidden min-w-0 ">

            <div className="w-full pb-2 text-[12px] font-medium text-gray-500">
                {t("chatNav.recentChat")}
            </div>

            <HistoryDeleteDialog
                isLoadingDeletete={statusChatDelete == "pending"}
                onShow={deleteConfirm}
                onDelete={deleteChat}
                onCancel={() => setDeleteConfirm(false)}
            />

            <div className="overflow-y-auto" ref={menuRef}>

                {ChatHistoryByAgent?.result.map((item) => (

                    <div
                        key={item.sessionId}

                        className={getRowClass(item.sessionId)}>

                        <div className="flex items-center text-sm w-full ">

                            {editingId === item.sessionId ? (

                                <HistoryRename
                                    draftName={draftName}
                                    setDraftName={setDraftName}
                                    onUpdateLabel={() => onUpdateLabel(item.id, draftName)}
                                    statusUpdate={onStatusUpdateLabel}
                                />
                            ) : (

                                <>

                                    <div
                                        className="truncate  font-medium w-[90%]"
                                        onClick={() => 
                                        {

                                            if (sessionId === item.sessionId)return;
                                            if(loadingChat)
                                                toast.warning("Chat in Progress, Please wait...")
                                            else
                                            onClickChat(item.sessionId)
                                        }
                                        
                                        }
                                    >
                                        {item.label || item.human}
                                    </div>


                                    <div className="ml-auto relative" >

                                        {item.loadingHistory ? <Loader2 size={15} className="animate-spin text-gray-400" /> :
                                            <Ellipsis
                                                size={21}
                                                className={getEllipsisClass(item.sessionId)}
                                                onClick={(e) => onClickEllpis(e, item.sessionId)}
                                            />
                                        }


                                        {openMenu === item.sessionId && (

                                            <HistoryEdit
                                                onClickRename={() => onClickRename(item.sessionId, item.human)}
                                                onClickDelete={() => {
                                                    setOpenMenu(null)
                                                    setDeleteConfirm(true)
                                                    setDeleteId(item.sessionId)
                                                }
                                                }
                                            />

                                        )}
                                    </div>

                                </>

                            )}

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default HistoryChat;
