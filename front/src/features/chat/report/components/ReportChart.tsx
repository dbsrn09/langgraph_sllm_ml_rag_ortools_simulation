import { useEffect, useState } from "react";
import {  ChevronDown, Loader2, Sparkles } from "lucide-react";
import { useChatStore } from "../../../../store/chat.store";
import { useGetChart } from "../../../../services/chat/getChart";
import { useTranslation } from "react-i18next";
import Chart from "../../../../shared/components/ui/chart/Chart";


interface ReportChartProps {
    open: "chart" | "workspace" | "";
    setOpen: (val: "chart" | "workspace" | "") => void;
    pngRef: React.RefObject<HTMLDivElement | null>;
}
const ReportChart = ({ open, setOpen, pngRef }: ReportChartProps) => {

    const { t } = useTranslation();

    // const [tab, setTab] = useState<ChartType>("line");

    const [chartDataState, setChartDataState] = useState<any[]>([]);

    // const [chart, setChart] = useState<ChartData | null>(null);

    const { selectedChatId, isFetchingChart, getQueryResult } = useChatStore();

    const { data: chartData, isLoading } = useGetChart(selectedChatId);

    // const selectedTabclass = (t: ChartType) => {
    //     return `${t == tab ? "bg-white font-semibold text-gray-600" : "  "} border-r py-2 px-5 flex items-center gap-2 last:border-0 text-gray-400 hover:text-gray-900 transition-colors`
    // }

    // const onClickTabChart = (t: ChartType) => {

    //     if (!chartData?.result) return;

    //     if (t === "line" || t === "bar") {
    //         const baseChart = chartData.result.charts.find(c => c.chartType === "line" || c.chartType === "bar");

    //         if (baseChart) {
    //             setChart({
    //                 ...baseChart,
    //                 chartType: t
    //             });
    //         }

    //     } else {
    //         const baseChart = chartData.result.charts.find(c => c.chartType === "pie");

    //         if (baseChart) {
    //             setChart({
    //                 ...baseChart,
    //                 chartType: t
    //             });
    //         }
    //     }

    //     setTab(t);
    // };


    // const chartTypes = Array.from(
    //     new Set((chartData?.result?.charts ?? []).map((c: ChartData) => c.chartType))
    // );

    // if (chartTypes.includes("line") || chartTypes.includes("bar")) {
    //     if (!chartTypes.includes("line")) chartTypes.push("line");
    //     if (!chartTypes.includes("bar")) chartTypes.push("bar");
    // }
    // const order = ["line", "bar", "pie"];
    // const chartIcons = {
    //     line: ChartLine,
    //     bar: ChartColumn,
    //     pie: ChartPie
    // };

    useEffect(() => {

        if (selectedChatId && chartData?.result) {
            const data = getQueryResult(selectedChatId) ?? [];
            setChartDataState(data);
            // if (data.length > 1) {
            //     const baseChart = chartData.result.charts[0];
            //     setChart({
            //         ...baseChart,
            //         chartType: baseChart.chartType
            //     });
            //     setTab(baseChart.chartType as "line" | "bar" | "pie");
            // }

            // if (data.length == 1) {
        
            //     setChart(null);
            //     setTab("table" as "line" | "bar" | "pie");
            // }

        }

    }, [selectedChatId, chartData])




    return (

        <section className="bg-white border border-[#E6E6E6] rounded-xl overflow-hidden shadow-[0px_1px_2px_rgba(0,0,0,0.04)] w-full">

            <div
                onClick={() => setOpen(open == "chart" ? "" : "chart")}
                className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-[#F7F7F7] transition-colors select-none group"
            >
                <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-[#A0A0A0] group-hover:text-[#454545] transition-colors" />
                    <h2 className="text-base leading-6 font-semibold text-[#111111]">
                        {t("reportAgent.chart")}
                    </h2>
                </div>

                <ChevronDown
                    className={`w-6 h-6 text-[#B8B8B8] group-hover:text-[#7A7A7A] transition-all duration-300 ${open == "chart" ? "rotate-180" : ""
                        }`}
                />
            </div>


            <div
                className={`relative transition-all duration-500 overflow-hidden ${open == "chart" ? "max-h-[1500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
            >

                {(isLoading || selectedChatId === isFetchingChart) && (
                    <div className={`${chartData?.result ? "absolute inset-0 bg-black/10 bg-opacity-75 " : ""}flex flex-col items-center justify-center z-10`}>
                        <Loader2
                            size={30}
                            className="animate-spin text-orange-500 m-auto my-5"
                        />
                        <p className="text-sm text-gray-600 text-center">
                            {t("reportAgent.regenerate")}    {t("reportAgent.version.analysis")}
                        </p>
                    </div>
                )}


                {!isLoading && chartData?.result ?

                    <div className="border-t border-[#E6E6E6] p-8 bg-[#FAFAFA] ">

                        <div ref={pngRef} className="relative flex flex-col bg-[#F7F8FB] rounded-xl shadow-sm border border-[var(--neutral-border)] overflow-hidden transition-all duration-500 group h-full hover:shadow-md">
                           <Chart chartData={chartData?.result} data={chartDataState} />
                            {/* <div className="px-5 pt-5 pb-2">
                                <h3 className="font-semibold text-[#1A1D1F] text-base truncate leading-tight">{chartData?.result.title}</h3>
                                <p className="text-xs text-[var(--neutral-fg-subtle)] mt-1 truncate">{chartData?.result.subtitle}</p>
                            </div>
                            {chartData?.result.summaryCards && chartData.result.summaryCards.length > 0 && (
                                <div className="mx-2 pt-3"><Cards data={chartDataState} summaryCards={chartData.result.summaryCards} />
                                </div>
                            )}
                            {tab != "table" && chart && (<AIChart decision={chart} data={chartDataState} />)}
                            {tab == "table" && chartDataState.length > 0 && (

                                <TableResult data={chartDataState} statusChatTable={""} />)}

                            <div className="flex  border-t border-[var(--neutral-border)] text-sm mt-2">
                                <div className="flex border-t border-[var(--neutral-border)] text-sm">
                                    {chartTypes.length  > 1 && chartTypes.sort((a, b) => order.indexOf(a) - order.indexOf(b)).map((type) => {
                                        const Icon = chartIcons[type as keyof typeof chartIcons];

                                        return (
                                            <button
                                                key={type}
                                                className={selectedTabclass(type as "line" | "bar" | "pie")}
                                                onClick={() => onClickTabChart(type as "line" | "bar" | "pie")}
                                            >
                                                <Icon className="h-4 w-4" />
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </button>
                                        );
                                    })}
                                    <button
                                        key={"table"}
                                        className={selectedTabclass("table")}
                                        onClick={() => onClickTabChart("table")}
                                    >
                                        <Table className="h-4 w-4" />
                                        Table
                                    </button>
                                </div>

                            </div> */}

                        </div>

                    </div>
                    :

                    <p className="p-2 text-center"></p>

                }
            </div>



        </section>

    );
};

export default ReportChart;
