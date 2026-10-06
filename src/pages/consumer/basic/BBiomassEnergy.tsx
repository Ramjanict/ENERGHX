import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import SectionHeader from "@/common/header/SectionHeader";
import IconSectionHeader from "@/components/consumer/basic/renewable/IconSectionHeader";

import FeatureCard from "@/components/consumer/basic/dashboard/FeatureCard";
import ProgressStat from "@/components/consumer/basic/renewable/ProgressStat";
import {
  BiomassFormInput,
  biomassFormSchema,
  BiomassFormValues,
  defaultBiomassValues,
} from "@/components/consumer/basic/renewable/schema/biomassFormSchema";
import SelectableOptionCard from "@/components/consumer/basic/renewable/SelectableOptionCard";
import SpecRow from "@/components/consumer/basic/renewable/SpecRow";
import StatBlock from "@/components/consumer/basic/renewable/StatBlock";
import { useCalculateBiomassMutation } from "@/store/consumer/basic/renewables/renewableEnergyAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";

import DashboardCardSkeleton from "@/common/loading/DashboardCardSkeleton";
import BiomassForm from "@/components/consumer/basic/renewable/form/BiomassForm";
import {
  ArrowRight,
  Calendar,
  Check,
  DollarSign,
  Droplet,
  Leaf,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  X,
} from "lucide-react";

const fmtNumber = (n: number) => n.toLocaleString("en-US");
const fmtCurrency = (n: number, currency = "$") =>
  `${currency}${fmtNumber(Math.round(n))}`;

