import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";

import SectionHeader from "@/common/header/SectionHeader";
import { usePdfExport } from "@/common/htmlToPdf/usePdfExport";
import { EnergyAuditResponse } from "@/store/consumer/basic/analysis/types/analysis";
import { useUpgradeMutation } from "@/store/consumer/basic/building/buildingApi";
import { DollarSign, Leaf, TrendingUp } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import BMiniCard from "../building/card/BMiniCard";
import HeaderBanner from "../building/HeaderBanner";
import BarTooltip from "../building/management/BarTooltip";
import InsightStat from "./InsightStat";
import RecommendationItem from "./RecommendationItem";

const SOURCE_COLOR_MAP: Record<string, string> = {
  solar: "#f59e0b",
  wind: "#3b82f6",
  grid: "#64748b",
};

interface EnergyAnalysisReportProps {
  report?: EnergyAuditResponse | null;
}

const EnergyAnalysisReport: React.FC<EnergyAnalysisReportProps> = ({
  report,
}) => {
  const [upgrade, { isLoading }] = useUpgradeMutation();
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    try {
      await upgrade({}).unwrap();
      navigate("/standard-consumer");
    } catch (error) {}
  };

  const auditReport = report?.data?.result?.data?.value?.[0]?.report;

  const summary = auditReport?.summary;
  const buildingInsights = auditReport?.buildingInsights;
  const charts = auditReport?.charts;
  const recommendations = auditReport?.recommendations ?? [];

  const usageData =
    charts?.energyGenerationAndUsage?.data?.map((item) => ({
      month: item.month,
      usage: item.usageKwh,
      solar: item.solarGenerationKwh,
      wind: item.windGenerationKwh,
    })) ?? [];

  const hasSolarData = usageData.some((d) => (d.solar ?? 0) > 0);
  const hasWindData = usageData.some((d) => (d.wind ?? 0) > 0);
  const hasMultipleBars = hasSolarData || hasWindData;

  const distributionData =
    charts?.energySourceDistribution?.data?.map((item) => ({
      name: item.source.charAt(0).toUpperCase() + item.source.slice(1),
      value: item.sharePct,
      color: SOURCE_COLOR_MAP[item.source] ?? "#94a3b8",
    })) ?? [];

  const analysisCards = [
    {
      icon: TrendingUp,
      iconColorClassName: "text-[#16A34A]",
      iconBgClassName: "bg-[#DCFCE7]",
      label: "Energy Score",
      value: summary ? `${summary.energyScore}/100` : "-",
      des: "Excellent Performance",
    },
    {
      icon: Leaf,
      iconColorClassName: "text-[#16A34A]",
      iconBgClassName: "bg-[#DCFCE7]",
      label: "Renewable %",
      value: summary ? `${summary.renewablePercent}%` : "-",
      des: "Above Target",
    },
    {
      icon: DollarSign,
      iconColorClassName: "text-[#D08700]",
      iconBgClassName: "bg-[#FEF3C7]",
      label: "Annual Savings",
      value: summary ? `$${summary.annualSavings.toLocaleString()}` : "-",
      valueClass: "text-[#00A63E]",
      des: "vs. Grid Only",
    },
    {
      icon: Leaf,
      iconColorClassName: "text-[#16A34A]",
      iconBgClassName: "bg-[#DCFCE7]",
      label: "CO₂ Avoided",
      value: summary ? `${summary.co2Avoided}` : "-",
      des: "tons/year",
    },
  ];

  const { targetRef, exportPdf, isExporting } = usePdfExport<HTMLDivElement>({
    filename: `Report-${report?.data?.auditType?.toLowerCase() || "audit"}-${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`,
  });
  return (
    <div className="space-y-6">
      <HeaderBanner
        title="Energy Analysis Report"
        description="Comprehensive insights for your building's energy performance"
        isButton
        onClick={() => exportPdf()}
        isLoading={isExporting || isLoading}
      />

      <div className="space-y-6" ref={targetRef}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {analysisCards.map((card, index) => (
            <BMiniCard
              key={index}
              className="border-[#E7E9E8]! bg-white! shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)]"
              icon={card.icon}
              iconColorClassName={card.iconColorClassName}
              iconBgClassName={card.iconBgClassName}
              label={card.label}
              value={card.value}
              valueClass={card.valueClass}
              des={card.des}
            />
          ))}
        </div>

        <CommonBorderWrapper isShadow>
          <SectionHeader size="xl" title="Energy Generation &amp; Usage" />
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData}>
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
                <Legend wrapperStyle={{ fontSize: 12, color: "#64748b" }} />
                <Bar
                  dataKey="usage"
                  name="Usage (kWh)"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={hasMultipleBars ? 16 : 38}
                />
                {hasSolarData && (
                  <Bar
                    dataKey="solar"
                    name="Solar (kWh)"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                    barSize={16}
                  />
                )}
                {hasWindData && (
                  <Bar
                    dataKey="wind"
                    name="Wind (kWh)"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    barSize={16}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CommonBorderWrapper>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CommonBorderWrapper isShadow>
            <SectionHeader size="xl" title="Energy Source Distribution" />

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={{ stroke: "#94a3b8" }}
                  >
                    {distributionData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CommonBorderWrapper>

          <CommonBorderWrapper isShadow>
            <SectionHeader size="xl" title="Recommendations" />

            <div className="space-y-5">
              {recommendations.map((rec, index) => (
                <RecommendationItem
                  key={rec.key ?? rec.title}
                  index={index + 1}
                  title={rec.title}
                  description={rec.description}
                />
              ))}
            </div>
          </CommonBorderWrapper>
        </div>

        <CommonBorderWrapper isShadow>
          <SectionHeader size="xl" title="Building Insights" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <InsightStat
              label="Total Appliances"
              value={
                buildingInsights ? `${buildingInsights.totalAppliances}` : "-"
              }
            />
            <InsightStat
              label="Peak Usage Time"
              value={buildingInsights?.peakUsageTime ?? "-"}
            />
            <InsightStat
              label="Efficiency Rating"
              value={buildingInsights?.efficiencyRating ?? "-"}
              valueClass="text-green-600"
            />
          </div>
        </CommonBorderWrapper>
      </div>

      <div className="rounded-2xl p-6 bg-primary/5 border border-primary/20 ">
        <SectionHeader
          size="md"
          title="Upgrade to Standard Plan"
          description=" Get access to advanced engineering modules, thermal comfort
          simulation, and professional contract services."
          className="mb-2"
        />

        <CommonButton
          onClick={handleUpgrade}
          disabled={isLoading}
          isLoading={isLoading}
          loadingText="Upgrading..."
        >
          Upgrade Now
        </CommonButton>
      </div>
    </div>
  );
};

export default EnergyAnalysisReport;
