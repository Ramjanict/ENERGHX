import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonHeader from "@/common/header/CommonHeader";
import SectionHeader from "@/common/header/SectionHeader";
import { BuildingApplianceReport } from "@/store/consumer/basic/appliance/types/appliance";

interface EfficiencyInsightsProps {
  report?: BuildingApplianceReport;
  isLoading?: boolean;
}

const EfficiencyInsights = ({ report, isLoading }: EfficiencyInsightsProps) => {
  const highConsumption = report?.insights.highConsumptionAppliances ?? [];
  const opportunities = report?.insights.optimizationOpportunities ?? [];
  const annual = report?.insights.annualProjections;

  return (
    <CommonBorderWrapper isShadow className="">
      <SectionHeader size="xl" title="Energy Efficiency Insights" />
      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
          <div className="space-y-3">
            <SectionHeader size="lg" title=" High Consumption Appliances" />
            {!isLoading && highConsumption.length === 0 && (
              <CommonHeader size="sm">No data available</CommonHeader>
            )}
            {highConsumption.map((appliance) => (
              <div
                key={appliance.id}
                className="flex items-center justify-between"
              >
                <CommonHeader size="sm">
                  {appliance.name} ({appliance.quantity})
                </CommonHeader>

                <CommonHeader size="md" className="font-bold! text-[#112518]!">
                  {appliance.dailyUsageKwh.toFixed(1)} kWh/day
                </CommonHeader>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
          <div className="space-y-3">
            <SectionHeader size="lg" title="Optimization Opportunities" />
            {!isLoading && opportunities.length === 0 && (
              <CommonHeader size="sm">No suggestions available</CommonHeader>
            )}
            {opportunities.map((opp, index) => (
              <CommonHeader key={index} size="sm">
                • {opp.title}: {opp.description}
              </CommonHeader>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <div className="space-y-3">
            {" "}
            <SectionHeader
              size="lg"
              title="Annual Projections"
              className="mb-4"
            />
            <div>
              <CommonHeader size="sm">Annual Consumption</CommonHeader>
              <CommonHeader size="2xl" className="font-bold! text-[#112518]!">
                {(annual?.annualConsumptionKwh ?? 0).toLocaleString()} kWh
              </CommonHeader>
            </div>
            <div>
              <CommonHeader size="sm">Annual Cost</CommonHeader>
              <CommonHeader size="2xl" className="font-bold! text-[#00A63E]!">
                ${(annual?.annualCost ?? 0).toFixed(2)}
              </CommonHeader>
            </div>
            <div>
              <CommonHeader size="sm">Potential Savings</CommonHeader>
              <CommonHeader size="2xl" className="font-bold! text-[#00A63E]!">
                ${(annual?.potentialSavings ?? 0).toFixed(2)}/yr
              </CommonHeader>
            </div>
          </div>
        </div>
      </div>
    </CommonBorderWrapper>
  );
};

export default EfficiencyInsights;
