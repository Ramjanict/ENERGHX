import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import SectionHeader from "@/common/header/SectionHeader";
import BMiniCard from "@/components/consumer/basic/building/card/BMiniCard";
import { SolveWindDesignData } from "@/store/consumer/standard/designs/wind/types/windDesign";
import { Gauge, TrendingUp, Wind, Zap } from "lucide-react";
import InfoRow from "../solar/InfoRow";
import ConsiderationCard from "./WindSiteConsiderations";

interface SystemResultsProps {
  results: SolveWindDesignData;
}

const NOT_AVAILABLE = "—";

const SUITABILITY_CLASSES: Record<string, string> = {
  excellent: "text-green-600",
  good: "text-green-600",
  fair: "text-amber-600",
  poor: "text-red-600",
};

const WindSystemResults: React.FC<SystemResultsProps> = ({ results }) => {
  const {
    sizing,
    technical_specifications,
    financial_analysis,
    site_considerations,
  } = results;

  const { site_analysis, turbine_configuration } = technical_specifications;

  const formatMoney = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return NOT_AVAILABLE;
    const prefix = financial_analysis.currency === "USD" ? "$" : "";
    return `${prefix}${amount.toLocaleString()}`;
  };

  const formatSpec = (value: number | null, unit: string) =>
    value === null ? NOT_AVAILABLE : `${value} ${unit}`;

  const turbineDetails = [
    {
      label: "Rotor Diameter:",
      value: formatSpec(turbine_configuration.rotor_diameter_m, "metres"),
    },
    {
      label: "Tower Height:",
      value:
        turbine_configuration.tower_height_m === null
          ? NOT_AVAILABLE
          : `${turbine_configuration.tower_height_m} metres (${Math.round(
              turbine_configuration.tower_height_m * 3.281,
            )} ft)`,
    },
    {
      label: "Cut-in Speed:",
      value: formatSpec(turbine_configuration.cut_in_speed_ms, "m/s"),
    },
    {
      label: "Rated Speed:",
      value: formatSpec(turbine_configuration.rated_speed_ms, "m/s"),
    },
    {
      label: "Cut-out Speed:",
      value: formatSpec(turbine_configuration.cut_out_speed_ms, "m/s"),
    },
  ];

  const siteDetails = [
    {
      label: "Avg Wind Speed:",
      value: `${site_analysis.avg_wind_speed_ms} m/s`,
    },
    { label: "Wind Class:", value: `Class ${site_analysis.wind_class}` },
    {
      label: "Capacity Factor:",
      value: `${site_analysis.capacity_factor_pct}%`,
    },
    {
      label: "Turbulence Intensity:",
      value: `${site_analysis.turbulence_intensity_pct}%`,
    },
    {
      label: "Site Suitability:",
      value: site_analysis.site_suitability,
      valueClassName:
        SUITABILITY_CLASSES[site_analysis.site_suitability?.toLowerCase()] ??
        "",
    },
  ];

  return (
    <div className="space-y-6">
      <CommonBorderWrapper isShadow>
        <SectionHeader size="xl" title="Wind Sizing Results" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <BMiniCard
            icon={Wind}
            label="Turbine Capacity"
            value={sizing.turbine_capacity.value.toLocaleString()}
            des={sizing.turbine_capacity.unit}
            bgClassName="bg-blue-50/70 flex flex-col items-center justify-center"
            iconClassName=" flex! flex-col! items-center! justify-center! "
            iconBgClassName=""
            iconColorClassName="text-blue-600 w-8! h-8!"
            valueClass="text-blue-600 font-bold!"
          />
          <BMiniCard
            icon={TrendingUp}
            label="Annual Production"
            value={sizing.annual_production.value.toLocaleString()}
            des={sizing.annual_production.unit}
            bgClassName="bg-green-50/70 flex flex-col items-center justify-center"
            iconClassName=" flex! flex-col! items-center! justify-center! "
            iconBgClassName=""
            iconColorClassName="text-green-600 w-8! h-8!"
            valueClass="text-green-600 font-bold!"
          />
          <BMiniCard
            icon={Zap}
            label="Energy Coverage"
            value={`${sizing.energy_coverage.value}%`}
            des={sizing.energy_coverage.sub_label}
            bgClassName="bg-emerald-50/70 flex flex-col items-center justify-center"
            iconClassName=" flex! flex-col! items-center! justify-center! "
            iconBgClassName=""
            iconColorClassName="text-emerald-600 w-8! h-8!"
            valueClass="text-emerald-600 font-bold!"
          />
          <BMiniCard
            icon={Gauge}
            label="Capacity Factor"
            value={`${sizing.capacity_factor.value}%`}
            des={sizing.capacity_factor.sub_label}
            bgClassName="bg-purple-50/70 flex flex-col items-center justify-center"
            iconClassName=" flex! flex-col! items-center! justify-center! "
            iconBgClassName=""
            iconColorClassName="text-purple-600 w-8! h-8!"
            valueClass="text-purple-600 font-bold!"
          />
        </div>
      </CommonBorderWrapper>

      <CommonBorderWrapper isShadow>
        <SectionHeader size="xl" title="Technical Specifications" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 ">
          <div className="space-y-4">
            <SectionHeader size="lg" title="Turbine Configuration" />
            <dl className="space-y-2">
              {turbineDetails.map((item) => (
                <InfoRow
                  key={item.label}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </dl>
          </div>

          <div className="space-y-4">
            <SectionHeader size="lg" title="Site Analysis" />
            <dl className="space-y-2">
              {siteDetails.map((item) => (
                <InfoRow
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  valueClassName={item.valueClassName}
                />
              ))}
            </dl>
          </div>
        </div>
      </CommonBorderWrapper>

      <CommonBorderWrapper isShadow>
        <SectionHeader size="xl" title="Financial Analysis" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <BMiniCard
            className="flex flex-col items-center justify-center bg-[#EAF7E6]/30! "
            label="Equipment Cost"
            value={formatMoney(financial_analysis.equipment_cost)}
          />
          <BMiniCard
            className="flex flex-col items-center justify-center bg-[#EAF7E6]/30! "
            label="Installation"
            value={formatMoney(financial_analysis.installation_cost)}
          />
          <BMiniCard
            className="flex flex-col items-center justify-center bg-[#EAF7E6]/30! "
            label="Total Investment"
            value={formatMoney(financial_analysis.total_investment)}
          />
          <BMiniCard
            className="flex flex-col items-center justify-center bg-[#EAF7E6]/30! "
            label="Payback Period"
            value={
              financial_analysis.payback_period_years === null
                ? NOT_AVAILABLE
                : `${financial_analysis.payback_period_years} yrs`
            }
            valueClass="text-green-600! font-bold!"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2  gap-4">
          <BMiniCard
            className="flex flex-col items-start justify-center bg-[#EAF7E6]/30! "
            label="Annual Savings"
            value={formatMoney(financial_analysis.annual_savings)}
            valueClass="text-green-600! font-bold! text-2xl!"
          />
          <BMiniCard
            className="flex flex-col items-start justify-center bg-[#EAF7E6]/30! "
            label={`${financial_analysis.horizon_years}-Year Savings`}
            value={formatMoney(financial_analysis.lifetime_savings)}
            valueClass="text-green-600! font-bold! text-2xl!"
          />
        </div>
      </CommonBorderWrapper>

      {site_considerations.length > 0 && (
        <ConsiderationCard
          title="Site Considerations"
          items={site_considerations}
        />
      )}
    </div>
  );
};

export default WindSystemResults;
