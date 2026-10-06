import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import SectionHeader from "@/common/header/SectionHeader";
import Spinner from "@/common/loading/Spinner";
import BMiniCard from "@/components/consumer/basic/building/card/BMiniCard";
import BarTooltip from "@/components/consumer/basic/building/management/BarTooltip";
import {
  NzebCharts,
  NzebSimulationResults,
} from "@/store/consumer/standard/Simulations/types/nzeb/nzeb";
import { DollarSign, Leaf, Play, TrendingUp, Zap } from "lucide-react";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  results: NzebSimulationResults | null | undefined;
  charts: NzebCharts | null | undefined;
  onRunSimulation: () => void;
  isRunning: boolean;
}

const SOURCE_COLORS: Record<string, string> = {
  Solar: "#f59e0b",
  Wind: "#3b82f6",
  Biomass: "#10b981",
  Grid: "#64748b",
};

const ChartEmptyState: React.FC<{ children: string }> = ({ children }) => (
  <div className="h-72 mt-4 flex items-center justify-center rounded-xl border border-dashed border-[#E7E9E8]">
    <p className="text-sm text-[#758179] text-center px-6">{children}</p>
  </div>
);

const formatCurrency = (value: number) =>
  `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const SimulationResultsNZEB: React.FC<Props> = ({
  results,
  charts,
  onRunSimulation,
  isRunning,
}) => {
  const distributionData = (charts?.energySourceDistribution ?? []).map(
    (entry) => ({
      name: `${entry.source}: ${entry.percent}%`,
      value: entry.percent,
      color: SOURCE_COLORS[entry.source] ?? "#94a3b8",
    }),
  );

  const monthlyData = charts?.monthlyGenerationVsDemand ?? [];
  const financialData = charts?.financialProjection ?? [];
  const roiYears =
    financialData.length > 0
      ? financialData[financialData.length - 1].year
      : 25;

  return (
    <CommonBorderWrapper isShadow>
      <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3">
        <SectionHeader size="xl" title="Simulation Results" />
        <CommonButton
          onClick={onRunSimulation}
          isLoading={isRunning}
          loadingText="Running..."
        >
          <Play className="w-4 h-4 mr-1.5" />
          Run NZEB Simulation
        </CommonButton>
      </div>

      {isRunning ? (
        <Spinner size="xl" text="Running simulation..." />
      ) : results ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <BMiniCard
              icon={TrendingUp}
              iconColorClassName="text-green-600"
              label="Renewable Contribution"
              value={`${results.renewableContributionPercent}%`}
              valueClass="text-green-600"
              des="of annual demand"
              bgClassName="bg-green-50"
            />
            <BMiniCard
              icon={DollarSign}
              iconColorClassName="text-green-600"
              label="Annual Cost Savings"
              value={formatCurrency(results.annualCostSavings)}
              valueClass="text-green-600"
              des="first year"
              bgClassName="bg-green-50"
            />
            <BMiniCard
              icon={Zap}
              iconColorClassName="text-amber-500"
              label="Annual Generation"
              value={results.annualGenerationKwh.toLocaleString()}
              valueClass="text-amber-500"
              des="kWh/year"
              bgClassName="bg-amber-50"
            />
            <BMiniCard
              icon={Leaf}
              iconColorClassName="text-blue-600"
              label="Carbon Reduction"
              value={`${results.carbonReductionTonsPerYear}`}
              valueClass="text-blue-600"
              des="tons CO₂/year"
              bgClassName="bg-blue-50"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <SectionHeader size="lg" title="Energy Source Distribution" />
              {distributionData.length === 0 ? (
                <ChartEmptyState>
                  No energy source breakdown returned yet.
                </ChartEmptyState>
              ) : (
                <div className="h-72 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distributionData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={95}
                        label={({ name }) => name}
                        labelLine={{ stroke: "#94a3b8" }}
                      >
                        {distributionData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div>
              <SectionHeader size="lg" title="Monthly Generation vs Demand" />
              {monthlyData.length === 0 ? (
                <ChartEmptyState>
                  No monthly generation data returned yet.
                </ChartEmptyState>
              ) : (
                <div className="h-72 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e2e8f0"
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        tickLine={false}
                        axisLine={{ stroke: "#e2e8f0" }}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        content={<BarTooltip />}
                        cursor={{ fill: "#f1f5f9" }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: 12, color: "#64748b" }}
                      />
                      <Bar
                        dataKey="solarKwh"
                        name="Solar"
                        stackId="a"
                        fill="#f59e0b"
                      />
                      <Bar
                        dataKey="windKwh"
                        name="Wind"
                        stackId="a"
                        fill="#3b82f6"
                      />
                      <Bar
                        dataKey="biomassKwh"
                        name="Biomass"
                        stackId="a"
                        fill="#10b981"
                      />
                      <Bar
                        dataKey="demandKwh"
                        name="Demand"
                        fill="#64748b"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          <div>
            <SectionHeader
              size="lg"
              title={`${roiYears}-Year Financial Projection`}
            />
            {financialData.length === 0 ? (
              <ChartEmptyState>
                No financial projection returned yet.
              </ChartEmptyState>
            ) : (
              <div className="h-72 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={financialData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      tickLine={false}
                      axisLine={{ stroke: "#e2e8f0" }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<BarTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: 12, color: "#64748b" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="cumulativeSavings"
                      name="Cumulative Savings ($)"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="netPosition"
                      name="Net Position ($)"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <BMiniCard
              label="Payback Period"
              value={`${results.paybackPeriodYears} years`}
            />
            <BMiniCard
              label="Net Present Value"
              value={formatCurrency(results.netPresentValue)}
              valueClass="text-primary"
            />
            <BMiniCard
              label={`ROI (${roiYears} years)`}
              value={`${results.roiPercent}%`}
            />
          </div>
        </>
      ) : (
        <p className="text-sm text-[#758179] py-6 text-center">
          Run the simulation to generate results
        </p>
      )}
    </CommonBorderWrapper>
  );
};

export default SimulationResultsNZEB;
