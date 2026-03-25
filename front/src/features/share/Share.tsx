import { useParams } from "react-router-dom";
import { getShareReport } from "../../services/reportAgent/getShareReport";
import Chart from "../../shared/components/ui/chart/Chart";

const Share = () => {
  const { id } = useParams();

  const { data: chartData, isLoading } = getShareReport(id ?? "");

  if (isLoading) {
    return (
      <section className="flex items-center justify-center h-screen bg-white">
        <p className="text-gray-400 text-sm animate-pulse">
          Loading chart...
        </p>
      </section>
    );
  }

  if (!chartData?.success) {
    return (
      <section className="flex items-center justify-center h-screen bg-[#F7F8FB]">
        <div className="text-center border border-gray-200 bg-white rounded-xl p-8 shadow-sm max-w-md">
          <h1 className="text-lg font-semibold text-gray-800">
            Chart not found
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            The shared report may have expired or the link is invalid.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white overflow-hidden w-full min-h-screen p-3">
      <div className="border-[#E6E6E6] p-3">
        <div className="relative flex flex-col bg-[#F7F8FB] rounded-xl shadow-sm border border-[var(--neutral-border)] overflow-hidden transition-all duration-500 group h-full hover:shadow-md">
          <Chart
            chartData={chartData?.result.chart}
            data={chartData?.result.data}
          />
        </div>
      </div>
    </section>
  );
};

export default Share;
