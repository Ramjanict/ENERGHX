import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import SectionHeader from "@/common/header/SectionHeader";
import IconSectionHeader from "@/components/consumer/basic/renewable/IconSectionHeader";
import ProgressStat from "@/components/consumer/basic/renewable/ProgressStat";
import {
  defaultSolarValues,
  SolarFormInput,
  solarFormSchema,
  SolarFormValues,
} from "@/components/consumer/basic/renewable/schema/solarPanelSchema";
import SelectableOptionCard from "@/components/consumer/basic/renewable/SelectableOptionCard";
import SpecRow from "@/components/consumer/basic/renewable/SpecRow";
import StatBlock from "@/components/consumer/basic/renewable/StatBlock";
import { useCalculateSolarMutation } from "@/store/consumer/basic/renewables/renewableEnergyAPI";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import DashboardCardSkeleton from "@/common/loading/DashboardCardSkeleton";
import SolarPanelForm from "@/components/consumer/basic/renewable/form/SolarPanelForm";
import {
  ArrowRight,
  Calendar,
  Check,
  DollarSign,
  Sun,
  TrendingUp,
  X,
} from "lucide-react";

const fmtNumber = (n: number) => n.toLocaleString("en-US");
const fmtCurrency = (n: number, currency = "$") =>
  `${currency}${fmtNumber(Math.round(n))}`;

