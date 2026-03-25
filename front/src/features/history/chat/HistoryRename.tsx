import { Check, Loader2 } from "lucide-react";


interface HistoryRenameProps {
    statusUpdate:boolean;
    draftName: string
    setDraftName: (val: string) => void
    onUpdateLabel:()=>void;
}

const HistoryRename = ({ draftName, setDraftName ,onUpdateLabel,statusUpdate}: HistoryRenameProps) => {


    return (
        <div className="w-full flex  items-center">
            <input
                className="bg-transparent outline-none border-none focus:outline-none focus:ring-0 w-full px-1 py-[2px]"
                autoFocus
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {

                    }
                    if (e.key === "Escape") {
                  
                    }
                }}

            />

            {statusUpdate ?   <Loader2 size={15} className="animate-spin text-gray-400" />
                :       
               <Check size={15} className="flex items-center text-green-500" onClick={onUpdateLabel} />}
   
        </div>
    );
}

export default HistoryRename;
