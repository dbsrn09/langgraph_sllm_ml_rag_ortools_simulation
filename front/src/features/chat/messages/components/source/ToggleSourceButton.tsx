
import { ChevronDown, Database, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";


interface ToggleSourceButtonProps {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
    source?: string;
}

const ToggleSourceButton = ({ isOpen, setIsOpen, source = "sql" }: ToggleSourceButtonProps) => {

    const { t } = useTranslation();
    const svgClass = `w-4 h-4 ${isOpen ? " bg-blue-50 text-blue-600" : ""} `
    return (
        
        <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors  ${isOpen ? " bg-gray-50/80 border-b border-gray-100" : "bg-white hover:bg-gray-50 "}`}
        >
            <div className="flex items-center gap-2.5">
                
                <div className={`p-1.5 rounded-md transition-colors bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700`}>
                    {
                        source === "sql" ?
                            <Database className={svgClass} /> :
                            <FileText className={svgClass} />

                    }

                </div>

                <span className="text-[14px] font-semibold transition-colors text-gray-700">
                    {t("chatSource.view")}
                </span>
            </div>
            <ChevronDown
                className={`text-gray-400 w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                    }`}
            />
        </button>

    );
};

export default ToggleSourceButton;
