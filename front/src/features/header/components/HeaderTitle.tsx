import { useTranslation } from "react-i18next";
import { Skeleton } from "../../../shared/components/ui/Skeleton";


interface HeaderTitleProps {
    totalChat: number;
    label: string;
    firstMessage: string;
    loadinChatHist: boolean;
}

const HeaderTitle = ({ totalChat, label, firstMessage, loadinChatHist }: HeaderTitleProps) => {

    const { t } = useTranslation();
    const msg = totalChat == 0 ? t("newChat") : label || firstMessage;
    return (

        <>
            {loadinChatHist ? <Skeleton /> :

                <h2 className="text-[16px] font-bold truncate max-w-96" title={msg}> {msg}</h2>

            }

        </>

    );

}

export default HeaderTitle;
