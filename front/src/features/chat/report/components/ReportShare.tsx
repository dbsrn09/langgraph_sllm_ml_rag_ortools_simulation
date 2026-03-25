import { X } from "lucide-react";
import { Dialog } from "../../../../shared/components/ui/Dialog";
import { useChatStore } from "../../../../store/chat.store";
import { useTranslation } from "react-i18next";
import CopyContain from "../../../../shared/hooks/CopyContain";

interface ReportShareProps {
    setShowShare: () => void;
}

const ReportShare = ({ setShowShare }: ReportShareProps) => {
    const { t } = useTranslation();
    const { selectedChatId } = useChatStore();

    const baseurl = window.location.origin;
    const url = `${baseurl}/s/${selectedChatId}`;

    return (
        <Dialog className="p-0">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--neutral-border)]">
                <h2 className="text-lg font-bold text-[var(--neutral-ink)]">
                    {t("reportAgent.shared.title")}
                </h2>

                <button
                    onClick={setShowShare}
                    className="text-[var(--neutral-fg-subtle)] hover:text-[var(--neutral-ink)]"
                >
                    <X />
                </button>
            </div>

            <div className="flex gap-2 p-6">
                <div className="flex-1 px-3 py-2 bg-[var(--neutral-elevated)] border border-[var(--neutral-border)] rounded-lg text-sm text-[var(--neutral-fg-subtle)] truncate font-mono">
                    {url}
                </div>

                <button onClick={setShowShare} className="px-4  bg-[var(--neutral-ink)] text-[var(--neutral-surface)] text-sm font-medium rounded-lg hover:bg-black transition-colors flex items-center gap-2">
                    <CopyContain
                        value={url}
                        chatId={selectedChatId}
                        tooltip={t("reportAgent.shared.copied")}
                        message={t("reportAgent.shared.copied")}
                        text={t("reportAgent.shared.copy")}
                        className="text-white flex gap-3 items-center"
                    />

                </button>
            </div>
        </Dialog>
    );
};

export default ReportShare;
