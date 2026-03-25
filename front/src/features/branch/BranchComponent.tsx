import { useEffect, useRef, useState } from "react";
import type { BranchList } from "../../models/branch.model";
import { AnimatePresence, motion } from "framer-motion";
import SelectableItem from "../../shared/components/SelectableItem";
import { useAgentStore } from "../../store/agent.store";
import { isLangGraphLocal } from "../../langgraph/localMode";

interface BranchSelectorProps {

    data: BranchList[];

}

const BranchComponent = ({data }: BranchSelectorProps) => {


    const { selectedBranch, selectedCompany, setBranch, resetAgent } = useAgentStore();

    const [open, setOpen] = useState(false);

    const ref = useRef<HTMLDivElement>(null);

    const getBranchId = selectedBranch.branchId;

    const toggle = () => {

        if (data.filter((sel: BranchList) => sel.branchId != getBranchId).length === 0) return;

        setOpen((v) => !v);

    };

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {

                setOpen(false);
     
            }
        };

        document.addEventListener("mousedown", handler);

        return () => document.removeEventListener("mousedown", handler);

    }, []);

    useEffect(() => {

        if (isLangGraphLocal()) {
            if (data.length > 0) {
                setBranch({
                    ...selectedBranch,
                    branchName: data[0].branchName,
                    branchId: data[0].branchId,
                    botName: data[0].dataAgentBotName ?? "",
                    welcomePrompt: data[0].dataAgentWelcomeprompt ?? "",
                });
            }
            return;
        }

        resetAgent()

        if (data.length > 0) {

            setBranch({
                ...selectedBranch,
                branchName:data[0].branchName,
                branchId: data[0].branchId,
                botName: data[0].dataAgentBotName ?? "",
                welcomePrompt: data[0].dataAgentWelcomeprompt ?? ""
            });

        } else {

            setBranch({
                ...selectedBranch,
                branchId: "",
                botName: "",
                welcomePrompt: ""
            });

 
        }

    }, [selectedCompany.companyId])

    return (

        <div className="relative inline-block" ref={ref}>
            
            <SelectableItem toggle={toggle} selected={selectedBranch?.branchName ?? ""} cls={"text-white"} />

            <AnimatePresence>

                {open && getBranchId && (

                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="fixed bottom-20 w-55
                                rounded-md border border-gray-200 bg-white shadow-lg z-50 text-sm font-medium"
                        style={{ writingMode: "horizontal-tb" }}>

                        {data.length > 0 && data
                            .filter((sel: BranchList) => sel.branchId != getBranchId)
                            .map((cl: BranchList) => (

                                <div
                                    key={cl.branchId}
                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2 text-sm text-[#347298] "
                                    onClick={() => {

                                        resetAgent()

                                        setOpen(false);
                                    
                                        setBranch({
                                            ...selectedBranch,
                                            branchId: cl.branchId,
                                            botName: cl.dataAgentBotName ?? "",
                                            welcomePrompt: cl.dataAgentWelcomeprompt ?? ""
                                        });

                                    }}>

                                    <span className="truncate">{cl.branchName}</span>

                                </div>
                            ))}

                    </motion.div>

                )}

            </AnimatePresence>

        </div>

    )
}
export default BranchComponent;


