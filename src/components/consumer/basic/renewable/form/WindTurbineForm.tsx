import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import SectionHeader from "@/common/header/SectionHeader";
import {
  WindFormInput,
  WindFormValues,
} from "@/components/consumer/basic/renewable/schema/windFormSchema";
import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormReset,
} from "react-hook-form";
import SelectField from "../SelectField";
import TextField from "../TextField";

const turbineTypeOptions = [
  { label: "Horizontal Axis", value: "Horizontal Axis" },
  { label: "Vertical Axis", value: "Vertical Axis" },
];

const connectionTypeOptions = [
  {
    label: "Grid-Tied with Net Metering",
    value: "Grid-Tied with Net Metering",
  },
  {
    label: "Grid-Tied without Net Metering",
    value: "Grid-Tied without Net Metering",
  },
  { label: "Off-Grid / Standalone", value: "Off-Grid / Standalone" },
  { label: "Hybrid", value: "Hybrid" },
];

interface WindTurbineFormProps {
  isLoading: boolean;
  hasAnalyzed: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  control: Control<WindFormInput, unknown, WindFormValues>;
  register: UseFormRegister<WindFormInput>;
  errors: FieldErrors<WindFormInput>;
  reset: UseFormReset<WindFormInput>;
}

const WindTurbineForm: React.FC<WindTurbineFormProps> = ({
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
          <SectionHeader size="xl" title="Wind Resource Parameters" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TextField
              label="Mean Wind Speed (m/s)"
              type="number"
              step="0.1"
              placeholder="e.g. 5.5"
              register={register}
              name="wind_resource.mean_wind_speed_ms"
              error={errors.wind_resource?.mean_wind_speed_ms?.message}
            />
            <TextField
              label="Measurement Height (m)"
              type="number"
              step="0.1"
              placeholder="e.g. 10"
              register={register}
              name="wind_resource.measurement_height_m"
              error={errors.wind_resource?.measurement_height_m?.message}
            />
            <TextField
              label="Weibull k"
              type="number"
              step="0.1"
              placeholder="e.g. 2"
              register={register}
              name="wind_resource.weibull_k"
              error={errors.wind_resource?.weibull_k?.message}
            />
            <TextField
              label="Air Density (kg/m³)"
              type="number"
              step="0.001"
              placeholder="e.g. 1.225"
              register={register}
              name="wind_resource.air_density_kg_m3"
              error={errors.wind_resource?.air_density_kg_m3?.message}
            />
            <TextField
              label="Turbulence Intensity (0–1)"
              type="number"
              step="0.001"
              placeholder="e.g. 0.098"
              register={register}
              name="wind_resource.turbulence_intensity"
              error={errors.wind_resource?.turbulence_intensity?.message}
            />
            <TextField
              label="Terrain Roughness Class"
              type="number"
              step="1"
              placeholder="e.g. 2"
              register={register}
              name="wind_resource.terrain_roughness_class"
              error={errors.wind_resource?.terrain_roughness_class?.message}
            />
            <TextField
              label="Nearest Obstacle Height (m)"
              type="number"
              step="0.1"
              placeholder="e.g. 8"
              register={register}
              name="wind_resource.nearest_obstacle_height_m"
              error={errors.wind_resource?.nearest_obstacle_height_m?.message}
            />
            <TextField
              label="Nearest Obstacle Distance (m)"
              type="number"
              step="1"
              placeholder="e.g. 250"
              register={register}
              name="wind_resource.nearest_obstacle_distance_m"
              error={errors.wind_resource?.nearest_obstacle_distance_m?.message}
            />
          </div>
        </CommonBorderWrapper>

        <CommonBorderWrapper isShadow>
          <SectionHeader size="xl" title="Turbine Parameters" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <SelectField
              label="Turbine Type"
              name="turbine.turbine_type"
              control={control}
              options={turbineTypeOptions}
              error={errors.turbine?.turbine_type?.message}
            />
            <TextField
              label="Rotor Diameter (m)"
              type="number"
              step="0.1"
              placeholder="e.g. 6.2"
              register={register}
              name="turbine.rotor_diameter_m"
              error={errors.turbine?.rotor_diameter_m?.message}
            />
            <TextField
              label="Hub Height (m)"
              type="number"
              step="0.1"
              placeholder="e.g. 18"
              register={register}
              name="turbine.hub_height_m"
              error={errors.turbine?.hub_height_m?.message}
            />
            <TextField
              label="Rated Power (kW)"
              type="number"
              step="0.1"
              placeholder="e.g. 5"
              register={register}
              name="turbine.rated_power_kw"
              error={errors.turbine?.rated_power_kw?.message}
            />
            <TextField
              label="Power Coefficient Cp (0–1)"
              type="number"
              step="0.01"
              placeholder="e.g. 0.4"
              register={register}
              name="turbine.power_coefficient_cp"
              error={errors.turbine?.power_coefficient_cp?.message}
            />
            <TextField
              label="Cut-in Speed (m/s)"
              type="number"
              step="0.1"
              placeholder="e.g. 3.5"
              register={register}
              name="turbine.cut_in_speed_ms"
              error={errors.turbine?.cut_in_speed_ms?.message}
            />
            <TextField
              label="Cut-out Speed (m/s)"
              type="number"
              step="0.1"
              placeholder="e.g. 25"
              register={register}
              name="turbine.cut_out_speed_ms"
              error={errors.turbine?.cut_out_speed_ms?.message}
            />
            <TextField
              label="System Efficiency (0–1)"
              type="number"
              step="0.001"
              placeholder="e.g. 0.857"
              register={register}
              name="turbine.system_efficiency"
              error={errors.turbine?.system_efficiency?.message}
            />
          </div>
        </CommonBorderWrapper>

        <CommonBorderWrapper isShadow>
          <SectionHeader size="xl" title="System Parameters" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TextField
              label="Number of Turbines"
              type="number"
              step="1"
              placeholder="e.g. 1"
              register={register}
              name="system.turbine_count"
              error={errors.system?.turbine_count?.message}
            />
          </div>
        </CommonBorderWrapper>

        <CommonBorderWrapper isShadow>
          <SectionHeader size="xl" title="Demand Parameters" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TextField
              label="Monthly Energy (kWh)"
              type="number"
              step="1"
              placeholder="e.g. 1520"
              register={register}
              name="demand.monthly_energy_kwh"
              error={errors.demand?.monthly_energy_kwh?.message}
            />
            <TextField
              label="Annual Energy (kWh)"
              type="number"
              step="1"
              placeholder="e.g. 18250"
              register={register}
              name="demand.annual_energy_kwh"
              error={errors.demand?.annual_energy_kwh?.message}
            />
          </div>
        </CommonBorderWrapper>

        <CommonBorderWrapper isShadow>
          <SectionHeader size="xl" title="Operating Parameters" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TextField
              label="Annual Operating Hours"
              type="number"
              step="1"
              placeholder="e.g. 8760"
              register={register}
              name="operating.annual_operating_hours"
              error={errors.operating?.annual_operating_hours?.message}
            />
            <TextField
              label="Availability Factor (0–1)"
              type="number"
              step="0.01"
              placeholder="e.g. 1"
              register={register}
              name="operating.availability_factor"
              error={errors.operating?.availability_factor?.message}
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
              placeholder="e.g. 15200"
              register={register}
              name="financial.system_cost"
              error={errors.financial?.system_cost?.message}
            />
            <TextField
              label="Tax Credit Percentage (0–1)"
              type="number"
              step="0.01"
              placeholder="e.g. 0.3"
              register={register}
              name="financial.tax_credit_percentage"
              error={errors.financial?.tax_credit_percentage?.message}
            />
            <TextField
              label="Electricity Tariff Rate ($/kWh)"
              type="number"
              step="0.001"
              placeholder="e.g. 0.168"
              register={register}
              name="financial.electricity_tariff_rate"
              error={errors.financial?.electricity_tariff_rate?.message}
            />
            <TextField
              label="Annual O&M Cost ($)"
              type="number"
              step="1"
              placeholder="e.g. 200"
              register={register}
              name="financial.om_cost_annual"
              error={errors.financial?.om_cost_annual?.message}
            />
            <TextField
              label="Project Lifetime (years)"
              type="number"
              step="1"
              placeholder="e.g. 25"
              register={register}
              name="financial.project_lifetime_years"
              error={errors.financial?.project_lifetime_years?.message}
            />
          </div>
        </CommonBorderWrapper>

        <CommonBorderWrapper isShadow>
          <SectionHeader size="xl" title="Grid Parameters" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <SelectField
              label="Connection Type"
              name="grid.connection_type"
              control={control}
              options={connectionTypeOptions}
              error={errors.grid?.connection_type?.message}
            />
            <TextField
              label="Emissions Factor (kg CO₂/kWh)"
              type="number"
              step="0.01"
              placeholder="e.g. 0.5"
              register={register}
              name="grid.emissions_factor_kg_co2_per_kwh"
              error={errors.grid?.emissions_factor_kg_co2_per_kwh?.message}
            />
            <TextField
              label="CO₂ Absorbed per Tree/Year (kg)"
              type="number"
              step="0.1"
              placeholder="e.g. 21.8"
              register={register}
              name="grid.kg_co2_absorbed_per_tree_year"
              error={errors.grid?.kg_co2_absorbed_per_tree_year?.message}
            />
          </div>
        </CommonBorderWrapper>

        <div className="w-full flex justify-end gap-3">
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
          >
            Evaluate Wind Turbine
          </CommonButton>
        </div>
      </form>
    </div>
  );
};

export default WindTurbineForm;
