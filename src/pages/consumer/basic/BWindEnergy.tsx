import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import SectionHeader from "@/common/header/SectionHeader";
import IconSectionHeader from "@/components/consumer/basic/renewable/IconSectionHeader";
import ProgressStat from "@/components/consumer/basic/renewable/ProgressStat";
import {
  defaultWindValues,
  windFormSchema,
  WindFormValues,
} from "@/components/consumer/basic/renewable/schema/windFormSchema";
import SelectableOptionCard from "@/components/consumer/basic/renewable/SelectableOptionCard";
import SpecRow from "@/components/consumer/basic/renewable/SpecRow";
import StatBlock from "@/components/consumer/basic/renewable/StatBlock";
import { useCalculateWindMutation } from "@/store/consumer/basic/renewables/renewableEnergyAPI";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import DashboardCardSkeleton from "@/common/loading/DashboardCardSkeleton";
import WindTurbineForm from "@/components/consumer/basic/renewable/form/WindTurbineForm";
import {
  ArrowRight,
  Calendar,
  Check,
  DollarSign,
  TrendingUp,
  Wind,
  X,
} from "lucide-react";

const fmtNumber = (n: number) => n.toLocaleString("en-US");
const fmtCurrency = (n: number, currency = "$") =>
  `${currency}${fmtNumber(Math.round(n))}`;

