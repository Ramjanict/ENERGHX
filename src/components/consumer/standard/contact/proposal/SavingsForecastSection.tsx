import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import SectionHeader from "@/common/header/SectionHeader";
import BMiniCard from "@/components/consumer/basic/building/card/BMiniCard";
import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CumulativeSavingsPoint,
  SavingsForecastSummary,
  SavingsForecastYear,
} from "./types";

interface SavingsForecastSectionProps {
  forecastData: SavingsForecastYear[];
  cumulativeData: CumulativeSavingsPoint[];
  summary: SavingsForecastSummary;
}

const SavingsForecastSection: React.FC<SavingsForecastSectionProps> = ({
  forecastData,
  cumulativeData,
  summary,
}) => {
  return (
    <CommonBorderWrapper isShadow>
      <SectionHeader size="xl" title="Savings Forecast" />

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend
              formatter={(value) =>
                value === "annualSavings"
                  ? "Annual Savings ($)"
                  : "O&M Cost ($)"
              }
            />
            <Bar dataKey="annualSavings" fill="#16A34A" radius={[3, 3, 0, 0]} />
            <Bar dataKey="omCost" fill="#F59E0B" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-2">
        <h3 className="text-sm sm:text-lg font-bold text-[#112518] mb-4">
          25-Year Cumulative Savings
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cumulativeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend formatter={() => "Cumulative Savings ($)"} />
              <Line
                type="monotone"
                dataKey="cumulativeSavings"
                stroke="#16A34A"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
        <BMiniCard
          className="flex flex-col items-center justify-center bg-[#EAF7E6]/30! "
          label="Payback Period"
          value={`${formatNumber(summary.paybackYears)} years`}
        />
        <BMiniCard
          className="flex flex-col items-center justify-center bg-[#EAF7E6]/30! "
          label="25-Year Savings"
          value={formatCurrency(summary.twentyFiveYearSavings)}
          valueClass="text-green-600!"
        />
        <BMiniCard
          className="flex flex-col items-center justify-center bg-[#EAF7E6]/30! "
          label="Net Present Value"
          value={formatCurrency(summary.netPresentValue)}
        />
        <BMiniCard
          className="flex flex-col items-center justify-center bg-[#EAF7E6]/30! "
          label="ROI (25 years)"
          value={`${formatNumber(summary.roi25YearPct)}%`}
          valueClass="text-green-600!"
        />
      </div>
    </CommonBorderWrapper>
  );
};

export default SavingsForecastSection;
