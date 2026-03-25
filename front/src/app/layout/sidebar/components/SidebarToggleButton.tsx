import {  PanelLeftOpen, PanelRightOpen } from "lucide-react";

interface SidebarToggleButtonProps {
    expandSideBar: boolean;
    setExpandSideBar: (val: boolean) => void;

}


const SidebarToggleButton = ({ expandSideBar, setExpandSideBar }: SidebarToggleButtonProps) => {


    return (


        <div className={`${expandSideBar ? "  items-center gap-3" : "h-full w-full items-center justify-center"} flex ml-auto`}>
            {/* 
                    <Ellipsis size={18} className="text-[#347298]" onClick={() => dispatch({ type: "showMenu", payload: true })} /> */}

            {expandSideBar ? (
                <PanelRightOpen
                    size={18}
                    className="text-[#6c737f] cursor-pointer"
                    onClick={() => setExpandSideBar(false)
                    }
                />
            ) : (
                <PanelLeftOpen
                    size={18}
                    className="text-[#6c737f] cursor-pointer"
                    onClick={() => setExpandSideBar(true)}
                />
            )}

        </div>
    );
};


export default SidebarToggleButton;
