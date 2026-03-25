import { Download, Image, Table } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import { useChatStore } from "../../../../../store/chat.store";
import { useTranslation } from "react-i18next";
import * as htmlToImage from "html-to-image";


interface ExportButtonProps {
    pngRef: React.RefObject<HTMLDivElement | null>;
}
const ExportButton = ({ pngRef }: ExportButtonProps) => {
    const { t } = useTranslation();
    const [showExport, setShowExport] = useState(false);

    const exportRef = useRef<HTMLDivElement>(null);

    const { getChat } = useChatStore();



    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {

            if (
                exportRef.current &&
                !exportRef.current.contains(event.target as Node)
            ) {
                setShowExport(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);

    const exportData = () => {

        if (!getChat()?.queryResult) return;

        const item = getChat()?.queryResult

        if (item && item.length > 0) {
            const now = new Date();
            const pad = (n: number) => n.toString().padStart(2, "0");

            const year = now.getFullYear();
            const month = pad(now.getMonth() + 1);
            const day = pad(now.getDate());
            const hours = pad(now.getHours());
            const minutes = pad(now.getMinutes());
            const seconds = pad(now.getSeconds());


            const filename = `${year}${month}${day}${hours}${minutes}${seconds}`;

            const worksheet = XLSX.utils.json_to_sheet(item);
            const range = XLSX.utils.decode_range(worksheet["!ref"] || "");

            const headerRow = range.s.r;
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c: C });
                const cell = worksheet[cellAddress];
                if (!cell) continue;

                cell.s = {
                    font: { bold: true, color: { rgb: "000000" } },
                    fill: { fgColor: { rgb: "F2F2F2" } },
                    border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } },
                    },
                    alignment: { horizontal: "center", vertical: "center" },
                };
            }

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

            const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
            saveAs(blob, filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`);
        }

    }
    const exportPng = async () => {

        setShowExport(false)
        if(!pngRef)return
        if (!pngRef.current) return;

        try {
            const dataUrl = await htmlToImage.toPng(pngRef.current);

            const link = document.createElement("a");
            link.download = "export.png";
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error("Export failed:", error);
        }
    };
    return (


        <div
            ref={exportRef}
            className="relative flex"
        >

            <button onClick={() => setShowExport(!showExport)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors border shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--state-focus)] bg-[#121316] text-white border-[#121316] hover:bg-[#2C2E33]">
                <Download className="w-5 h-5 text-white" />
                {t("reportAgent.export")}
            </button>

            {showExport && (
                <div className="absolute right-0 top-full mt-2 w-44 rounded-lg border bg-white shadow-lg z-50  p-1 animate-in fade-in zoom-in-95">
                    <button
                        onClick={exportPng}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                    >
                        <Image className="w-4 h-4" />
                        {t("reportAgent.exportPNG")}
                    </button>

                    <button
                        onClick={() => {
                            exportData()
                            setShowExport(false)
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                    >
                        <Table className="w-4 h-4" />
                        {t("reportAgent.exportCSV")}
                    </button>
                </div>
            )}
        </div>


    );
};

export default ExportButton;
