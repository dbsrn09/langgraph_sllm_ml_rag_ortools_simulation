import { useEffect, useRef, useState } from "react";
import ReportChart from "./components/ReportChart";
import ReportHeader from "./components/ReportHeader";
import ReportWorkspace from "./components/ReportWorkspace";
import { useUIStore } from "../../../store/ui.store";
import ReportVersionHist from "./components/ReportVersionHist";
import { useGetReportVerList } from "../../../services/reportAgent/getReportVerList";
import { useChatStore } from "../../../store/chat.store";
import ReportShare from "./components/ReportShare";

interface ReportAgentComponentProps {
    tab: string;
}

const ChatReport = ({ tab }: ReportAgentComponentProps) => {

    const [open, setOpen] = useState<"chart" | "workspace" | "">("");
    const [showVersion, setShowVersion] = useState<boolean>(false);
    const [showShare, setShowShare] = useState<boolean>(false);
    const { selectedTabAgent } = useUIStore();
    const { selectedChatId } = useChatStore();
    const versionRef = useRef<HTMLDivElement | null>(null);
    const pngRef = useRef<HTMLDivElement | null>(null);
    const { data:versionList, isLoading } = useGetReportVerList(selectedChatId);

    useEffect(() => {
        setOpen("chart");
    }, [selectedTabAgent]);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                showVersion &&
                versionRef.current &&
                !versionRef.current.contains(event.target as Node)
            ) {
                setShowVersion(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showVersion]);



    return (
        <div
            className={`${tab != "report" ? "hidden" : ""} flex-1 flex flex-col bg-[#F7F8FA] min-h-0 w-full h-full relative font-sans`}
        >
            <ReportHeader 
            totalVer={versionList?.result?.length || 0}
            setShowShare ={()=>setShowShare(!showShare)}
            setShowVersion={() => setShowVersion(!showVersion)}
            pngRef={pngRef}

            />

            <div className="flex-1 overflow-y-auto p-8 pt-6 custom-scrollbar scroll-smooth z-5">
                <div className="w-full pb-20 space-y-8">
                    <ReportChart open={open} setOpen={setOpen} pngRef={pngRef} />
                    <ReportWorkspace open={open} setOpen={setOpen}   />
                </div>
            </div>

            {showVersion && (
                <div ref={versionRef}>
                    <ReportVersionHist 
                        data={versionList?.result || []}
                        isFetching={isLoading} onClose={() => setShowVersion(false)}/>
                </div>
            )}
            
            {showShare && (
                <ReportShare   
                  setShowShare ={()=>setShowShare(!showShare)} />
            )}
   
        </div>
    );
};

export default ChatReport;
