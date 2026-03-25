import { Pencil } from "lucide-react";
import type { ChatConversation } from "../../../../models/chat.model";
import MessageEdit from "./MessageEdit";



interface ChatMessageUserProps {
    loadingChat: boolean;
    isEditMessage: ChatConversation;
    onUpdateMessage: (message: ChatConversation, newMessage: string) => void;
    onEditMessage: (message: ChatConversation) => void;
    onCancelEditMessage: () => void;
    data: ChatConversation
}

const MessageUser = ({ loadingChat,
    data, isEditMessage, onUpdateMessage, onEditMessage, onCancelEditMessage
}: ChatMessageUserProps) => {

    const userClass = `flex justify-end items-center  group relative `

    const humanMessageBoxClass = `
  bg-[#F3F4F6] px-5 py-4 rounded-2xl text-[16px]
  text-gray-900 leading-[24px] break-words shadow-sm
  relative max-w-[90%]
  transition-all duration-200 ease-out
   ${loadingChat ? "" : "group-hover:mr-10"}
`
    const editMessageClass = `
  absolute z-20 right-0 top-3
  p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100
  transition-all
  ${!loadingChat
            ? "opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
            : "hidden"}
`

    return (
        <div className={userClass}>

            {isEditMessage?.chatId == data.chatId ?

                <MessageEdit
                    onUpdateMessage={(newMessage: string) => onUpdateMessage(data, newMessage)}
                    initialMessage={data.message}
                    onCancel={onCancelEditMessage}

                />

                :

                <>

                    <div className={humanMessageBoxClass}>
                        {data.message} {data.isEdit && (<span className="align-baseline text-[12px] text-[#999999] ml-2 select-none whitespace-nowrap">(Edited)</span>)}
                    </div>
                    <button className={editMessageClass} onClick={() => onEditMessage(data)}>
                        <Pencil className="w-4 h-4" />
                    </button>

                </>

            }


        </div>
    );
};

export default MessageUser;
