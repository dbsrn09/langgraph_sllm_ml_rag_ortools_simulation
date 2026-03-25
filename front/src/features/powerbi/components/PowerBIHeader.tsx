import { useTranslation } from "react-i18next";
import { ChartNoAxesColumn, MessageSquare } from "lucide-react";
import Language from "../../../shared/components/ui/Language";
import Account from "../../../shared/components/ui/Account";

interface PowerBIHeaderProps {
  tab: "chat" | "report";
  onChangeTab: (tab: "chat" | "report") => void;
}

const PowerBIHeader = ({ tab, onChangeTab }: PowerBIHeaderProps) => {
  const { t } = useTranslation();

  const baseClass =
    "font-semibold relative h-full flex items-center gap-2 px-6 text-sm transition-colors duration-200";

  const getTabClass = (value: "chat" | "report") =>
    `${baseClass} ${
      tab === value
        ? "text-[#1A1A1A]"
        : "text-[#6B6B6B] hover:text-[#1A1A1A]"
    }`;

  return (
    <div className="h-[60px] flex items-center px-8 border-b border-[#e6e8ec] bg-white sticky top-0 z-50 shrink-0">
      <div className="relative flex items-center gap-8 h-[44px] m-auto">
        
        {/* Animated underline */}
        <span
          className={`absolute bottom-0 h-[2px] bg-[#FF7A1A] transition-all duration-300 ease-in-out ${
            tab === "report"
              ? "left-0 w-[120px]"
              : "left-[140px] w-[140px]"
          }`}
        />

        <button
          role="tab"
          aria-selected={tab === "report"}
          className={getTabClass("report")}
          onClick={() => onChangeTab("report")}
        >
          <ChartNoAxesColumn className="w-5 h-5 stroke-[1.25px]" />
          <span>{t("powerBi.tab.report") || "Report"}</span>
        </button>

        <button
          role="tab"
          aria-selected={tab === "chat"}
          className={getTabClass("chat")}
          onClick={() => onChangeTab("chat")}
        >
          <MessageSquare className="w-5 h-5 stroke-[1.25px]" />
          <span>{t("powerBi.tab.chat") || "Chat Agent"}</span>
        </button>

  
      </div>
            <Language  />
            <Account/>
    </div>
  );
};

export default PowerBIHeader;
