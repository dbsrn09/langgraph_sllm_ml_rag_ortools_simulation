import { useTranslation } from "react-i18next";
import { ChartNoAxesColumn, MessageSquare } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useChatStore } from "../../../store/chat.store";

interface HeaderTabProps {
  tab: "chat" | "report";
  onChangeTab: (tab: "chat" | "report") => void;
  loadinChatHist: boolean;
}

const HeaderTab = ({ tab, onChangeTab, loadinChatHist }: HeaderTabProps) => {
  const { t } = useTranslation();

  const { getLastChatId } = useChatStore()

  const baseClass =
    "font-semibold  hover:text-[#1A1A1A] group relative h-full flex items-center gap-2 px-4 text-sm transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E4E4E4]";

  const getTabClass = (value: "chat" | "report") =>
    `${baseClass} ${tab === value ? " border-b-2 border-[#FF7A1A] font-semibold text-[#1A1A1A] " : " rounded-lg text-[#6B6B6B]  hover:bg-[#F5F5F5]"
    }`;


  return (
    <div className={`${loadinChatHist ? "hidden" : ""} h-[56px] flex items-center justify-between px-2 border-b border-[#e6e8ec] bg-white sticky top-0 z-10 shrink-0 ml-auto`} >

      <div className="relative  flex items-center gap-4 h-[44px] ml-auto" role="tablist">

        <span
          className={`absolute bottom-0 left-0 h-[2px] w-1/2 bg-[#FF7A1A] 
    transition-transform duration-300 ease-in-out
    ${tab === "report" ? "translate-x-full" : "translate-x-0"}`}
        />

        <Tooltip.Provider delayDuration={100}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                role="tab"
                aria-selected={tab === "chat"}
                className={getTabClass("chat")}
                onClick={() => onChangeTab("chat")}
              >
                <MessageSquare className="w-5 h-5 stroke-[1.25px]" />
                <span>{t("chatConversation.tab.dataAgent") || "Data Agent"}</span>
              </button>

            </Tooltip.Trigger>

            <Tooltip.Portal>
              <Tooltip.Content
                side="top"
                align="center"
                sideOffset={6}
                className="
              px-2.5 py-1.5
              text-xs font-medium
              text-white
              bg-gray-900/90
              rounded-md
              shadow-sm
              animate-in fade-in
            "
              >
                {t("tooltip.dataAgent")}


                <Tooltip.Arrow className="fill-gray-900/90" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>

        <Tooltip.Provider delayDuration={100}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>

              <button
                role="tab"
                aria-selected={tab === "report"}
                className={getTabClass("report")}
                onClick={() => {
                  getLastChatId()
                  onChangeTab("report")
                }
                }
              >
                <ChartNoAxesColumn className="w-5 h-5 stroke-[1.25px]" />
                <span>{t("chatConversation.tab.reportAgent") || "Report Agent"}</span>
              </button>


            </Tooltip.Trigger>

            <Tooltip.Portal>
              <Tooltip.Content
                side="top"
                align="center"
                sideOffset={6}
                className="
              px-2.5 py-1.5
              text-xs font-medium
              text-white
              bg-gray-900/90
              rounded-md
              shadow-sm
              animate-in fade-in
            "
              >
                {t("tooltip.reportAgent")}

                <Tooltip.Arrow className="fill-gray-900/90" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>



      </div>
    </div>
  );
};

export default HeaderTab;
