import { useRef } from "react";
import { useTranslation } from "react-i18next";

interface TextInputProps {
    setMessage: (message: string) => void;
    message: string;
    sendChat: (message: string) => void;
    loadingChat: boolean;
}
const TextInput = ({ sendChat, setMessage, message, loadingChat }: TextInputProps) => {
    const { t } = useTranslation();
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const autoResize = () => {
        const el = textareaRef.current;
        if (!el) return;

        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
    };

    const sendMessage = () => {

        if (loadingChat) return;

        if (!message.trim()) return;

        sendChat(message)

        setMessage("")
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        autoResize();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
            return;
        }

        if (e.key === "Enter" && e.shiftKey) {
            requestAnimationFrame(autoResize);
        }
    };



    const textareaClass = `
     items-center w-full h-auto min-h-[64px]  
    max-h-[160px] py-[20px] pr-[10px] text-gray-900 
    placeholder-gray-400 bg-transparent border-none resize-none 
    focus:ring-0 focus:border-transparent text-[16px] leading-[24px] 
    outline-none caret-gray-900 block overflow-y-auto relative z-20
    `


    return (
        <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={textareaClass}
            rows={1}
            placeholder={t("typeYourMessage")}

        />

    );

}

export default TextInput;
