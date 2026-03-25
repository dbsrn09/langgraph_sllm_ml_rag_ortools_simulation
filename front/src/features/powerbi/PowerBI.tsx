import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import * as powerbi from "powerbi-client";
import { usePowerBiEmbed } from "../../services/powerbi/getPowerBiEmbed";
import type { PowerBIEmbedRequest, PowerBIEmbedResponse } from "../../models/powerbi.model";
import { useChatStore } from "../../store/chat.store";
import { useAgentStore } from "../../store/agent.store";
import PowerBILoading from "./components/PowerBILoading";
import PowerBIHeader from "./components/PowerBIHeader";
import PowerBICanvas from "./components/PowerBICanvas";


interface PowerBIProps {
    tab: "chat" | "report"
    setTab: (val: "chat" | "report") => void;
    children?: React.ReactNode;
}

const PowerBI = ({ tab, setTab, children }: PowerBIProps) => {

    const reportRef = useRef<powerbi.Report>(null);

    const { mutate: getEmbed, status } = usePowerBiEmbed();


    const [powerBIReport, setPowerBIReport] = useState<PowerBIEmbedResponse>({
        url: "",
        token: "",
        id: "",
        success: false,
        isProcess: false
    });

    const { setPowerBiSource } = useChatStore()

    const isLoading = status === "pending";

    const selectedAgent = useAgentStore((s) => s.selectedAgent);

    const getPowerBIEmbed = async () => {

        if (!selectedAgent.powerBi) {
            toast.error("Failed load Power BI", {
                description: "power bi param invalid",
            });
            return;
        }
        const param: PowerBIEmbedRequest = {
            tenantID: selectedAgent.powerBi?.tenantID,
            clientID: selectedAgent.powerBi?.clientID,
            clientSecret: selectedAgent.powerBi?.clientSecret,
            workspaceID: selectedAgent.powerBi?.workspaceID,
            reportID: selectedAgent.powerBi?.reportID,
            pageID: selectedAgent.powerBi?.pageID
        }

        getEmbed(param, {
            onSuccess: (res) => {
                setPowerBIReport({ ...res.result, success: res.success, isProcess: true })

            },
            onError: () => {
                setPowerBIReport({ ...powerBIReport, success: false, isProcess: true })

            },
        });



    }

    const cleanPowerBIEmbed = () => {

        setPowerBiSource({
            powerBILoaded: false,
            powerBISource: ""
        })

        if (!reportRef.current) return;


        try {
            reportRef.current.off("loaded");
            reportRef.current.off("error");
            reportRef.current.off("rendered");
        } catch { }

        const element = reportRef.current.element;

        if (element) {

            if (window.powerbi && typeof window.powerbi.reset === "function") {
                window.powerbi.reset(element);
            }

            element.innerHTML = "";
        }


        reportRef.current = null;
    };

    useEffect(() => {

        cleanPowerBIEmbed()

        if (selectedAgent.agentType == "powerbi" && selectedAgent.powerBi)
            getPowerBIEmbed()

    }, [selectedAgent.powerBi]);

    if (isLoading)
        return (
            <PowerBILoading />
        );

    return (

        <>

            {powerBIReport.success && <PowerBIHeader tab={tab} onChangeTab={(v) => setTab(v)} />}

            <div className="flex flex-1 overflow-hidden ">
                <div className={`flex-1 min-w-0 transition-transform duration-300 ease-in-out
                                ${tab === "chat" ? "-translate-x-2" : "translate-x-0"}
                                `}>

                    <PowerBICanvas reportRef={reportRef} powerBIEmbbed={powerBIReport} />

                </div>

                {children}

            </div>

        </>

    );
};

export default PowerBI;
