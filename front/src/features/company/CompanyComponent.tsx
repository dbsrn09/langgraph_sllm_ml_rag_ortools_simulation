import { useState, useRef, useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { CompanyList } from "../../models/company.model";
import CompanyItem from "./components/CompanyItem";
import SelectableItem from "../../shared/components/SelectableItem";
import { useAgentStore } from "../../store/agent.store";
import { isLangGraphLocal } from "../../langgraph/localMode";

interface CompanyComponentProps {
    data: CompanyList[];
    isFetchingCompany: boolean;

}

const CompanyComponent = ({  data, isFetchingCompany }: CompanyComponentProps) => {

    const { resetAgentBranch, setCompany, selectedCompany ,setWorkspace } = useAgentStore();

    const [open, setOpen] = useState(false);

    const ref = useRef<HTMLDivElement>(null);

    const toggle = () => {

        if (data.filter((sel: CompanyList) => sel.companyId != selectedCompany.companyId).length === 0) return;

        setOpen((v) => !v);

    };

    const onClickCompany = (cl: CompanyList) => {


        resetAgentBranch();

        setOpen(false);

        setCompany({
            companyId: cl.companyId,
            companyName: cl.companyName
        });



    }
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

        if (data.length > 0) {
            if (isLangGraphLocal()) {
                setCompany({
                    companyId: data[0].companyId,
                    companyName: data[0].companyName,
                });
                return;
            }
            setWorkspace({
                workspaceId: ""
            })
            resetAgentBranch()
            setCompany({
                companyId: data?.[0]?.companyId,
                companyName: data?.[0]?.companyName
            });

        }

    }, [isFetchingCompany]);

    if (isFetchingCompany)
        return (
            <LoaderCircle className="animate-spin" />
        );

    return (
        <div className="relative inline-block truncate" ref={ref}>

            <SelectableItem toggle={toggle} selected={selectedCompany.companyName} cls={"font-semibold text-lg text-[var(--neutral-ink)] tracking-tight truncate group-hover:text-black leading-6"} />

            <AnimatePresence>

                {open && (

                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="fixed mt-5 w-55 writing-mode: horizontal-tb;
                                rounded-md border border-gray-200 bg-white shadow-lg z-50 text-sm font-medium"
                        style={{ writingMode: "horizontal-tb" }}
                    >
                        {data.filter((sel: CompanyList) => sel.companyId != selectedCompany.companyId).map((cl: CompanyList) => (

                            <CompanyItem
                                onClickItem={() => onClickCompany(cl)}
                                id={cl.companyId}
                                name={cl.companyName}
                                key={cl.companyId}
                            />
                        ))}

                    </motion.div>

                )}

            </AnimatePresence>

        </div>
    );
};

export default CompanyComponent;
