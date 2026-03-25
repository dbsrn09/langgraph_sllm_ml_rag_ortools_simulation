import { ArrowUp} from "lucide-react";
import { useRef } from "react";



interface SendChatButtonProps {
    setMessage: (message: string) => void;
    sendChat: (message: string) => void;
    message: string;
    loadingChat: boolean;
}

const SendChatButton = ({ setMessage, sendChat, message, loadingChat }: SendChatButtonProps) => {


    const textareaRef = useRef<HTMLTextAreaElement | null>(null);



    const sendMessage = () => {
        if  (loadingChat)return;
        if (!message.trim()) return;

        sendChat(message)


        setMessage("")
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };



    const isEmpty = message.trim().length === 0;

    const buttonClass = `
    items-center flex rounded-lg p-[8px] shadow-sm
    transition-all duration-200
    ${isEmpty ? "bg-[#EDEDED] cursor-not-allowed" : "bg-[#FF8A1E] hover:bg-[#E97816] cursor-pointer"}
    `

    return (
        <button
            onClick={sendMessage}
            disabled={loadingChat || isEmpty}
            className={buttonClass}
        >
            <ArrowUp
                className={`${isEmpty ? "text-[#8F8F8F]" : "text-white"}  w-5 h-5`}
            />
        </button>

    );
}

export default SendChatButton;
