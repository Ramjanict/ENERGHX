import CommonHeader from "@/common/header/CommonHeader";
import { EvChart } from "@/store/consumer/standard/designs/ev/types/evDesign";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface EvEnergyDeliveryChartProps {
  chart: EvChart;
  className?: string;
}

const SERIES_COLORS = ["#0EA5E9", "#16A34A", "#8B5CF6", "#F97316", "#F59E0B"];

const EvEnergyDeliveryChart: React.FC<EvEnergyDeliveryChartProps> = ({
  chart,
  className = "",
}) => {
  const valueAxis = chart.yAxes[0];
  const { peakMonth, peakMonthKwh, totalKwh } = chart.totals;

  // A configured max below the actual data would clip the bars, so it is only
  // applied when it accommodates the series
  const dataMax = chart.data.reduce((max, datum) => {
    const rowMax = chart.series.reduce((seriesMax, series) => {
      const value = datum[series.key];
      return typeof value === "number" ? Math.max(seriesMax, value) : seriesMax;
    }, 0);
    return Math.max(max, rowMax);
  }, 0);

  const axisDomain: [number, number | "auto"] = [
    valueAxis?.min ?? 0,
    valueAxis?.max !== undefined && valueAxis.max >= dataMax
      ? valueAxis.max
      : "auto",
  ];

  return (
    <div
      className={`bg-white border border-[#E5E7EB] rounded-2xl p-6 ${className}`}
    >
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <CommonHeader size="xl">{chart.title}</CommonHeader>

        {(totalKwh !== undefined || peakMonth !== undefined) && (
          <p className="text-sm text-[#758179]">
            {totalKwh !== undefined &&
              `${totalKwh.toLocaleString()} ${chart.unit} total`}
            {totalKwh !== undefined && peakMonth !== undefined && " · "}
            {peakMonth !== undefined &&
              `peak ${peakMonth}${
                peakMonthKwh !== undefined
                  ? ` (${peakMonthKwh.toLocaleString()} ${chart.unit})`
                  : ""
              }`}
          </p>
        )}
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chart.data}
            margin={{ top: 4, right: 8, left: -8, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey={chart.xAxis.key}
              axisLine={{ stroke: "#D1D5DB" }}
              tickLine={false}
              tick={{ fill: "#758179", fontSize: 13 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#758179", fontSize: 13 }}
              domain={axisDomain}
            />
            <Tooltip
              cursor={{ fill: "rgba(17,37,24,0.04)" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #E5E7EB",
                fontSize: 13,
              }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: 13, color: "#758179" }}
            />
            {chart.series.map((series, index) => (
              <Bar
                key={series.key}
                dataKey={series.key}
                name={series.label}
                fill={SERIES_COLORS[index % SERIES_COLORS.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EvEnergyDeliveryChart;
