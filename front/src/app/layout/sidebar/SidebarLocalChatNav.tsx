import { useTranslation } from "react-i18next";
import Navigation from "../../../features/navigation/Navigation";
import HistoryChat from "../../../features/history/HistoryChat";

/**
 * 로컬 LangGraph 모드: 기존 워크스페이스 트리 대신
 * ai365와 동일한 톤으로 「새 채팅 / 검색 + 최근 채팅」을 왼쪽 사이드에 배치합니다.
 */
const SidebarLocalChatNav = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col flex-1 min-h-0 px-3 pb-2">
      <div className="flex flex-col pt-2 pb-2 shrink-0 border-b border-gray-100">
        <div className="flex items-center text-gray-600 font-bold text-[13px] leading-5 tracking-tight">
          {t("chatNav.chat")}
        </div>
      </div>
      <Navigation />
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <HistoryChat />
      </div>
    </div>
  );
};

export default SidebarLocalChatNav;
