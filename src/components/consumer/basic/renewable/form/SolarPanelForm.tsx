import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import SectionHeader from "@/common/header/SectionHeader";
import {
  SolarFormInput,
  SolarFormValues,
} from "@/components/consumer/basic/renewable/schema/solarPanelSchema";
import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormReset,
} from "react-hook-form";
import SelectField from "../SelectField";
import TextField from "../TextField";

const panelTypeOptions = [
  { label: "Monocrystalline", value: "Monocrystalline" },
  { label: "Polycrystalline", value: "Polycrystalline" },
  { label: "Thin-Film", value: "Thin-Film" },
  { label: "Bifacial", value: "Bifacial" },
];

const inverterTypeOptions = [
  { label: "String Inverter", value: "string" },
  { label: "Microinverter", value: "micro" },
  { label: "Power Optimizer", value: "optimizer" },
  { label: "Advanced (Hybrid)", value: "advanced" },
];

interface SolarPanelFormProps {
  isLoading: boolean;
  hasAnalyzed: boolean;

  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  control: Control<SolarFormInput, unknown, SolarFormValues>;
  register: UseFormRegister<SolarFormInput>;
  errors: FieldErrors<SolarFormInput>;
  reset: UseFormReset<SolarFormInput>;
}

const SolarPanelForm: React.FC<SolarPanelFormProps> = ({
  onSubmit,
  isLoading,
  reset,
  control,
  register,
  errors,
}) => {
  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-6">
        <CommonBorderWrapper isShadow>
          <SectionHeader size="xl" title="Panel Parameters" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <SelectField
              label="Panel Type"
              name="panel.panel_type"
              control={control}
              options={panelTypeOptions}
              error={errors.panel?.panel_type?.message}
            />

            <TextField
              label="Panel Wattage (W)"
              type="number"
              step="1"
              placeholder="e.g. 400"
              register={register}
              name="panel.panel_wattage_w"
              error={errors.panel?.panel_wattage_w?.message}
            />
            <TextField
              label="Panel Efficiency (0–1)"
              type="number"
              step="0.001"
              placeholder="e.g. 0.185"
              register={register}
              name="panel.panel_efficiency"
              error={errors.panel?.panel_efficiency?.message}
            />
            <TextField
              label="Panel Count"
              type="number"
              step="1"
              placeholder="e.g. 24"
              register={register}
              name="panel.panel_count"
              error={errors.panel?.panel_count?.message}
            />
          </div>
        </CommonBorderWrapper>

        <CommonBorderWrapper isShadow>
          <SectionHeader size="xl" title="Site Parameters" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TextField
              label="Daily Irradiance (kWh/m²/day)"
              type="number"
              step="0.01"
              placeholder="e.g. 4.4"
              register={register}
              name="site.daily_irradiance_kwh_m2_day"
              error={errors.site?.daily_irradiance_kwh_m2_day?.message}
            />
            <TextField
              label="Azimuth (deg)"
              type="number"
              step="1"
              placeholder="0 – 360"
              register={register}
              name="site.azimuth_deg"
              error={errors.site?.azimuth_deg?.message}
            />
            <TextField
              label="Tilt (deg)"
              type="number"
              step="1"
              placeholder="0 – 90"
              register={register}
              name="site.tilt_deg"
              error={errors.site?.tilt_deg?.message}
            />
            <TextField
              label="Shading Factor (0–1)"
              type="number"
              step="0.01"
              placeholder="e.g. 0.97"
              register={register}
              name="site.shading_factor"
              error={errors.site?.shading_factor?.message}
            />
          </div>
        </CommonBorderWrapper>

        <CommonBorderWrapper isShadow>
          <SectionHeader size="xl" title="System Parameters" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TextField
              label="Performance Ratio (0–1)"
              type="number"
              step="0.01"
              placeholder="e.g. 0.75"
              register={register}
              name="system.performance_ratio"
              error={errors.system?.performance_ratio?.message}
            />
            <SelectField
              label="Inverter Type"
              name="system.inverter_type"
              control={control}
              options={inverterTypeOptions}
              error={errors.system?.inverter_type?.message}
            />
            <TextField
              label="Battery Storage (kWh)"
              type="number"
              step="0.1"
              placeholder="e.g. 0"
              register={register}
              name="system.battery_storage_kwh"
              error={errors.system?.battery_storage_kwh?.message}
            />
          </div>
        </CommonBorderWrapper>

        <CommonBorderWrapper isShadow>
          <SectionHeader size="xl" title="Financial Parameters" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TextField
              label="System Cost ($)"
              type="number"
              step="1"
              placeholder="e.g. 18500"
              register={register}
              name="finance.system_cost"
              error={errors.finance?.system_cost?.message}
            />
            <TextField
              label="Tax Credit Percentage (0–1)"
              type="number"
              step="0.01"
              placeholder="e.g. 0.3"
              register={register}
              name="finance.tax_credit_percentage"
              error={errors.finance?.tax_credit_percentage?.message}
            />
            <TextField
              label="Electricity Tariff Rate ($/kWh)"
              type="number"
              step="0.001"
              placeholder="e.g. 0.169"
              register={register}
              name="finance.electricity_tariff_rate"
              error={errors.finance?.electricity_tariff_rate?.message}
            />
            <TextField
              label="Project Lifetime (years)"
              type="number"
              step="1"
              placeholder="e.g. 25"
              register={register}
              name="finance.project_lifetime_years"
              error={errors.finance?.project_lifetime_years?.message}
            />
          </div>
        </CommonBorderWrapper>

        <CommonBorderWrapper isShadow>
          <SectionHeader size="xl" title="Demand Parameters" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TextField
              label="Annual Load (kWh)"
              type="number"
              step="1"
              placeholder="e.g. 14650"
              register={register}
              name="demand.annual_load_kwh"
              error={errors.demand?.annual_load_kwh?.message}
            />
          </div>
        </CommonBorderWrapper>

        <CommonBorderWrapper isShadow>
          <SectionHeader size="xl" title="Grid Parameters" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TextField
              label="Grid Emission Factor (kg/kWh)"
              type="number"
              step="0.01"
              placeholder="e.g. 0.5"
              register={register}
              name="grid.grid_emission_factor_kg_kwh"
              error={errors.grid?.grid_emission_factor_kg_kwh?.message}
            />
          </div>
        </CommonBorderWrapper>

        <div className="w-full flex  justify-end gap-3 ">
          <CommonButton
            type="button"
            onClick={() => reset()}
            variant="secondary"
          >
            Reset
          </CommonButton>
          <CommonButton
            type="submit"
            isLoading={isLoading}
            loadingText="Evaluating..."
            className=""
          >
            Evaluate Solar Panel
          </CommonButton>
        </div>
      </form>
    </div>
  );
};

export default SolarPanelForm;
