import { LoaderCircle } from "lucide-react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { ChatConversation } from "../../../../models/chat.model";
import { AiIcon } from "../../../../shared/components/icon/AiIcon";
import CopyContain from "../../../../shared/hooks/CopyContain";

marked.use({
  gfm: true,
  breaks: true,
});

interface MessageAIProps {
  data: ChatConversation;
}

const MessageAI = ({ data }: MessageAIProps) => {

  const { t } = useTranslation();

  const aiClass = `flex justify-start gap-2 relative group`;

  const aiMessageBoxClass = `flex-1 min-w-0`;


  const parsedHtml = useMemo(() => {

    if (!data.message) return "";
    const cleanedMessage = data.message.replace(
      /(\*\*[^\s][^*]*?\*\*)(?=\S)/g,
      "$1 "
    );
    const rawHtml = marked.parse(cleanedMessage) as string;

    return DOMPurify.sanitize(rawHtml);

  }, [data.message]);

  return (
    <div className={aiClass}>
      <AiIcon size={24} />
      <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyContain
          value={data.message}
          chatId={data.chatId || ""}
          tooltip={t("chatConversation.copyAnswer")}
          message={t("chatConversation.copiedAnswer")}
        />
      </div>

      <div className={aiMessageBoxClass}>
        {data.message ? (
          <div
            className="
  break-words
       [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:font-semibold [&_h3]:text-lg
    [&_p]:my-2
  [&_strong]:font-bold
  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2
  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2
  [&_li]:my-1
  [&_li::marker]:text-[#FF7A1A]
"

            dangerouslySetInnerHTML={{ __html: parsedHtml }}
          />
        ) : (
          <div className="flex items-center gap-3 text-gray-500">
            <span className="flex items-center gap-2 animate-pulse mb-1">
              {data.streamingStatus}
            </span>
            <LoaderCircle className="animate-spin h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageAI;