const BBiomassEnergy = () => {
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<BiomassFormInput, unknown, BiomassFormValues>({
    resolver: zodResolver(biomassFormSchema) as Resolver<
      BiomassFormInput,
      unknown,
      BiomassFormValues
    >,
    defaultValues: defaultBiomassValues,
    mode: "onChange",
  });
  const [calculateBiomass, { data, isLoading }] = useCalculateBiomassMutation();
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [interested, setInterested] = useState<"yes" | "no" | null>(null);

  const onValidSubmit = async (values: BiomassFormValues) => {
    try {
      await calculateBiomass(values).unwrap();
      setHasAnalyzed(true);
    } catch (err) {
      console.error("Failed to calculate biomass potential:", err);
      setHasAnalyzed(false);
    }
  };

  const submitAnalysis = handleSubmit(onValidSubmit);

  const impact = data?.data.environmental_impact;
  const summary = data?.data.summary;
  const system_specifications = data?.data.system_specifications;
  const financial_breakdown = data?.data.financial_breakdown;
  const feedstockAvailability = data?.data.feedstock_availability;

  return (
    <div className="space-y-6">
      <IconSectionHeader
        icon={Leaf}
        title="Biomass Energy Potential"
        description="Assess your biomass energy potential and savings"
        iconBgClassName="bg-[#F3E8FF]"
        iconClassName="text-[#9810FA]"
      />

      <BiomassForm
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
            <div className="rounded-[14px] border-2 border-[#E9D4FF] bg-gradient-to-br from-[#FAF5FF] to-white p-6 space-y-6">
              <SectionHeader size="xl" title="Biomass Energy Potential" />

              <div className="grid  grid-cols-2 xl:grid-cols-4 gap-6">
                <StatBlock
                  icon={Leaf}
                  iconBg="bg-[#FFEDD4]"
                  iconColor="text-[#F54900]"
                  label="Recommended System"
                  value={` ${summary.recommended_system_kw} kW `}
                  sub="1 biomass boiler"
                />

                <StatBlock
                  icon={TrendingUp}
                  iconBg="bg-[#DCFCE7]"
                  iconColor="text-[#00A63E]"
                  label="Annual Generation"
                  value={` ${fmtNumber(summary.annual_generation_kwh)} kWh `}
                  sub="Per year"
                />

                <StatBlock
                  icon={DollarSign}
                  iconBg="bg-[#DBEAFE]"
                  iconColor="text-[#155DFC]"
                  label="Annual Savings"
                  value={` ${fmtCurrency(summary.annual_savings_usd)} `}
                  sub="Energy cost reduction"
                />

                <StatBlock
                  icon={Calendar}
                  iconBg="bg-[#F3E8FF]"
                  iconColor="text-[#9810FA]"
                  label="Payback Period"
                  value={
                    summary.payback_period_years != null
                      ? ` ${summary.payback_period_years} years `
                      : " N/A "
                  }
                  sub="Return on investment"
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
                    label="Feedstock Type"
                    value={system_specifications.feedstock_type ?? ""}
                  />
                  <SpecRow
                    label="System Type"
                    value={system_specifications.system_type ?? ""}
                  />
                  <SpecRow
                    label="Electrical Capacity"
                    value={`${system_specifications.electrical_capacity_kw ?? 0} kW`}
                  />
                  <SpecRow
                    label="Biogas Storage"
                    value={`${system_specifications.biogas_storage_liters ?? 0} liters`}
                  />
                  <SpecRow
                    label="Energy Output"
                    value={system_specifications.energy_output ?? ""}
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
                    label={`Federal Tax Credit (${
                      financial_breakdown.tax_credit_percentage
                        ? Math.round(
                            financial_breakdown.tax_credit_percentage * 100,
                          )
                        : 0
                    }%)`}
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
                    label="20-Year Savings"
                    value={`$${financial_breakdown.twenty_year_savings_usd?.toLocaleString() ?? ""}`}
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
                  label="CO₂ Neutral"
                  value={`${impact.co2_neutral_percentage}%`}
                  valueClass="text-green-600!"
                  sub="Carbon-neutral energy generation"
                />

                <StatBlock
                  label="Renewable Content"
                  value={`${impact.renewable_content_percentage}%`}
                  valueClass="text-green-600!"
                  sub="Sustainably sourced feedstock"
                />

                <StatBlock
                  label="Energy Independence"
                  value={`${impact.energy_independence_percentage}%`}
                  valueClass="text-green-600!"
                  sub="Self-sufficiency rating"
                />
              </div>
            </div>
          )}

          {feedstockAvailability && (
            <CommonBorderWrapper className="space-y-4">
              <SectionHeader size="xl" title="Feedstock Availability" />
              <div className="space-y-4">
                <ProgressStat
                  label="Local Availability"
                  status={feedstockAvailability.local_availability_status}
                  percentage={75}
                  description="Based on supplier proximity"
                />
                <ProgressStat
                  label="Price Stability"
                  status={feedstockAvailability.price_stability_status}
                  percentage={65}
                  description="Based on market volatility"
                />
                <ProgressStat
                  label="Quality (Moisture Content)"
                  status={feedstockAvailability.quality_moisture_compliance}
                  percentage={85}
                />
              </div>
            </CommonBorderWrapper>
          )}

          {data?.data && (
            <>
              <CommonBorderWrapper isShadow>
                <SectionHeader size="xl" title="Key System Features" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FeatureCard
                    isRow
                    icon={<RefreshCw />}
                    title="Automatic Feeding"
                    description="500 kg fuel storage with automatic feed system"
                    iconBgClassName="bg-[#F3E8FF] w-10! h-10!"
                    iconColorClassName="text-purple-600 w-6! h-6!"
                  />
                  <FeatureCard
                    isRow
                    icon={<Leaf />}
                    title="Emission Control"
                    description="Advanced filtration and emission control system"
                    iconBgClassName="bg-[#DCFCE7] w-10! h-10!"
                    iconColorClassName="text-green-600 w-6! h-6!"
                  />
                  <FeatureCard
                    isRow
                    icon={<Droplet />}
                    title="Hydronic Integration"
                    description="Compatible with existing hot water heating systems"
                    iconBgClassName="bg-[#DBEAFE] w-10! h-10!"
                    iconColorClassName="text-blue-600 w-6! h-6!"
                  />
                  <FeatureCard
                    isRow
                    icon={<ShieldCheck />}
                    title="15-Year Warranty"
                    description="Comprehensive system warranty"
                    iconBgClassName="bg-[#FFEDD4] w-10! h-10!"
                    iconColorClassName="text-orange-600 w-6! h-6!"
                  />
                </div>
              </CommonBorderWrapper>
              <CommonBorderWrapper isShadow>
                <SectionHeader
                  size="xl"
                  title="Are you interested in biomass energy?"
                />

                <div className="flex flex-col sm:flex-row gap-4">
                  <SelectableOptionCard
                    icon={Check}
                    title="Yes, I'm interested"
                    description="Include biomass in my energy plan"
                    selected={interested === "yes"}
                    onClick={() => setInterested("yes")}
                  />

                  <SelectableOptionCard
                    icon={X}
                    title="No, not at this time"
                    description="Continue without biomass"
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
                  to="../analysis"
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

export default BBiomassEnergy;