const BWindEnergy = () => {
  const {
    control,
    handleSubmit,

    register,
    reset,

    formState: { errors },
  } = useForm<WindFormValues>({
    resolver: zodResolver(windFormSchema),
    defaultValues: defaultWindValues,
    mode: "onChange",
  });

  const [calculateWind, { data, isLoading }] = useCalculateWindMutation();
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [interested, setInterested] = useState<"yes" | "no" | null>(null);

  const onValidSubmit = async (values: WindFormValues) => {
    try {
      await calculateWind(values).unwrap();
      setHasAnalyzed(true);
    } catch (err) {
      console.error("Failed to calculate solar potential:", err);
      setHasAnalyzed(false);
    }
  };

  const submitAnalysis = handleSubmit(onValidSubmit);
  const impact = data?.data.environmental_impact;
  const summary = data?.data.summary;
  const site = data?.data?.wind_resource_assessment;
  const system_specifications = data?.data?.system_specifications;
  const financial_breakdown = data?.data.financial_breakdown;

  return (
    <div className="space-y-6">
      <IconSectionHeader
        icon={Wind}
        title="Wind Energy Potential"
        description="Assess your wind energy potential and savings"
        iconBgClassName="bg-[#DBEAFE]"
        iconClassName="text-[#155DFC]"
      />
      <WindTurbineForm
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
        <>
          {summary && (
            <div className="rounded-[14px] border-2 border-[#BEDBFF] bg-gradient-to-br from-[#EFF6FF] to-white p-6 space-y-6">
              <SectionHeader size="xl" title="Wind Analysis Results" />

              <div className="grid  grid-cols-2 xl:grid-cols-4 gap-6 ">
                <StatBlock
                  icon={Wind}
                  iconBg="bg-[#DBEAFE]"
                  iconColor="text-[#155DFC]"
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
                  value={` ${fmtCurrency(summary.annual_savings_usd)} `}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {system_specifications && (
              <CommonBorderWrapper isShadow>
                <SectionHeader size="xl" title="System Specifications" />

                <div>
                  <SpecRow
                    label="Turbine Type"
                    value={system_specifications.turbine_type ?? ""}
                  />

                  <SpecRow
                    label="Rated Power"
                    value={`${system_specifications.rated_power_kw_per_turbine ?? 0} kW per turbine`}
                  />

                  <SpecRow
                    label="Number of Turbines"
                    value={`${system_specifications.number_of_turbines ?? 0}`}
                  />

                  <SpecRow
                    label="Rotor Diameter"
                    value={`${system_specifications.rotor_diameter_m ?? 0} meters`}
                  />

                  <SpecRow
                    label="Hub Height"
                    value={`${system_specifications.hub_height_m ?? 0} meters`}
                  />

                  <SpecRow
                    label="Rated Wind Speed"
                    value={`${system_specifications.derived_rated_speed_ms ?? 0} m/s`}
                  />

                  <SpecRow
                    label="Swept Area"
                    value={`${system_specifications.swept_area_m2 ?? 0} m²`}
                  />

                  <SpecRow
                    label="Total Rated Power"
                    value={`${system_specifications.total_rated_power_kw ?? 0} kW`}
                  />

                  <SpecRow
                    label="Grid Connection"
                    value={system_specifications.grid_connection ?? ""}
                    showBorder={false}
                  />
                </div>
              </CommonBorderWrapper>
            )}
            {site && (
              <CommonBorderWrapper isShadow>
                <SectionHeader size="xl" title="Wind Resource" />

                <div>
                  <SpecRow
                    label="Mean Wind Speed"
                    value={`${site.mean_wind_speed_ms ?? 0} m/s`}
                  />

                  <SpecRow
                    label="Hub Height Wind Speed"
                    value={`${site.hub_height_wind_speed_ms ?? 0} m/s`}
                  />

                  <SpecRow
                    label="Average Wind Speed Rating"
                    value={site.average_wind_speed?.rating ?? ""}
                  />

                  <SpecRow
                    label="Average Wind Speed Score"
                    value={`${site.average_wind_speed?.score_pct ?? 0}%`}
                  />

                  <SpecRow
                    label="Turbulence Level"
                    value={`${site.turbulence_level?.rating ?? ""} (${site.turbulence_level?.score_pct ?? 0}%)`}
                  />

                  <SpecRow
                    label="Obstacle-Free Zone"
                    value={`${site.obstacle_free_zone?.rating ?? ""} (${site.obstacle_free_zone?.score_pct ?? 0}%)`}
                  />

                  <SpecRow
                    label="Site Suitability"
                    value={`${site.site_suitability?.rating ?? ""} (${site.site_suitability?.score_pct ?? 0}%)`}
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
                    value={`-$${financial_breakdown.tax_credit_usd?.toLocaleString() ?? ""}`}
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
                    label={`${financial_breakdown.project_lifetime_years ?? 0}-Year Savings`}
                    value={`$${financial_breakdown.lifetime_savings_usd?.toLocaleString() ?? ""}`}
                    valueClass="text-orange-500"
                    showBorder={false}
                  />
                </div>
              </CommonBorderWrapper>
            )}
          </div>
          {impact && (
            <div className="rounded-[14px] border-2 border-[#B9F8CF] bg-gradient-to-br from-[#F0FDF4] to-white p-6 space-y-4">
              <SectionHeader size="xl" title="Environmental Impact" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatBlock
                  label="CO₂ Reduction"
                  value={`${impact?.co2_reduction_tons_per_year ?? 0} tons/year`}
                  valueClass="text-green-600!"
                  sub={
                    impact
                      ? `Equivalent to planting ${fmtNumber(
                          impact.equivalent_trees_planted,
                        )} trees annually`
                      : "Equivalent to planting 95 trees annually"
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
                    impact ? `${impact.energy_independence_percentage}%` : "0%"
                  }
                  valueClass="text-green-600!"
                  sub="Self-sufficiency rating"
                />
              </div>
            </div>
          )}
          {site && (
            <CommonBorderWrapper className="space-y-4">
              <SectionHeader size="lg" title="Wind Resource Assessment" />
              <div className="space-y-4">
                <ProgressStat
                  label="Average Wind Speed"
                  status={
                    site
                      ? `${site.hub_height_wind_speed_ms} m/s (${site.average_wind_speed.rating})`
                      : "6.5 m/s (Good)"
                  }
                  percentage={site ? site.average_wind_speed.score_pct : 0}
                  color="bg-[#155DFC]!"
                />

                <ProgressStat
                  label="Site Suitability"
                  status={site ? site.site_suitability.rating : "Good"}
                  percentage={site ? site.site_suitability.score_pct : 0}
                  color="bg-[#155DFC]!"
                />

                <ProgressStat
                  label="Turbulence Level"
                  status={site ? site.turbulence_level.rating : "Low"}
                  percentage={site ? site.turbulence_level.score_pct : 0}
                />

                <ProgressStat
                  label="Obstacle-Free Zone"
                  status={site ? site.obstacle_free_zone.rating : "Excellent"}
                  percentage={site ? site.obstacle_free_zone.score_pct : 0}
                />
              </div>
            </CommonBorderWrapper>
          )}
          {data?.data && (
            <>
              <CommonBorderWrapper isShadow>
                <SectionHeader
                  size="xl"
                  title="Are you interested in wind energy?"
                />

                <div className="flex flex-col sm:flex-row gap-4">
                  <SelectableOptionCard
                    icon={Check}
                    title="Yes, I'm interested"
                    description="Include wind in my energy plan"
                    selected={interested === "yes"}
                    onClick={() => setInterested("yes")}
                  />

                  <SelectableOptionCard
                    icon={X}
                    title="No, not at this time"
                    description="Continue without wind"
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
                  to="../biomass-energy"
                >
                  Save with Next
                  <ArrowRight className="w-4 h-4" />
                </CommonButton>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default BWindEnergy;
