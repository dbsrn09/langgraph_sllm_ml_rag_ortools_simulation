
import type { ChatConversation } from "../../../../models/chat.model";
import SqlSource from "./source/SqlSource";
import RagSource from "./source/RagSource";

interface MessageSourceProps {
    companyId: string;
    data: ChatConversation;
}

const MessageSource = ({ companyId, data }: MessageSourceProps) => {





    return (
        <div className="mt-6 w-full  overflow-hidden pl-8">

            {data.query && ( <SqlSource companyId={companyId} data={data} /> )} 
            {data.ragSource && ( <RagSource ragSource={data.ragReference ?? []} /> )}
        </div>
    );
};

export default MessageSource;
