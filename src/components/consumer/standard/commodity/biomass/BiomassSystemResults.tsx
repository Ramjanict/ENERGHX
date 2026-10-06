import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import SectionHeader from "@/common/header/SectionHeader";
import BMiniCard from "@/components/consumer/basic/building/card/BMiniCard";
import { SolveBiomassDesignData } from "@/store/consumer/standard/designs/designPost/types/biomass";
import { Leaf, TrendingUp, Zap } from "lucide-react";
import InfoRow from "../solar/InfoRow";
import ConsiderationCard from "../wind/WindSiteConsiderations";
import EnvironmentalBenefits from "./EnvironmentalBenefits";

interface SystemResultsProps {
  results: SolveBiomassDesignData;
}

const AVAILABILITY_CLASSES: Record<string, string> = {
  excellent: "text-green-600",
  good: "text-green-600",
  fair: "text-amber-600",
  poor: "text-red-600",
};

interface DetailRow {
  label: string;
  value: string;
  valueClassName?: string;
}

const formatSpecValue = (
  raw: string | number | boolean | string[] | number[] | null | undefined,
): string | null => {
  if (raw === null || raw === undefined || raw === "") return null;
  if (Array.isArray(raw)) return raw.join("–");
  if (typeof raw === "boolean") return raw ? "Yes" : "No";
  return String(raw);
};

