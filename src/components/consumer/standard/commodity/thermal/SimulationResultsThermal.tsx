import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import SectionHeader from "@/common/header/SectionHeader";
import Spinner from "@/common/loading/Spinner";
import BMiniCard from "@/components/consumer/basic/building/card/BMiniCard";
import BarTooltip from "@/components/consumer/basic/building/management/BarTooltip";
import {
  FvmCharts,
  FvmSimulationResults,
} from "@/store/consumer/standard/Simulations/types/fvm/fvm";
import { Activity, Check, CheckCircle2, Play, Thermometer } from "lucide-react";
import React from "react";
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

interface Props {
  results: FvmSimulationResults | null | undefined;
  charts: FvmCharts | null | undefined;
  onRunSimulation: () => void;
  isRunning: boolean;
}

const ChartEmptyState: React.FC<{ children: string }> = ({ children }) => (
  <div className="h-64 mt-4 flex items-center justify-center rounded-xl border border-dashed border-[#E7E9E8]">
    <p className="text-sm text-[#758179] text-center px-6">{children}</p>
  </div>
);

const SimulationResultsThermal: React.FC<Props> = ({
  results,
  charts,
  onRunSimulation,
  isRunning,
}) => {
  const tempData = (charts?.temperatureDistributionAcrossBuilding ?? []).map(
    (p) => ({
      distance: `${p.positionM}m`,
      temperature: p.temperatureC,
      comfort: p.comfortIndex,
    }),
  );

  const heatFluxData = (charts?.heatFluxByBuildingZone ?? []).map((z) => ({
    zone: z.zone,
    heatFlux: z.heatFluxWm2,
    annualLoss: z.annualLossKwh,
  }));

  const convergenceData = charts?.convergenceAnalysis ?? [];

  return (
    <CommonBorderWrapper isShadow>
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <SectionHeader size="xl" title="Simulation Results" />
        <CommonButton
          onClick={onRunSimulation}
          isLoading={isRunning}
          loadingText="Running..."
        >
          <Play className="w-4 h-4 mr-1.5" />
          Run Simulation
        </CommonButton>
      </div>

      {isRunning ? (
        <Spinner size="xl" text="Running simulation..." />
      ) : results ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <BMiniCard
              icon={CheckCircle2}
              iconColorClassName="text-green-600"
              label="Simulation Status"
              value={results.simulationStatus}
              valueClass="text-green-600"
              des={`${results.iterationsUsed} iterations`}
              bgClassName="bg-green-50"
            />
            <BMiniCard
              icon={Activity}
              iconColorClassName="text-blue-600"
              label="Comfort Score"
              value={`${results.comfortScore}`}
              des="out of 100"
              bgClassName="bg-blue-50"
            />
            <BMiniCard
              icon={Thermometer}
              iconColorClassName="text-orange-500"
              label="Avg Heat Flux"
              value={`${results.avgHeatFluxWm2}`}
              valueClass="text-orange-500"
              des="W/m²"
              bgClassName="bg-orange-50"
            />
            <BMiniCard
              icon={Activity}
              iconColorClassName="text-red-500"
              label="Energy Impact"
              value={results.energyImpactKwhYearLoss.toLocaleString()}
              valueClass="text-red-500"
              des="kWh/year loss"
              bgClassName="bg-red-50"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <SectionHeader
                size="lg"
                title="Temperature Distribution Across Building"
              />
              {tempData.length === 0 ? (
                <ChartEmptyState>
                  No temperature distribution returned yet.
                </ChartEmptyState>
              ) : (
                <>
                  <div className="h-64 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={tempData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#e2e8f0"
                        />
                        <XAxis
                          dataKey="distance"
                          tick={{ fontSize: 12, fill: "#64748b" }}
                          tickLine={false}
                          axisLine={{ stroke: "#e2e8f0" }}
                        />
                        <YAxis
                          yAxisId="left"
                          tick={{ fontSize: 12, fill: "#64748b" }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          tick={{ fontSize: 12, fill: "#64748b" }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip content={<BarTooltip />} />
                        <Legend
                          wrapperStyle={{ fontSize: 12, color: "#64748b" }}
                        />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="temperature"
                          name="Temperature (°C)"
                          stroke="#f97316"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="comfort"
                          name="Comfort Index"
                          stroke="#22c55e"
                          strokeWidth={2}
                          strokeDasharray="4 4"
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  {charts?.temperatureCaption && (
                    <p className="text-xs text-[#758179] mt-3 bg-green-50 rounded-lg p-3">
                      {charts.temperatureCaption}
                    </p>
                  )}
                </>
              )}
            </div>

            <div>
              <SectionHeader size="lg" title="Heat Flux by Building Zone" />
              {heatFluxData.length === 0 ? (
                <ChartEmptyState>
                  No heat-flux zone data returned yet.
                </ChartEmptyState>
              ) : (
                <>
                  <div className="h-64 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={heatFluxData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#e2e8f0"
                        />
                        <XAxis
                          dataKey="zone"
                          tick={{ fontSize: 11, fill: "#64748b" }}
                          tickLine={false}
                          axisLine={{ stroke: "#e2e8f0" }}
                        />
                        <YAxis
                          yAxisId="left"
                          tick={{ fontSize: 12, fill: "#64748b" }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
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
                          yAxisId="left"
                          dataKey="heatFlux"
                          name="Heat Flux (W/m²)"
                          fill="#f59e0b"
                          radius={[4, 4, 0, 0]}
                          barSize={16}
                        />
                        <Bar
                          yAxisId="right"
                          dataKey="annualLoss"
                          name="Annual Loss (kWh)"
                          fill="#ef4444"
                          radius={[4, 4, 0, 0]}
                          barSize={16}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {charts?.heatFluxCaption && (
                    <p className="text-xs text-[#758179] mt-3 bg-green-50 rounded-lg p-3">
                      {charts.heatFluxCaption}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          <div>
            <SectionHeader size="lg" title="Convergence Analysis" />
            {convergenceData.length === 0 ? (
              <ChartEmptyState>
                No convergence history returned yet.
              </ChartEmptyState>
            ) : (
              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={convergenceData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="iteration"
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      tickLine={false}
                      axisLine={{ stroke: "#e2e8f0" }}
                    />
                    <YAxis
                      scale="log"
                      domain={["auto", "auto"]}
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<BarTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, color: "#64748b" }} />
                    <Line
                      type="monotone"
                      dataKey="residual"
                      name="Residual Error"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <BMiniCard
              label="Convergence Achieved"
              value={results.convergenceAchieved ? "Yes" : "No"}
              icon={Check}
              iconColorClassName="text-green-600"
              valueClass="text-green-600"
            />
            <BMiniCard
              label="Final Residual"
              value={`${results.finalResidual}`}
            />
            <BMiniCard
              label="Iterations Used"
              value={`${results.iterationsUsed}`}
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

export default SimulationResultsThermal;
