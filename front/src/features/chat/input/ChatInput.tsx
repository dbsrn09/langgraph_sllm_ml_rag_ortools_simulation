import { useState } from "react";
import { useChatStore } from "../../../store/chat.store";
import TextInput from "./components/TextInput";
import ClearTextButton from "./components/ClearTextButton";
import SendChatButton from "./components/SendChatButton";




interface ChatInputProps {

    sendChat: (message: string) => void;

}

const ChatInput = ({ sendChat }: ChatInputProps) => {

    const [message, setMessage] = useState("");

    const {loadingChat ,loadinChatHist} = useChatStore()

    const inputWrapperClass = ` ${loadinChatHist ? " pointer-events-none " : ""}
     relative px-5 w-full min-h-[64px] flex items-center rounded-2xl
    bg-white transition-all duration-200 overflow-hidden
    inputbox-gradient-ring
    border border-[#E5E5E5]
    focus-within:ring-1
    focus-within:ring-[#ff8a1e]
    focus-within:shadow-inner
    ` 

    return (

        <div className={inputWrapperClass}>

            <TextInput sendChat={sendChat} setMessage={setMessage} message={message} loadingChat={loadingChat} />

            <ClearTextButton message={message} setMessage={setMessage} />

            <SendChatButton sendChat={sendChat} message={message} setMessage={setMessage} loadingChat={loadingChat}/>

        </div>

    );
}

export default ChatInput;
