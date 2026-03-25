import { useEffect, useState } from "react";
import { ChartColumn, ChartLine, ChartPie, Table } from "lucide-react";

import type { ChartData, ChartSource, ChartType } from "../../../../models/chat.model";
import Cards from "../../../../features/chat/report/components/chart/Cards";
import AIChart from "../../../../features/chat/report/components/chart/Echart";
import TableResult from "../../../../features/chat/messages/components/source/sql/TableResult";
import { useUIStore } from "../../../../store/ui.store";

interface ChartProps {
    chartData: ChartSource;
    data: any[];

}
const Chart = ({ chartData, data }: ChartProps) => {

    const [tab, setTab] = useState<ChartType>("line");

    const [chart, setChart] = useState<ChartData | null>(null);
    const { selectedTabAgent } = useUIStore()

    if (!chartData) return null

    const selectedTabclass = (t: ChartType) => {
        return `${t == tab ? "bg-white font-semibold text-gray-600" : "  "} border-r py-2 px-5 flex items-center gap-2 last:border-0 text-gray-400 hover:text-gray-900 transition-colors`
    }

    const onClickTabChart = (t: ChartType) => {

        if (!chartData) return;

        if (t === "line" || t === "bar") {
            const baseChart = chartData.charts.find(c => c.chartType === "line" || c.chartType === "bar");

            if (baseChart) {
                setChart({
                    ...baseChart,
                    chartType: t
                });
            }

        } else {
            const baseChart = chartData.charts.find(c => c.chartType === "pie");

            if (baseChart) {
                setChart({
                    ...baseChart,
                    chartType: t
                });
            }
        }

        setTab(t);
    };


    let  chartTypes = Array.from(
        new Set((chartData.charts ?? []).map((c: ChartData) => c.chartType))
    );

    if ((chartData.charts ?? []).length === 0) {
        chartTypes = ["bar", "line"];
    } else if (chartTypes.includes("line") || chartTypes.includes("bar")) {
        if (!chartTypes.includes("line")) chartTypes.push("line");
        if (!chartTypes.includes("bar")) chartTypes.push("bar");
    }
    const order = ["line", "bar", "pie"];

    const chartIcons = {
        line: ChartLine,
        bar: ChartColumn,
        pie: ChartPie
    };


    useEffect(() => {

        if (chartData.charts.length > 0 && data) {

            if (data.length > 1) {
                const baseChart = chartData.charts[0];
                setChart({
                    ...baseChart,
                    chartType: baseChart.chartType
                });
                setTab(baseChart.chartType as "line" | "bar" | "pie");
            }

            if (data.length == 1) {

                setChart(null);
                setTab("table" as "line" | "bar" | "pie");
            }

        }

    }, [chartData, data, selectedTabAgent])

    return (
        <>
            <div className="px-5 pt-5 pb-2">
                <h3 className="font-semibold text-[#1A1D1F] text-base truncate leading-tight">{chartData.title}</h3>
                <p className="text-xs text-[var(--neutral-fg-subtle)] mt-1 truncate">{chartData.subtitle}</p>
            </div>
            {chartData.summaryCards && chartData.summaryCards.length > 0 && (
                <div className="mx-2 pt-3"><Cards data={data} summaryCards={chartData.summaryCards} />
                </div>
            )}
            {tab != "table" && chart && (<AIChart decision={chart} data={data} />)}
            {tab == "table" && data.length > 0 && (

                <TableResult data={data} statusChatTable={""} />)}

            <div className="flex  border-t border-[var(--neutral-border)] text-sm mt-2">
                <div className="flex border-t border-[var(--neutral-border)] text-sm">
                    {chartTypes.length > 1 && chartTypes.sort((a, b) => order.indexOf(a) - order.indexOf(b)).map((type) => {
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

            </div>

        </>



    );
};

export default Chart;
