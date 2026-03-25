import { FileText } from "lucide-react";
import { formatDate } from "../../../../../../shared/components/FormatDate";

interface ModeListProps {
    title: string;
    subtitle: string;
    createAt: string;
  
}

const ModeList = ({ title, subtitle, createAt }: ModeListProps) => {



    return (


            <div className="flex items-center px-6 py-4 hover:bg-[#F8F8F8] group transition-colors relative z-1">
                <div className="w-10 h-10 rounded-lg bg-[#F5F5F5] flex items-center justify-center text-[#A0A0A0] mr-6 shrink-0 border border-[#EAEAEA]">
                    <FileText className=" w-5 h-5 text-inherit" />
                </div>
                <div className="flex-1 min-w-0 mr-8">
                    <h3 className="text-sm font-semibold text-[#1F1F1F] truncate">
                        {title}
                    </h3>
                    <p className="text-xs text-[#999999] truncate">
                        {subtitle}
                    </p>
                </div>
                <div className="mr-6 text-xs text-[#999999]">{formatDate(createAt)}</div>
            </div>

    )
}

export default ModeList;
