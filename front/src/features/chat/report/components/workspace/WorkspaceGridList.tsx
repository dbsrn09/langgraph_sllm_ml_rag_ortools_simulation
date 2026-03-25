import { useMemo, useState } from "react";
import type { ReportAgentList } from "../../../../../models/reportagent.model";
import WorkspaceRemove from "./WorkspaceRemove";
import ModeGrid from "./mode/ModeGrid";
import ModeList from "./mode/ModeList";
import type { ChartSource } from "../../../../../models/chat.model";

interface WorkspaceGridListProps {
    data: ReportAgentList[];
    mode: "grid" | "list";
    search: string;
}

const WorkspaceGridList = ({ data, mode = "list", search }: WorkspaceGridListProps) => {

    const [openRemove, setOpenRemove] = useState<string | null>(null);

    const filteredData = useMemo(() => {

        const parsedData = data.map(chart => ({
            ...chart,
            parsed: JSON.parse(chart.chart) as ChartSource,
            data: JSON.parse(chart.source)
        }));

        if (!search.trim()) return parsedData;

        return parsedData.filter(chart =>
            chart.parsed?.title
                ?.toLowerCase()
                .includes(search.toLowerCase())
        );

    }, [data, search]);

    const wrap =  mode == "grid" ? "grid grid-cols-12 gap-8 " : " bg-white rounded-xl border border-[#E6E6E6]  divide-y divide-[#F1F1F1] shadow-sm"
  
    return (

        <div className={wrap}>

            {filteredData.map((chart, index) => (

                <div key={index}
                    className={`${mode == "grid" ? " col-span-12 lg:col-span-12 list border border-[var(--neutral-border)] shadow-md" : ""}
                        relative flex flex-col  rounded-xl 
                         group h-full `}
                >
                    <WorkspaceRemove
                        removeId={chart.id}
                        openRemove={openRemove || ""}
                        setOpenRemove={setOpenRemove}
                        mode={mode}
                    />

                    {mode == "list" && (
                 
                        <ModeList
                            title={chart.parsed.title}
                            subtitle={chart.parsed.subtitle}
                            createAt={chart.createAt}
                       
                        />
                       
                    )}

                    {mode == "grid" && (

                        <ModeGrid
                            chart={chart.parsed}
                            data={chart.data}
                        />

                    )}

                </div>

            ))}

        </div>

    );
};

export default WorkspaceGridList;
