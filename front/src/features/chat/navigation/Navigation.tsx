import { Search, SquarePen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUIStore } from "../../../store/ui.store";
import { useChatStore } from "../../../store/chat.store";


const Navigation = () => {

    const { t } = useTranslation();

    const { setChatContent  ,chatContent,setTabAgent} = useUIStore();

    const { setSessionId, setNewCHat } = useChatStore();

    const menuClass = (label: string) => {

        let base = "w-full text-gray-500  flex items-center px-1 py-2 rounded-lg transition-colors group text-left hover:bg-gray-200 hover:text-gray-900 hover:font-medium text-sm cursor-pointer"

        if (label == chatContent)
            base += " bg-gray-200 font-medium text-gray-900 "

        return base
    }

    const iconClass = "w-4 h-4 inline mr-3 text-gray-500 group-hover:text-gray-900 group-hover:font-medium"
    
    type ChatContent = "chat" | "history" 

    const items = [
        { icon: SquarePen, label: t("chatNav.newChat"), value: "chat" },
        { icon: Search, label: t("chatNav.search"), value: "history" }
    ];

    return (
        <div className="w-full mt-2 mb-6 space-y-1">
            {items.map(({ icon: Icon, label, value }) => (
                <div key={label} className={menuClass(label)} onClick={() => {

                    if (value == "chat"){
                        setTabAgent("chat")
                        setNewCHat()
                    }else {
                        setSessionId("")
                    }
                    setChatContent(value as ChatContent,false)

                }}>
                    <Icon className={iconClass} />
                    {label}
                </div>
            ))}
        </div>
    );
}

export default Navigation
