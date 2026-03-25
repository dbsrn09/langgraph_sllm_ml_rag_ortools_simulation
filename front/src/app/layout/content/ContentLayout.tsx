import { useGetBranchLogo } from "../../../services/branch/getLogo";
import { useAgentStore } from "../../../store/agent.store";
import PowerBILayout from "./components/PowerBI";
import Text2sqlLayout from "./components/Text2sql";

const getMimeType = (base64?: string) => {
    if (!base64) return "image/jpeg";
    if (base64.startsWith("/9j/")) return "image/jpeg";
    if (base64.startsWith("iVBOR")) return "image/png";
    if (base64.startsWith("R0lGOD")) return "image/gif";
    if (base64.startsWith("UklGR")) return "image/webp";
    return "image/jpeg";
};

const ContentLayout = () => {
    const { selectedAgent, selectedBranch } = useAgentStore();
    const branchId = selectedBranch?.branchId;

    const { data: logo } = useGetBranchLogo(branchId ?? "");

    const bgImg = logo?.result?.bgImg;
    
    const mime = getMimeType(bgImg);

    return (
        <>

            {!selectedAgent.agentType && (<div className="relative w-full h-screen">

                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(data:${mime};base64,${bgImg})`,
                    }}
                />
            </div>)}

            <Text2sqlLayout />
            <PowerBILayout />
        </>
    );



};

export default ContentLayout;
