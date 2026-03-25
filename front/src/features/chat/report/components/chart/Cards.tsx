import { useMemo } from "react";

type SummaryCardType = "total" | "average" | "max" | "min";

interface SummaryCardConfig {
  type: SummaryCardType;
  label: string;
  field: string;
  dimension?: string;
}

interface SummaryCardResult extends SummaryCardConfig {
  value: number;
  labelValue?: string | number;
}

interface ReportChartProps {
  data: any[];
  summaryCards: SummaryCardConfig[];
}

 function calculateSummaryCards<T extends Record<string, any>>(
  rows: T[],
  configs: SummaryCardConfig[]
): SummaryCardResult[] {
  return configs
    .map((card) => {
      const values = rows
        .map((r) => Number(r[card.field]))
        .filter((v) => !isNaN(v));

      if (!values.length) return null;

      if (card.type === "total") {
        const value = values.reduce((a, b) => a + b, 0);
        return { ...card, value };
      }

      if (card.type === "average") {
        const total = values.reduce((a, b) => a + b, 0);
        return { ...card, value: total / values.length };
      }

      if (card.type === "max") {
        const value = Math.max(...values);
        const row = rows.find((r) => Number(r[card.field]) === value);

        return {
          ...card,
          value,
          labelValue: card.dimension ? row?.[card.dimension] : undefined
        };
      }

      if (card.type === "min") {
        const value = Math.min(...values);
        const row = rows.find((r) => Number(r[card.field]) === value);

        return {
          ...card,
          value,
          labelValue: card.dimension ? row?.[card.dimension] : undefined
        };
      }

      return null;
    })
    .filter((c): c is SummaryCardResult => c !== null);
}

const Cards = ({ data, summaryCards }: ReportChartProps) => {

  const cards = useMemo(() => {
    return calculateSummaryCards(data, summaryCards);
  }, [data, summaryCards]);

  return (
    <section className=" bg-white border border-[#E6E6E6] rounded-xl overflow-hidden shadow-[0px_1px_2px_rgba(0,0,0,0.04)] w-full p-3">

      <div className="grid grid-cols-4 gap-4">

        {cards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col gap-1 p-4 rounded-lg border border-gray-200 bg-gray-50"
          >
            <span className="text-xs text-gray-500 truncate" title={card.label}>
              {card.label}
            </span>

            <span className="text-xl font-semibold text-gray-900 truncate" title={card.value.toLocaleString()}>
              {card.value.toLocaleString()}
            </span>

            {card.labelValue && (
              <span className="text-xs text-gray-400 truncate"  title={card.labelValue.toString()}>
                {card.labelValue}
              </span>
            )}
          </div>
        ))}

      </div>

    </section>
  );
};

export default Cards;
