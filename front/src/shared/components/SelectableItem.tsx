

interface SelectableItemProps {
    toggle: () => void;
    selected: string;
    cls: string;
}

const SelectableItem = ({ toggle, selected, cls ="text-white" }: SelectableItemProps   ) => {


    return (
     
            <div
                onClick={toggle}
                className={`${cls} cursor-pointer font-medium  truncate `}
                title={selected}
            >
                {selected}

            </div>
    );
};


export default SelectableItem;
