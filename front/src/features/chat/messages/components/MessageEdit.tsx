import { useState, useRef, useEffect } from "react";

interface MessageEditProps {
    onUpdateMessage: (message: string) => void;
    initialMessage: string;
    onCancel: () => void;
}

const MessageEdit = ({
    onUpdateMessage,
    initialMessage,
    onCancel,
}: MessageEditProps) => {
    const [message, setMessage] = useState(initialMessage);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const MAX_HEIGHT = 180;
    const resizeTextarea = () => {
        const el = textareaRef.current;
        if (!el) return;

        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, MAX_HEIGHT) + "px";
    };

    useEffect(() => {
        resizeTextarea();
    }, [message]);

    const handleSend = () => {
        if (!message.trim()) return;
        onUpdateMessage(message);
    };

    return (
        <div className="w-full max-w-[90%] flex flex-col items-end">
            <div className="w-full bg-[#FAFAFA] border border-[#E2E2E2] rounded-[16px] p-4 shadow-sm transition-colors focus-within:bg-white focus-within:border-[#D1D5DB]">
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-[16px] text-gray-900 leading-[24px] resize-none placeholder-gray-400 min-h-[24px] overflow-y-auto"
                    spellCheck={false}
                />
            </div>

            <div className="flex items-center justify-end gap-2 mt-2">
                <button
                    onClick={onCancel}
                    className="px-3 py-2 bg-[#F2F4F7] hover:bg-[#E4E7EC] text-gray-700 text-[12px] font-medium rounded-full transition-colors leading-[16px]"
                >
                    Cancel
                </button>

                <button
                    onClick={handleSend}
                    disabled={!message.trim() || initialMessage.trim() == message.trim()}
                    className="px-3 py-2 bg-black hover:bg-gray-800 disabled:opacity-50 disabled:hover:bg-black text-white text-[12px] font-medium rounded-full transition-colors leading-[16px]"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default MessageEdit;
