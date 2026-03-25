import { Clock, RotateCcw, X } from "lucide-react";
import type { ReportAgentVersion } from "../../../../models/reportagent.model";
import { TableSkeleton } from "../../../../shared/components/ui/TableSkeleton";
import { formatDate } from "../../../../shared/components/FormatDate";
import { useGetReportChartVer } from "../../../../services/reportAgent/geReportChartVer";
import { useChatStore } from "../../../../store/chat.store";
import { useTranslation } from "react-i18next";

interface ReportVersionHistProps {
    data: ReportAgentVersion[];
    isFetching: boolean;
    onClose: () => void;
}

const ReportVersionHist = ({ data, isFetching, onClose }: ReportVersionHistProps) => {
    const { t } = useTranslation();
    const { mutateAsync } = useGetReportChartVer();

    const { selectedChatId, setTableSource, setLoadingChart } = useChatStore()

    const restoreVersion = async (id: string) => {
        try {

            onClose()
            if (!id) return;

            setLoadingChart(true, selectedChatId)

            const result = await mutateAsync({  id, chatId: selectedChatId});

            if (result.success) {

                setTableSource(result.result, selectedChatId)
            }

        } catch (err) {
            // silently ignore if aborted
            console.log("mutation failed or aborted", err)
        } finally {
            setLoadingChart(false, selectedChatId)
        }

    }
    return (
        <div className="fixed top-0 right-0 h-full w-[320px] bg-[var(--neutral-surface)] border-l border-[var(--neutral-border)] shadow-2xl z-[101] animate-in slide-in-from-right duration-300 flex flex-col focus:outline-none">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--neutral-border)]">
                <h2 className="text-lg font-bold text-[var(--neutral-ink)] flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[var(--aux-slate)]" />{t("reportAgent.version.history")}</h2>
                <p className="sr-only">View and restore previous versions of this analysis.</p>
                <button onClick={onClose} className="text-[var(--neutral-fg-subtle)] hover:text-[var(--neutral-ink)]">
                    <X className="w-5 h-5" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-0 divide-y divide-[var(--neutral-border)]">
                {isFetching
                    ? <TableSkeleton rows={5} cols={1} />
                    : data.map((list: ReportAgentVersion, index: number) =>
                        <div key={index} className="p-4 hover:bg-[var(--neutral-elevated)] group transition-colors">
                            <div className="flex justify-between items-start mb-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[var(--neutral-border)] text-[var(--neutral-ink)]">v{list.ver}</span>
                                <span className="text-xs text-[var(--neutral-fg-subtle)]">{formatDate(list.create)}</span>
                            </div>
                            <p className="text-sm text-[var(--neutral-fg)] mb-3 line-clamp-2">{t("reportAgent.version.analysis")} v{list.ver} {t("reportAgent.version.snapshot")}</p>
                            <button onClick={() => restoreVersion(list.id)} className="text-xs font-medium text-[var(--aux-slate)] hover:text-[var(--neutral-ink)] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <RotateCcw className="w-3 h-3" />
                               {t("reportAgent.version.restore")}
                            </button>
                        </div>
                    )}

            </div>
        </div>
    );
};

export default ReportVersionHist;