const BiomassSystemResults: React.FC<SystemResultsProps> = ({ results }) => {
  const {
    sizing,
    technical_specifications,
    space_requirements,
    financial_analysis,
    environmental_benefits,
    integration_notes,
    unavailable,
  } = results;

  const { system_configuration, feedstock_analysis } = technical_specifications;
  const specs = system_configuration.specs ?? {};
  const coverageUnavailable = unavailable.find(
    (item) => item.path === "sizing.energy_coverage",
  );

  const formatMoney = (amount: number) =>
    `${financial_analysis.currency === "USD" ? "$" : ""}${amount.toLocaleString()}`;

  const optional = (
    label: string,
    raw: number | string | boolean | string[] | number[] | null | undefined,
    unit?: string,
  ): DetailRow | null => {
    const formatted = formatSpecValue(raw);
    if (formatted === null) return null;
    return { label, value: unit ? `${formatted} ${unit}` : formatted };
  };

  const systemDetails = [
    optional("Product:", system_configuration.name),
    optional("Manufacturer:", system_configuration.manufacturer),
    optional("System Type:", system_configuration.system_type),
    optional("Output Kind:", system_configuration.output_kind),
    optional("Efficiency:", system_configuration.efficiency_pct, "%"),
    optional("Fuel Type:", system_configuration.feedstock_type),
    optional("Feed Rate:", system_configuration.feed_rate_kg_h, "kg/hr"),
    optional(
      "Storage Capacity:",
      system_configuration.storage_capacity_tonnes,
      "tonnes",
    ),
    optional("Technology:", system_configuration.technology),
    optional("Efficiency Class:", system_configuration.efficiency_class),
    optional("Warranty:", system_configuration.warranty_years, "years"),
    optional("Rated Output:", specs.rated_output_kw, "kW"),
    optional("Thermal Efficiency:", specs.thermal_efficiency_pct, "%"),
    optional("Modulation Range:", specs.modulation_range_pct, "%"),
    optional("Ash Removal:", specs.ash_removal),
    optional("Flue Diameter:", specs.flue_diameter_mm, "mm"),
    optional("Buffer Tank:", specs.buffer_tank_required_l, "L"),
    optional("Digester Volume:", specs.reactor_volume_m3 ?? specs.digester_volume_m3, "m³"),
    optional("Biogas Output:", specs.biogas_output_m3_day, "m³/day"),
    optional("Electrical Output:", specs.rated_electrical_output_kw, "kW"),
  ].filter((row): row is DetailRow => row !== null);

  const feedstockDetails: DetailRow[] = [
    {
      label: "Annual Consumption:",
      value: `${feedstock_analysis.annual_consumption_tonnes} tonnes`,
    },
    {
      label: "Fuel Cost:",
      value: `${formatMoney(feedstock_analysis.cost_per_tonne)}/tonne`,
    },
    {
      label: "Energy Density:",
      value: `${feedstock_analysis.energy_density_kwh_kg} kWh/kg`,
    },
    {
      label: "Moisture Content:",
      value: `${feedstock_analysis.moisture_content_pct}%`,
    },
    {
      label: "Local Availability:",
      value: feedstock_analysis.local_availability,
      valueClassName:
        AVAILABILITY_CLASSES[
          feedstock_analysis.local_availability?.toLowerCase()
        ] ?? "",
    },
  ];

  return (
    <div className="space-y-6">
      <CommonBorderWrapper isShadow>
        <SectionHeader size="xl" title="Biomass Sizing Results" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <BMiniCard
            icon={Leaf}
            label="Recommended System"
            value={`${sizing.recommended_capacity.value} ${sizing.recommended_capacity.unit}`}
            des={sizing.recommended_capacity.sub_label}
            bgClassName="bg-white flex flex-col items-start justify-center"
            iconBgClassName="bg-[#EAF7E6]"
            iconColorClassName="text-primary w-6! h-6!"
            valueClass="text-[#112518]! font-bold!"
          />
          <BMiniCard
            icon={TrendingUp}
            label="Annual Output"
            value={sizing.annual_output.value.toLocaleString()}
            des={sizing.annual_output.sub_label}
            bgClassName="bg-white flex flex-col items-start justify-center"
            iconBgClassName="bg-[#EAF7E6]"
            iconColorClassName="text-primary w-6! h-6!"
            valueClass="text-[#112518]! font-bold!"
          />
          <BMiniCard
            icon={Zap}
            label="Heating Coverage"
            value={
              sizing.energy_coverage
                ? `${sizing.energy_coverage.value}%`
                : "--"
            }
            des={
              sizing.energy_coverage?.sub_label ??
              coverageUnavailable?.message ??
              "Not available"
            }
            bgClassName="bg-white flex flex-col items-start justify-center"
            iconBgClassName="bg-[#EAF7E6]"
            iconColorClassName="text-primary w-6! h-6!"
            valueClass="text-green-600! font-bold!"
          />
        </div>
      </CommonBorderWrapper>

      <CommonBorderWrapper isShadow>
        <SectionHeader size="xl" title="Technical Specifications" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ">
          <div className="space-y-4">
            <SectionHeader size="lg" title="System Configuration" />
            <dl className="space-y-2">
              {systemDetails.map((item) => (
                <InfoRow
                  key={item.label}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </dl>
          </div>

          <div className="space-y-4">
            <SectionHeader size="lg" title="Feedstock Analysis" />
            <dl className="space-y-2">
              {feedstockDetails.map((item) => (
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
        <SectionHeader size="xl" title="Space Requirements" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <BMiniCard
            className="flex flex-col items-start justify-center bg-[#EAF7E6]/30! "
            label="Plant Room"
            value={`${space_requirements.plant_room.value} sq ft`}
            des={space_requirements.plant_room.sub_label}
          />
          <BMiniCard
            className="flex flex-col items-start justify-center bg-[#EAF7E6]/30! "
            label="Feedstock Storage"
            value={`${space_requirements.feedstock_storage.value} sq ft`}
            des={space_requirements.feedstock_storage.sub_label}
          />
          <BMiniCard
            className="flex flex-col items-start justify-center bg-[#EAF7E6]/30! "
            label="Total Space"
            value={`${space_requirements.total_space.value} sq ft`}
            des={space_requirements.total_space.sub_label}
          />
        </div>
      </CommonBorderWrapper>

      <CommonBorderWrapper isShadow>
        <SectionHeader size="xl" title="Financial Analysis" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <BMiniCard
            className="flex flex-col items-start justify-center bg-[#EAF7E6]/30! "
            label="Equipment Cost"
            value={formatMoney(financial_analysis.equipment_cost)}
          />
          <BMiniCard
            className="flex flex-col items-start justify-center bg-[#EAF7E6]/30! "
            label="Installation"
            value={formatMoney(financial_analysis.installation_cost)}
          />
          <BMiniCard
            className="flex flex-col items-start justify-center bg-[#EAF7E6]/30! "
            label="Total Investment"
            value={formatMoney(financial_analysis.total_investment)}
          />
          <BMiniCard
            className="flex flex-col items-start justify-center bg-[#EAF7E6]/30! "
            label="Payback Period"
            value={`${financial_analysis.payback_period_years} yrs`}
            valueClass="text-green-600! font-bold!"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <BMiniCard
            className="flex flex-col items-start justify-center bg-[#EAF7E6]/30! "
            label="Annual Fuel Cost"
            value={formatMoney(financial_analysis.annual_fuel_cost)}
          />
          <BMiniCard
            className="flex flex-col items-start justify-center bg-[#EAF7E6]/30! "
            label="Annual Savings"
            value={formatMoney(financial_analysis.annual_savings)}
            valueClass="text-green-600! font-bold!"
          />
          <BMiniCard
            className="flex flex-col items-start justify-center bg-[#EAF7E6]/30! "
            label={`${financial_analysis.horizon_years}-Year Savings`}
            value={formatMoney(financial_analysis.lifetime_savings)}
            valueClass="text-green-600! font-bold!"
          />
        </div>
      </CommonBorderWrapper>

      {environmental_benefits.length > 0 && (
        <CommonBorderWrapper isShadow>
          <SectionHeader size="xl" title="Environmental Benefits" />
          <EnvironmentalBenefits benefits={environmental_benefits} />
        </CommonBorderWrapper>
      )}

      {integration_notes.length > 0 && (
        <ConsiderationCard
          className="bg-[#EFF6FF]! border-[#BEDBFF]!"
          dotColor="bg-[#155DFC]"
          title="System Integration Notes"
          items={integration_notes}
        />
      )}
    </div>
  );
};

export default BiomassSystemResults;
