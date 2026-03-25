import { Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";



interface HistoryEditProps {
    onClickRename: () => void;
    onClickDelete: () => void;

}

const HistoryEdit = ({ onClickRename, onClickDelete }: HistoryEditProps) => {
 const { t } = useTranslation();

    return (
        <div className=" fixed mt-1 w-35 bg-white  rounded-lg shadow-md z-150 p-1 z-50">
            <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm flex items-center gap-2 text-gray-700 rounded "
                onClick={onClickRename}
            >
              <Pencil size={13}/>  {t("chatNav.rename")}
            </button>

            <button
                className="w-full text-left px-3 py-2 hover:bg-red-100 text-sm text-red-500 flex items-center gap-2 rounded "
                onClick={onClickDelete}
            >
              <Trash2 size={13} />  {t("chatNav.delete")}
            </button>
        </div>
    );
}

export default HistoryEdit;
