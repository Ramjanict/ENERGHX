import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import { BatteryDispatchChartData } from "@/store/consumer/standard/designs/battery/types/batteryDesign";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DailyEnergyDispatchChartProps {
  chart: BatteryDispatchChartData;
}

/** Keeps each flow the colour it has always had, whatever order it arrives in. */
const SERIES_COLORS: Record<string, string> = {
  solarKw: "#F59E0B",
  windKw: "#38BDF8",
  demandKw: "#6B7280",
  batteryKw: "#8B5CF6",
  gridKw: "#EF4444",
};

const FALLBACK_COLORS = ["#0EA5E9", "#16A34A", "#F97316", "#A855F7"];

const DailyEnergyDispatchChart: React.FC<DailyEnergyDispatchChartProps> = ({
  chart,
}) => {
  const valueAxis = chart.yAxes[0];
  const {
    selfSufficiencyPct,
    peakDemandKw,
    batteryChargedKwh,
    batteryDischargedKwh,
    gridImportKwh,
  } = chart.totals;

  const colorFor = (key: string, index: number) =>
    SERIES_COLORS[key] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];

  return (
    <CommonBorderWrapper isShadow>
      <h3 className="text-xl font-bold text-[#112518] mb-4">{chart.title}</h3>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chart.data}
            margin={{ top: 8, right: 16, left: -8, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#E5E7EB"
              vertical={true}
              horizontal={true}
            />
            <XAxis
              dataKey={chart.xAxis.key}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
              tick={{ fill: "#758179", fontSize: 13 }}
            />
            <YAxis
              domain={[valueAxis?.min ?? "auto", valueAxis?.max ?? "auto"]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#758179", fontSize: 13 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #E5E7EB",
                fontSize: 13,
              }}
            />
            {/* Battery power is signed — below this line it is charging */}
            <ReferenceLine y={0} stroke="#D1D5DB" />
            {chart.series.map((series, index) => {
              const color = colorFor(series.key, index);
              const isDashed = series.style === "dashed";

              return (
                <Line
                  key={series.key}
                  type="monotone"
                  dataKey={series.key}
                  name={series.label}
                  stroke={color}
                  strokeWidth={isDashed ? 2 : 2.5}
                  strokeDasharray={isDashed ? "6 4" : undefined}
                  dot={
                    isDashed
                      ? { r: 3, fill: "#fff", stroke: color, strokeWidth: 1.5 }
                      : { r: 3, fill: color, strokeWidth: 0 }
                  }
                  activeDot={{ r: 5 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center flex-wrap gap-x-5 gap-y-2 mt-2">
        {chart.series.map((series, index) => (
          <div key={series.key} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colorFor(series.key, index) }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: colorFor(series.key, index) }}
            >
              {series.label}
            </span>
          </div>
        ))}
      </div>

      {selfSufficiencyPct !== undefined && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 pt-4 border-t border-[#E5E7EB] text-sm">
          <p className="text-[#758179]">
            Self-sufficiency:{" "}
            <span className="font-semibold text-[#15803D]">
              {selfSufficiencyPct}%
            </span>
          </p>
          {peakDemandKw !== undefined && (
            <p className="text-[#758179]">
              Peak demand:{" "}
              <span className="font-semibold text-[#112518]">
                {peakDemandKw} kW
              </span>
            </p>
          )}
          {batteryChargedKwh !== undefined &&
            batteryDischargedKwh !== undefined && (
              <p className="text-[#758179]">
                Battery cycled:{" "}
                <span className="font-semibold text-[#112518]">
                  {batteryChargedKwh} kWh in / {batteryDischargedKwh} kWh out
                </span>
              </p>
            )}
          {gridImportKwh !== undefined && (
            <p className="text-[#758179]">
              Grid import:{" "}
              <span className="font-semibold text-[#112518]">
                {gridImportKwh} kWh
              </span>
            </p>
          )}
        </div>
      )}
    </CommonBorderWrapper>
  );
};

export default DailyEnergyDispatchChart;
