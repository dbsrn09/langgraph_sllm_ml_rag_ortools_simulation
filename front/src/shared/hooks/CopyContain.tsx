import { Copy } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { toast } from "sonner";
import { useCallback } from "react";

interface CopyContainProps {
    text?:string;
    value: string;
    chatId: string;
    className?: string;
    tooltip: string;
    message: string;
    iconClass?:string
    type?:string
}

const CopyContain = ({
    text="",
    value,
    chatId,
    className = "",
    tooltip,
    message,
    iconClass = "w-[18px] h-[18px]",
    type ="text"
}: CopyContainProps) => {

    if (!value || !chatId) return null;

    const handleClick = useCallback(() => {

        try {
            let tmp = value;

            if (type == "text")
                tmp = tmp
                    .replace(/<br\s*\/?>/gi, "\n")
                    .replace(/<\/(p|div|section|article|h[1-6]|li)>/gi, "\n\n")
                    .replace(/<\/tr>/gi, "\n")
                    .replace(/<(\/)?(p|div|section|article|h[1-6]|li)[^>]*>/gi, "")
                    .replace(/<(\/)?(strong|b|em|i|u|span|a|small|sup|sub|code|pre|mark|blockquote)[^>]*>/gi, "")
                    .replace(/<[^>]+>/g, "")

                    .replace(/^#{1,6}\s*/gm, "")                // headings
                    .replace(/(\*\*|__)(.*?)\1/g, "$2")         // bold
                    .replace(/(\*|_)(.*?)\1/g, "$2")            // italic
                    .replace(/~~(.*?)~~/g, "$1")                // strikethrough
                    .replace(/`{1,3}([^`]*)`{1,3}/g, "$1")      // inline/code blocks
            
                    .trim();

            const txtarea = document.createElement("textarea");
            txtarea.value = tmp.trim();
            document.body.appendChild(txtarea);
            txtarea.select();

            const success = document.execCommand("copy");
            document.body.removeChild(txtarea);

            if (!success) throw new Error("execCommand failed");
                
        toast.success(message, {
            style: {
                background: "#1f2937",
                color: "#fff",
                border: "none",
            },
        });

        } catch (err) {
            const txtarea = document.createElement("textarea");
            txtarea.value = value;
            document.body.appendChild(txtarea);
            txtarea.select();
            document.execCommand("copy");
            document.body.removeChild(txtarea);
        }




    }, [value, chatId, message]);

    return (
        <Tooltip.Provider delayDuration={100}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <button
                        onClick={handleClick
                        }
                        aria-label="Copy response"
                        className={`
              p-1.5
              text-[#A7A7A7]
              hover:text-[#4A4A4A]
              rounded-md
              transition-all
              outline-none
              focus:ring-1 focus:ring-[#D0D0D0]
              active:scale-95
              ${className}
            `}
                    >
                        <Copy className={iconClass} /> {text}
                    </button>
                </Tooltip.Trigger>

                <Tooltip.Portal>
                    <Tooltip.Content
                        side="top"
                        align="center"
                        sideOffset={6}
                        className="
              px-2.5 py-1.5
              text-xs font-medium
              text-white
              bg-gray-900/90
              rounded-md
              shadow-sm
              animate-in fade-in
            "
                    >
                        {tooltip}

                        <Tooltip.Arrow className="fill-gray-900/90" />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
};

export default CopyContain;
