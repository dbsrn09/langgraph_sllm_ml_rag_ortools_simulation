import { ChevronDown, Folder } from "lucide-react";
import { useTranslation } from "react-i18next";

interface WorkspaceToggleButtonProps {
    total: number;
    setOpen: () => void;
    open: "chart" | "workspace" | "";
}
const WorkspaceToggleButton = ({ total, setOpen, open }: WorkspaceToggleButtonProps) => {
    const { t } = useTranslation();
    return (

        <div
            onClick={() => setOpen()}
            className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-[#F7F7F7] transition-colors select-none group"
        >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-[#F5F5F5] text-[#A0A0A0] rounded-lg group-hover:bg-[#EAEAEA] transition-colors border border-[#EAEAEA]">
                    <Folder className=" w-5 h-5 text-inherit" />

                </div>
                <h2 className="text-base leading-6 font-semibold text-[#111111]">
                    {t("reportAgent.workspace")}
                </h2>
                <span className="px-2 py-0.5 bg-[#F5F5F5] text-[#9A9A9A] text-xs font-semibold rounded-full border border-[#EAEAEA]">{total}</span>
            </div>

            <ChevronDown
                className={`w-6 h-6 text-[#B8B8B8] group-hover:text-[#7A7A7A] transition-all duration-300 ${open == "workspace" ? "rotate-180" : ""
                    }`}
            />
        </div>

    );
};

export default WorkspaceToggleButton;
