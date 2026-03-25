
import { useTranslation } from "react-i18next";
import Navigation from "../../../features/navigation/Navigation";
import HistoryChat from "../../../features/history/HistoryChat";




const NavigationLayout = () => {

    const { t } = useTranslation();
    return (
        <div className="px-5 relative flex flex-col bg-[#F3F4F6] border-r border-[#E6E8EC] h-full shrink-0 flex-none font-sans w-[320px] z-20">
            <div className="flex flex-col  pt-6 pb-2 shrink-0">
                <div className="flex items-center text-gray-500 font-bold text-[15px] leading-[20px] tracking-tight">
                    {t("chatNav.chat")}
                </div>
            </div>
            <Navigation />
            <HistoryChat />
        </div>
    );
};

export default NavigationLayout;
