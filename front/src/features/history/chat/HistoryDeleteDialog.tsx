import { LoaderCircle } from "lucide-react";
import { Dialog } from "../../../shared/components/ui/Dialog";



interface HistoryDeleteProps {
    isLoadingDeletete: boolean;
    onShow: boolean;
    onDelete: () => void;
    onCancel: () => void;
}

const HistoryDeleteDialog = ({ isLoadingDeletete, onShow, onDelete, onCancel }: HistoryDeleteProps) => {

    if (!onShow) return;

    return (
        <Dialog>
            <div className=" w-full max-w-[240px] text-center">
                <h3 className="font-semibold text-gray-900 mb-1 text-[16px] leading-[24px]">Delete Chat</h3>
                <p className="text-[12px] text-gray-500 mb-4 leading-[16px]">Are you sure you want to delete this chat?</p>


                {isLoadingDeletete
                    ?
                      <LoaderCircle className="animate-spin h-4 w-4 m-auto" />
                    :
                    <div className="flex gap-2 justify-center">

                        <button onClick={onCancel} className="px-3 py-1.5 text-[12px] font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                        <button onClick={onDelete} className="px-3 py-1.5 text-[12px] font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">Delete</button>
                 
                    </div>

                }
            </div>
        
      </Dialog>

    );

}

export default HistoryDeleteDialog;