const BSolarEnergy = () => {
  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm<SolarFormInput, unknown, SolarFormValues>({
    resolver: zodResolver(solarFormSchema),
    defaultValues: defaultSolarValues,
  });

  const [calculateSolar, { data, isLoading }] = useCalculateSolarMutation();
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [interested, setInterested] = useState<"yes" | "no" | null>(null);

  const onValidSubmit = async (values: SolarFormValues) => {
    try {
      await calculateSolar(values).unwrap();
      setHasAnalyzed(true);
    } catch (err) {
      console.error("Failed to calculate solar potential:", err);
      setHasAnalyzed(false);
    }
  };

  const submitAnalysis = handleSubmit(onValidSubmit);

  const summary = data?.data.summary;
  const impact = data?.data.environmental_impact;
  const site = data?.data.site_suitability;
  const system_specifications = data?.data?.system_specifications;
  const financial_breakdown = data?.data?.financial_breakdown;

  return (
    <div className="space-y-6">
      <IconSectionHeader
        icon={Sun}
        title="Solar Energy Potential"
        description="Assess your solar energy potential and savings"
        iconBgClassName="bg-[#FFEDD4]"
        iconClassName="text-[#F54900]"
      />
      <SolarPanelForm
        hasAnalyzed={hasAnalyzed}
        onSubmit={submitAnalysis}
        isLoading={isLoading}
        reset={reset}
        control={control}
        register={register}
        errors={errors}
      />

      {isLoading ? (
        <DashboardCardSkeleton />
      ) : (
        <div className="space-y-6">
          {summary && (
            <div className="rounded-[14px] border-2 border-[#FFD6A8] bg-gradient-to-br from-[#FFF7ED] to-white-2xl p-6 space-y-6">
              <SectionHeader size="xl" title="Solar Analysis Results" />
              <div className="grid  grid-cols-2 xl:grid-cols-4 gap-6">
                <StatBlock
                  icon={Sun}
                  iconBg="bg-[#FFEDD4]"
                  iconColor="text-[#F54900]"
                  label="Recommended System"
                  value={` ${summary.recommended_system_kw} kW `}
                  sub={
                    summary.recommended_system_label ??
                    "Based on your location and energy usage"
                  }
                />
                <StatBlock
                  icon={TrendingUp}
                  iconBg="bg-[#DCFCE7]"
                  iconColor="text-[#00A63E]"
                  label="Annual Generation"
                  value={` ${fmtNumber(summary.annual_generation_kwh)} kWh `}
                  sub={"Per year"}
                />
                <StatBlock
                  icon={DollarSign}
                  iconBg="bg-[#DBEAFE]"
                  iconColor="text-[#155DFC]"
                  label="Annual Savings"
                  value={` ${fmtCurrency(summary.annual_savings_usd)}  `}
                  sub={"Energy cost reduction"}
                />
                <StatBlock
                  icon={Calendar}
                  iconBg="bg-[#F3E8FF]"
                  iconColor="text-[#9810FA]"
                  label="Payback Period"
                  value={` ${summary.payback_period_years} years `}
                  sub={"Return on investment"}
                />
              </div>
            </div>
          )}

          {system_specifications && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CommonBorderWrapper isShadow>
                <SectionHeader size="xl" title="System Specifications" />
                <div>
                  <SpecRow
                    label="Panel Type"
                    value={`${system_specifications?.panel_type ?? ""}`}
                  />
                  <SpecRow
                    label="Panel Wattage"
                    value={`${system_specifications?.rated_power_w_per_panel ?? ""} W`}
                  />
                  <SpecRow
                    label="Panel Efficiency"
                    value={`${system_specifications?.panel_efficiency_percent ?? ""}`}
                  />
                  <SpecRow
                    label="Number of Panels"
                    value={`${system_specifications?.number_of_panels ?? 0}`}
                  />
                  <SpecRow
                    label="Inverter Type"
                    value={`${system_specifications?.inverter_type ?? ""}`}
                  />
                  <SpecRow
                    label="Battery Storage"
                    value={`${system_specifications?.battery_storage_kwh ?? 0} kWh`}
                    showBorder={false}
                  />
                </div>
              </CommonBorderWrapper>

              {site && (
                <CommonBorderWrapper isShadow>
                  <SectionHeader size="xl" title="Site Conditions" />
                  <div>
                    <SpecRow
                      label="Daily Irradiance"
                      value={`${site?.roof_orientation.score_pct ?? 0}%`}
                    />

                    <SpecRow
                      label="Shading Factor"
                      value={`${site?.shading_analysis?.score_pct ?? 0}%`}
                    />
                    <SpecRow
                      label="Performance Ratio"
                      value={`${site?.solar_irradiance.score_pct ?? 0}%`}
                      showBorder={false}
                    />
                  </div>
                </CommonBorderWrapper>
              )}

              {financial_breakdown && (
                <CommonBorderWrapper isShadow>
                  <SectionHeader size="xl" title="Financial Breakdown" />

                  <div>
                    <SpecRow
                      label="System Cost"
                      value={`$${financial_breakdown.system_cost_usd?.toLocaleString() ?? ""}`}
                    />

                    <SpecRow
                      label={`Federal Tax Credit (${financial_breakdown.tax_credit_percentage ?? 0}%)`}
                      value={`$${financial_breakdown.tax_credit_usd?.toLocaleString() ?? ""}`}
                      valueClass="text-green-600"
                    />

                    <SpecRow
                      label="Net Cost"
                      value={`$${financial_breakdown.net_cost_usd?.toLocaleString() ?? ""}`}
                    />

                    <SpecRow
                      label="Annual Savings"
                      value={`$${financial_breakdown.annual_savings_usd?.toLocaleString() ?? ""}`}
                      valueClass="text-green-600"
                    />

                    <SpecRow
                      label="Lifetime Savings"
                      value={`$${financial_breakdown.lifetime_savings_usd?.toLocaleString() ?? ""}`}
                      valueClass="text-green-600"
                    />

                    <SpecRow
                      label="Payback Period"
                      value={`${financial_breakdown.payback_period_years ?? ""} years`}
                    />

                    <SpecRow
                      label="Project Lifetime"
                      value={`${financial_breakdown.project_lifetime_years ?? ""} years`}
                      valueClass="text-orange-500"
                      showBorder={false}
                    />
                  </div>
                </CommonBorderWrapper>
              )}
            </div>
          )}

          {impact && (
            <div className="rounded-[14px] border-2 border-[#B9F8CF] bg-gradient-to-br from-[#F0FDF4] to-white p-6 space-y-4">
              <SectionHeader size="xl" title="Environmental Impact" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatBlock
                  label="CO₂ Reduction"
                  value={`${impact?.co2_reduction_tons_per_year ?? 6} tons/year`}
                  valueClass="text-green-600!"
                  sub={
                    impact
                      ? `Equivalent to planting ${fmtNumber(
                          impact.equivalent_trees_planted,
                        )} trees`
                      : "Equivalent to planting 150 trees"
                  }
                />
                <StatBlock
                  label="Clean Energy"
                  value={impact ? `${impact.clean_energy_percentage}%` : "0%"}
                  valueClass="text-green-600!"
                  sub="Renewable energy source"
                />
                <StatBlock
                  label="Energy Independence"
                  value={
                    impact ? `${impact.energy_independence_percentage}%` : "85%"
                  }
                  valueClass="text-green-600!"
                  sub="Self-sufficiency rating"
                />
              </div>
            </div>
          )}

          {site && (
            <CommonBorderWrapper className="space-y-4">
              <SectionHeader size="lg" title="Site Suitability Analysis" />
              <div className="space-y-4">
                <ProgressStat
                  label="Roof Orientation"
                  status={
                    site
                      ? `${site.roof_orientation.caption}`
                      : "Excellent (South-facing)"
                  }
                  percentage={site ? site.roof_orientation.score_pct : 0}
                />
                <ProgressStat
                  label="Solar Irradiance"
                  status={site ? site.solar_irradiance.rating : "Very Good"}
                  percentage={site ? site.solar_irradiance.score_pct : 0}
                />
                <ProgressStat
                  label="Shading Analysis"
                  status={
                    site ? site.shading_analysis.rating : "Minimal Shading"
                  }
                  percentage={site ? site.shading_analysis.score_pct : 0}
                />
              </div>
            </CommonBorderWrapper>
          )}

          {data?.data && (
            <>
              {" "}
              <CommonBorderWrapper isShadow>
                <SectionHeader
                  size="lg"
                  title="Are you interested in solar energy?"
                />
                <div className="flex flex-col sm:flex-row gap-4">
                  <SelectableOptionCard
                    icon={Check}
                    title="Yes, I'm interested"
                    description="Include solar in my energy plan"
                    selected={interested === "yes"}
                    onClick={() => setInterested("yes")}
                  />
                  <SelectableOptionCard
                    icon={X}
                    title="No, not at this time"
                    description="Continue without solar"
                    selected={interested === "no"}
                    onClick={() => setInterested("no")}
                    selectedColor="border-gray-400 bg-gray-50"
                  />
                </div>
              </CommonBorderWrapper>
              <div className="flex justify-end gap-3">
                <CommonButton
                  type="submit"
                  disabled={!hasAnalyzed || isLoading || !interested}
                  to="../wind-energy"
                >
                  Save with Next
                  <ArrowRight className="w-4 h-4" />
                </CommonButton>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BSolarEnergy;
