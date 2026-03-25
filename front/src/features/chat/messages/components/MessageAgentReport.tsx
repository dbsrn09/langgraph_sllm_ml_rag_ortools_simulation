import { useTranslation } from "react-i18next";
import { ArrowRight, Loader2, Save } from "lucide-react";
import { useUIStore } from "../../../../store/ui.store";
import { useChatStore } from "../../../../store/chat.store";
import type { ChatConversation } from "../../../../models/chat.model";
import { useSaveReport } from "../../../../services/reportAgent/saveReport";
import { useAgentStore } from "../../../../store/agent.store";
import { toast } from "sonner";



interface MessageAgentReportProps {
    data: ChatConversation;
}

const MessageAgentReport = ({ data }: MessageAgentReportProps) => {

    const { t } = useTranslation();
    const { selectedAgent, selectedWorkspace } = useAgentStore()
    const { selectChatId } = useChatStore()

    const { setTabAgent } = useUIStore()

    const { mutateAsync, isPending } = useSaveReport();

    const handleSave = async () => {

        if (!data.histId) return;

        const res = await mutateAsync({
            workspaceId: selectedWorkspace.workspaceId,
            dataAgentId: selectedAgent.id,
            sourceId: data.histId,
            sql: data.query ?? ""
        });

        if (res.success) {

            toast.success(t("reportAgent.version.saved"), {
                style: {
                    background: "#1f2937",
                    color: "#fff",
                    border: "none",
                },
            });

        } else {
            toast.error(res.message)
        }

    };

    return (

        <div className="flex items-center justify-between mt-3 px-8 ">

            <div className="flex items-center gap-2">

                <button
                    onClick={() => {
                        selectChatId(data.histId ?? "")
                        setTabAgent("report")
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E6E8EC] hover:bg-[#F7F8FB] text-[#1A1D1F] rounded-lg text-sm font-medium transition-colors active:scale-95 focus:outline-none focus:ring-1 focus:ring-[#121316]"
                    data-state="closed">

                    <span className="font-[Pretendard]">{t("chatConversation.viewFullReport")}</span>

                    <ArrowRight className="w-4 h-4 text-[#6C737F]" />

                </button>

                <button onClick={handleSave} disabled={isPending} className="flex items-center gap-2 px-3 py-1.5 bg-[#121316] hover:bg-[#2C2E33] text-white rounded-lg text-sm font-medium transition-colors active:scale-95 focus:outline-none focus:ring-1 focus:ring-[#121316] focus:ring-offset-1 font-[Pretendard]">
                    {isPending ? (
                        <Loader2 size={15} className="animate-spin text-gray-400" />
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            {t("chatConversation.saveToReport")}
                        </>
                    )}
                </button>

            </div >

        </div>

    );
}

export default MessageAgentReport;
