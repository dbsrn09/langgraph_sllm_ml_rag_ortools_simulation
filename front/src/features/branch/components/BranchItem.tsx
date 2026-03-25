import type { EntityItemProps } from "../../../shared/types/EntityItem.types";

const BranchItem = ({ onClickItem, id, name }: EntityItemProps) => {


    return (
        <div
            key={id}
            className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2 text-sm text-[#347298] "
            onClick={onClickItem}>

            <span className="truncate">{name}</span>

        </div>
    );
};


export default BranchItem;
