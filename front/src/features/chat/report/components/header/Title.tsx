import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TitleProps {
    totalVer: number;
    setShowVersion: () => void;
}

const Title = ({ setShowVersion, totalVer }: TitleProps) => {
    const { t } = useTranslation();

    return (

        <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#1A1D1F]">
             {t("reportAgent.title")}
            </h1>
            {totalVer > 0 && (
                <button onClick={setShowVersion} className="ml-2 px-2 py-0.5 bg-[var(--neutral-elevated)] border border-[var(--neutral-border)] rounded text-xs text-[#1A1D1F] hover:bg-[#F2F4F7] flex items-center gap-1 transition-colors">
                    <Clock className="w-4 h-4 text-[#1A1D1F]" />{t("reportAgent.history")}
                </button>)}

        </div>

    );
};

export default Title;
