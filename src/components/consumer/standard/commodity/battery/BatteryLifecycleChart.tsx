import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import { BatteryLifecycleChartData } from "@/store/consumer/standard/designs/battery/types/batteryDesign";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface BatteryLifecycleChartProps {
  chart: BatteryLifecycleChartData;
}

const SERIES_COLORS = ["#8B5CF6", "#0EA5E9", "#16A34A"];

const BatteryLifecycleChart: React.FC<BatteryLifecycleChartProps> = ({
  chart,
}) => {
  const valueAxis = chart.yAxes[0];
  const {
    warrantyFloorPct,
    warrantyYear,
    retentionAtWarrantyYear,
    annualDegradationPct,
    meetsWarranty,
  } = chart.totals;

  return (
    <CommonBorderWrapper isShadow>
      <h3 className="text-xl font-bold text-[#112518] mb-4">{chart.title}</h3>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chart.data}
            margin={{ top: 8, right: 12, left: -8, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis
              dataKey={chart.xAxis.key}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
              tick={{ fill: "#758179", fontSize: 13 }}
            />
            <YAxis
              domain={[valueAxis?.min ?? 0, valueAxis?.max ?? "auto"]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#758179", fontSize: 13 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(17,37,24,0.04)" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #E5E7EB",
                fontSize: 13,
              }}
            />
            {warrantyFloorPct !== undefined && (
              <ReferenceLine
                y={warrantyFloorPct}
                stroke="#DC2626"
                strokeDasharray="6 4"
                label={{
                  value: `Warranty floor ${warrantyFloorPct}%`,
                  position: "insideBottomRight",
                  fill: "#DC2626",
                  fontSize: 12,
                }}
              />
            )}
            {chart.series.map((series, index) => (
              <Bar
                key={series.key}
                dataKey={series.key}
                name={series.label}
                fill={SERIES_COLORS[index % SERIES_COLORS.length]}
                radius={[6, 6, 0, 0]}
                maxBarSize={72}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center flex-wrap gap-x-5 gap-y-2 mt-2">
        {chart.series.map((series, index) => (
          <div key={series.key} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-sm"
              style={{
                backgroundColor: SERIES_COLORS[index % SERIES_COLORS.length],
              }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: SERIES_COLORS[index % SERIES_COLORS.length] }}
            >
              {series.label}
            </span>
          </div>
        ))}
      </div>

      {(annualDegradationPct !== undefined ||
        retentionAtWarrantyYear !== undefined) && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 pt-4 border-t border-[#E5E7EB] text-sm">
          {annualDegradationPct !== undefined && (
            <p className="text-[#758179]">
              Annual degradation:{" "}
              <span className="font-semibold text-[#112518]">
                {annualDegradationPct}%
              </span>
            </p>
          )}
          {retentionAtWarrantyYear !== undefined && (
            <p className="text-[#758179]">
              Retention at year {warrantyYear ?? "—"}:{" "}
              <span className="font-semibold text-[#112518]">
                {retentionAtWarrantyYear}%
              </span>
            </p>
          )}
          {meetsWarranty !== undefined && (
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                meetsWarranty
                  ? "bg-[#EAF7E6] text-[#15803D]"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {meetsWarranty ? "Meets warranty" : "Below warranty"}
            </span>
          )}
        </div>
      )}
    </CommonBorderWrapper>
  );
};

export default BatteryLifecycleChart;
