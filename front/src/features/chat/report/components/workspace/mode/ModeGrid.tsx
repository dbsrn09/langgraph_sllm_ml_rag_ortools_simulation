import type { ChartSource } from "../../../../../../models/chat.model";
import Chart from "../../../../../../shared/components/ui/chart/Chart";



interface ModeGridProps {
    chart: ChartSource;
    data: any[];



}
const ModeGrid = ({ chart,data}: ModeGridProps) => {
  
    return (
        <div className="relative flex flex-col bg-[#F7F8FB] rounded-xl shadow-sm border border-[var(--neutral-border)] overflow-hidden transition-all duration-500 group h-full   shadow-md scale-[1.01]">
      
            <Chart chartData={chart} data={data} />
    

        </div>
    )
}

export default ModeGrid;
