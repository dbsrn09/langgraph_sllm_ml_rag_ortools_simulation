import {  Ellipsis, Loader2, RefreshCw, Share2} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRerunReport } from "../../../../../services/reportAgent/rerunReport";
import { useAgentStore } from "../../../../../store/agent.store";
import { useChatStore } from "../../../../../store/chat.store";
import { useTranslation } from "react-i18next";


interface OtheButton {
    setShowShare: () => void;
}
const OtherButton = ({ setShowShare }: OtheButton) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const { selectedCompany } = useAgentStore()
    const { selectedChatId, setTableSource, setLoadingChart } = useChatStore()
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { mutateAsync, isPending } = useRerunReport();


    const regenerateChart = async (id: string) => {
        try {
            setOpen(false)

            if (!id) return;

            setLoadingChart(true, selectedChatId)

            const rerun = await mutateAsync({
                companyId: selectedCompany.companyId,
                id: id
            })



            if (rerun.success) {

                setTableSource(rerun.result, selectedChatId)
            }

        } catch (err) {
  
            console.log("mutation failed or aborted", err)
        } finally {
            setLoadingChart(false, selectedChatId)
        }
    }

    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }

        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);

    return (

        <>

            <div className="hidden xl:flex items-center gap-2">
                <button disabled={isPending} onClick={() => { regenerateChart(selectedChatId) }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors border shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--state-focus)] bg-[var(--neutral-surface)] text-[#1A1D1F] border-[var(--neutral-border)] hover:bg-[var(--neutral-elevated)]">
                    {isPending ? <Loader2 size={15} className="animate-spin text-gray-400" /> : <><RefreshCw className="w-4 h-4" />
                        {t("reportAgent.regenerate")}  </>}
                </button>

                <button onClick={setShowShare} className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors border shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--state-focus)] bg-[var(--neutral-surface)] text-[#1A1D1F] border-[var(--neutral-border)] hover:bg-[var(--neutral-elevated)]">
                    <Share2 className="w-4 h-4" />
                    {t("reportAgent.share")}
                </button>
            </div>

            <div
                ref={dropdownRef}
                className="relative flex xl:hidden"
            >
                <button
                    onClick={() => setOpen((prev) => !prev)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors border shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--state-focus)] bg-[var(--neutral-surface)] text-[#1A1D1F] border-[var(--neutral-border)] hover:bg-[var(--neutral-elevated)]"
                >
                    <Ellipsis className="w-5 h-5 text-[#1A1D1F]" />
                    <span className="sr-only">More Actions</span>
                </button>

                {open && (
                    <div className="absolute right-0 top-full mt-2 w-44 rounded-lg border bg-white shadow-lg z-50 p-1 animate-in fade-in zoom-in-95">
                        <button disabled={isPending}
                            onClick={() => { regenerateChart(selectedChatId) }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                        >
                            {isPending ? <Loader2 size={15} className="animate-spin text-gray-400" /> : <><RefreshCw className="w-4 h-4" />
                                {t("reportAgent.regenerate")}  </>}
                        </button>

                        <button
                            onClick={setShowShare}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                        >
                            <Share2 className="w-4 h-4" />
                            {t("reportAgent.share")}
                        </button>
                    </div>
                )}


            </div>

        </>

    );
};

export default OtherButton;
