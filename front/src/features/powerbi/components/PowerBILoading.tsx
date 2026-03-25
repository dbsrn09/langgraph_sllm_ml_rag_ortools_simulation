import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";


interface PowerBIChatProps {

}

const PowerBILoading = ({

}: PowerBIChatProps) => {

 const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
            <Loader className="w-8 h-8 animate-spin text-[#FF7A1A]" />
            <span className="text-sm font-medium">{t("powerBi.loading")}</span>
        </div>
    );


};

export default PowerBILoading;
