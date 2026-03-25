import { Building2 } from "lucide-react";
import type { EntityItemProps } from "../../../shared/types/EntityItem.types";


const CompanyItem = ({ onClickItem, id, name }: EntityItemProps) => {


    return (
        <div
            key={id}
            className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2"
            onClick={onClickItem}>

            <Building2 className="w-4 h-4 text-gray-500 shrink-0" />

            <span className="truncate ">{name}</span>

        </div>
    );
};


export default CompanyItem;
