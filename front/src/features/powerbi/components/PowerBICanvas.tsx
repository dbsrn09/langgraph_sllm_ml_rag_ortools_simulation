import { PowerBIEmbed } from "powerbi-client-react";
import { useMemo } from "react";
import * as powerbi from "powerbi-client";
import { models } from "powerbi-client";

import { AlertTriangle } from "lucide-react";
import type { PowerBIEmbedResponse } from "../../../models/powerbi.model";
import { useChatStore } from "../../../store/chat.store";

interface PowerBICanvasProps {
    reportRef: React.RefObject<powerbi.Report | null>;
    powerBIEmbbed: PowerBIEmbedResponse;

}

const PowerBICanvas = ({
    reportRef,
    powerBIEmbbed
}: PowerBICanvasProps) => {

    const { setPowerBiSource } = useChatStore()

    const handleReportLoaded = async (report: any) => {

        report.off("loaded");
        report.off("rendered");

        report.on("loaded", () => {

            report.on("rendered", async () => {

                reportRef.current = report as powerbi.Report;

                const pages = await report.getPages();

                const activePage = pages.find((p: any) => p.isActive);

                if (!activePage) return;

                const visuals = await activePage.getVisuals();

                const exportableVisuals = visuals.filter((v: any) =>
                    typeof v.exportData === "function" &&
                    !v.type.toLowerCase().includes("slicer") &&
                    !v.type.toLowerCase().includes("image") &&
                    !v.type.toLowerCase().includes("textbox") &&
                    !v.type.toLowerCase().includes("button")
                );

                const results = await Promise.all(
                    exportableVisuals.map(async (visual: any) => {
                        try {

                            const data = await visual.exportData(
                                models.ExportDataType.Summarized
                            );

                            const csvData = data.data;

                            return {
                                title: visual.title,
                                visualType: visual.type,
                                data: csvData
                            };
                        } catch (err) {

                            return null;
                        }
                    })
                );

                const clean = results.filter(r => r !== null);
                const jsonString = JSON.stringify(clean);
                const base64String = btoa(unescape(encodeURIComponent(jsonString)));
                
                if(base64String)
                    setPowerBiSource({
                        powerBILoaded: true,
                        powerBISource: base64String
                    })

                // dispatch({
                //     type: "setPowerBISource", payload: {
                //         powerBILoaded: true,
                //         powerBISource: base64String
                //     }
                // });


            })
        });
    }

    const embedConfig = useMemo(() => ({
        type: "report",
        id: powerBIEmbbed.id,
        embedUrl: powerBIEmbbed.url,
        accessToken: powerBIEmbbed.token,
        tokenType: models.TokenType.Embed,
          permissions: models.Permissions.All, 
        settings: {
            layoutType: powerbi.models.LayoutType.Custom,
            customLayout: { displayOption: powerbi.models.DisplayOption.FitToWidth },
            panes: { filters: { visible: false }, pageNavigation: { visible: true } }
        }
    }), [
        powerBIEmbbed.id,
        powerBIEmbbed.url,
        powerBIEmbbed.token
    ]);

    return (


        <div className="relative overflow-hidden h-full">
            {powerBIEmbbed.success && powerBIEmbbed.isProcess ? (
                <PowerBIEmbed
                    embedConfig={embedConfig}
                    cssClassName="w-full  h-[94%]"
                    getEmbeddedComponent={handleReportLoaded}
                />
            ) : !powerBIEmbbed.success && powerBIEmbbed.isProcess ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-center text-gray-500">
                    <AlertTriangle className="w-8 h-8 mb-2 text-red-500" />
                    <span className="text-sm">Failed to load Power BI</span>
                </div>
            ) : (
                ""
            )}
        </div>

    );
};

export default PowerBICanvas;
