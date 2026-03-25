import ReactECharts from "echarts-for-react";
import type { ChartData } from "../../../../../models/chat.model";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  decision: ChartData;
  data: any[];
}

const PAGE_SIZE = 50;

const AIChart = ({ decision, data }: Props) => {
  const { t } = useTranslation();
  const { chartType, xField, yFields, isTimeSeries } = decision;
  if ((!yFields || yFields.length === 0) || (!data || data.length === 0)) {
    return (
      <div style={{ height: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {t("reportAgent.failedChart")}
      </div>
    );
  }
  const groupingFields: string[] =
    (decision as any).groupFields ||
    (decision.groupField ? [decision.groupField] : []);

  const [page] = useState(0);
  const [showAll] = useState(true);

  const pagedData = useMemo(() => {
    if (showAll) return data;
    const start = page * PAGE_SIZE;
    return data.slice(start, start + PAGE_SIZE);
  }, [data, page, showAll]);

  const isSingleRow = pagedData.length === 1;

  const formatValue = (value: number) => {
    if (value == null) return "";
    return value.toLocaleString()
    // return valueType === "percentage"
    //   ? `${value.toFixed(2)}%`
    //   : value.toLocaleString();
  };


  const aggregatedData = useMemo(() => {
    if (!groupingFields.length) return pagedData;

    const map: Record<string, any> = {};

    pagedData.forEach((row) => {
      const xVal = row[xField];

      const groupKey = groupingFields.map((field) => row[field]).join(" | ");
      const compositeKey = `${xVal}__${groupKey}`;

      if (!map[compositeKey]) {
        map[compositeKey] = {
          [xField]: xVal,
          groupKey,
          values: {},
        };

        yFields.forEach((y) => {
          map[compositeKey].values[y] = 0;
        });
      }

      yFields.forEach((y) => {
        map[compositeKey].values[y] += row[y] ?? 0;
      });
    });

    return Object.values(map);
  }, [pagedData, groupingFields, xField, yFields]);

  if (isSingleRow) {
    return (
      <div
        style={{
          height: 400,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid #eee",
          borderRadius: 12,
          color: "#666",
          fontSize: 14,
        }}
      >
        Not enough data to generate a chart. Please view the table instead.
      </div>
    );
  }

  const enableZoom = pagedData.length > 50;

  const colors = [
    "#e96f16",
    "#1f2937",
    "#155dfc",
    "#16a34a",
    "#dc2626",
    "#9333ea",
    "#0891b2",
    "#ca8a04",
    "#be123c",
    "#0f766e",
  ];

  const useSingleAxis = useMemo(() => {
    if (yFields.length <= 1) return true;

    const ranges = yFields.map((field) => {
      const values = pagedData.map((row) => Number(row[field]) || 0);
      return {
        min: Math.min(...values),
        max: Math.max(...values),
      };
    });

    const first = ranges[0];

    return ranges.every((r) => {
      const ratio = r.max / (first.max || 1);
      return ratio > 0.5 && ratio < 2; // similar scale
    });
  }, [pagedData, yFields]);

  const formatValueyAxis = (value: number) => {
    if (value == null) return "";

    const abs = Math.abs(value);

    if (abs >= 1_000_000_000)
      return (value / 1_000_000_000).toFixed(1) + "B";
    if (abs >= 1_000_000)
      return (value / 1_000_000).toFixed(1) + "M";
    if (abs >= 1_000)
      return (value / 1_000).toFixed(1) + "K";

    return value.toLocaleString();
  };

  const yAxisConfig = useSingleAxis
    ? {
      type: "value",
      axisLabel: {
        formatter: (value: number) => formatValueyAxis(value),
      },
    }
    : yFields.map((_, index) => ({
      type: "value",
      position: index % 2 === 0 ? "left" : "right",
      offset: index > 1 ? (index - 1) * 60 : 0,
      axisLabel: {
        formatter: (value: number) => formatValueyAxis(value),
      },
    }));

  let option: any = {};

  if (chartType === "pie") {
    const metric = yFields[0];
    const pieMap: Record<string, number> = {};

    pagedData.forEach((row) => {
      const key = row[xField];
      const value = Number(row[metric]) || 0;
      pieMap[key] = (pieMap[key] || 0) + value;
    });

    const pieData = Object.entries(pieMap).map(([name, value]) => ({
      name,
      value,
    }));

    option = {
      color: colors,
      tooltip: {
        trigger: "item",
        valueFormatter: formatValue,
      },
      legend: {
        top: 10,
        type: "scroll",
      },
      series: [
        {
          name: metric,
          type: "pie",
          radius: "50%",
          data: pieData,
        },
      ],
    };
  } else {
    let series: any[] = [];


    if (!groupingFields.length) {
      series = yFields.map((field, index) => ({
        name: field,
        type: chartType,
        yAxisIndex: useSingleAxis ? 0 : index,
        data: pagedData.map((row) =>
          isTimeSeries
            ? [row[xField], Number(row[field])]
            : Number(row[field])
        ),
      }));

    }


    else {
      const grouped: Record<string, any[]> = {};

      aggregatedData.forEach((row: any) => {
        if (!grouped[row.groupKey]) grouped[row.groupKey] = [];
        grouped[row.groupKey].push(row);
      });

      series = Object.keys(grouped).map((groupName, index) => ({
        name: groupName,
        type: chartType,
        yAxisIndex: index % yFields.length,
        data: grouped[groupName].map((row: any) =>
          isTimeSeries
            ? [row[xField], row.values[yFields[0]]]
            : row.values[yFields[0]]
        ),
      }));
    }

    option = {
      color: colors,
      tooltip: {
        trigger: "axis",
        valueFormatter: formatValue,
      },
      legend: {
        type: "scroll",
        top: 10,
      },
      grid: {
        top: 60,
        left: 50,
        right: 80,
        bottom: enableZoom ? 80 : 40,
      },
      xAxis: {
        type: isTimeSeries ? "time" : "category",
        data: isTimeSeries ? undefined : pagedData.map((row) => row[xField]),
      },

      yAxis: yAxisConfig,
      series,
    };
  }

  if (enableZoom && chartType !== "pie") {
    option = {
      ...option,
      dataZoom: [
        {
          type: "slider",
          xAxisIndex: 0,
          start: 0,
          end: 30,
        },
        {
          type: "inside",
          xAxisIndex: 0,
        },
      ],
    };
  }

  return (
    <div className="px-2">
      <ReactECharts
        option={option}
        notMerge={true}
        lazyUpdate={false}
        style={{ height: 400 }}
      />
    </div>
  );
};

export default AIChart;
