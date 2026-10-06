import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import SectionHeader from "@/common/header/SectionHeader";
import {
  BiomassFormInput,
  BiomassFormValues,
} from "@/components/consumer/basic/renewable/schema/biomassFormSchema";
import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormReset,
} from "react-hook-form";
import SelectField from "../SelectField";
import TextField from "../TextField";

const feedstockOptions = [
  { label: "Animal Dung", value: "animal_dung" },
  { label: "Crop Residue", value: "crop_residue" },
  { label: "Food Waste", value: "food_waste" },
  { label: "Municipal Solid Waste", value: "municipal_solid_waste" },
];

const priorityOptions = [
  { label: "Electricity", value: "electricity" },
  { label: "Gas", value: "gas" },
  { label: "Heat", value: "heat" },
];

interface BiomassFormProps {
  isLoading: boolean;
  hasAnalyzed: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  control: Control<BiomassFormInput, unknown, BiomassFormValues>;
  register: UseFormRegister<BiomassFormInput>;
  errors: FieldErrors<BiomassFormInput>;
  reset: UseFormReset<BiomassFormInput>;
}

const BiomassForm: React.FC<BiomassFormProps> = ({
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
          <SectionHeader size="xl" title="Feedstock & Priority" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <SelectField
              label="Feedstock Type"
              name="feedstock"
              control={control}
              options={feedstockOptions}
              error={errors.feedstock?.message}
            />
            <SelectField
              label="Energy Priority"
              name="priority"
              control={control}
              options={priorityOptions}
              error={errors.priority?.message}
            />
          </div>
        </CommonBorderWrapper>

        <CommonBorderWrapper isShadow>
          <SectionHeader size="xl" title="Digestion Process" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TextField
              label="Digester Temperature (°C)"
              type="number"
              step="0.1"
              placeholder="e.g. 30"
              register={register}
              name="process.t"
              error={errors.process?.t?.message}
            />
            <TextField
              label="Total Solids TS (0–1)"
              type="number"
              step="0.01"
              placeholder="e.g. 0.3"
              register={register}
              name="process.TS"
              error={errors.process?.TS?.message}
            />
            <TextField
              label="Volatile Solids VS (0–1)"
              type="number"
              step="0.01"
              placeholder="e.g. 0.8"
              register={register}
              name="process.VS"
              error={errors.process?.VS?.message}
            />
            <TextField
              label="Feedstock Added Daily (kg/day)"
              type="number"
              step="1"
              placeholder="e.g. 120"
              register={register}
              name="process.FADin"
              error={errors.process?.FADin?.message}
            />
            <TextField
              label="Methane Yield (m³/ton)"
              type="number"
              step="0.1"
              placeholder="e.g. 236"
              register={register}
              name="process.VADCH4"
              error={errors.process?.VADCH4?.message}
            />
            <TextField
              label="Total Heat Transfer Coefficient"
              type="number"
              step="1"
              placeholder="e.g. 1073"
              register={register}
              name="process.THTC"
              error={errors.process?.THTC?.message}
            />
            <TextField
              label="Digestion Retention Time (sec)"
              type="number"
              step="1"
              placeholder="e.g. 86400"
              register={register}
              name="process.QAD"
              error={errors.process?.QAD?.message}
            />
          </div>
        </CommonBorderWrapper>

        <CommonBorderWrapper isShadow>
          <SectionHeader size="xl" title="Demand Parameters" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TextField
              label="Electricity Demand (kW)"
              type="number"
              step="0.1"
              placeholder="e.g. 5"
              register={register}
              name="demand.ED"
              error={errors.demand?.ED?.message}
            />
            <TextField
              label="Gas Demand (liters/day)"
              type="number"
              step="1"
              placeholder="e.g. 300"
              register={register}
              name="demand.GD"
              error={errors.demand?.GD?.message}
            />
          </div>
        </CommonBorderWrapper>

        <CommonBorderWrapper isShadow>
          <SectionHeader size="xl" title="Conversion Parameters" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TextField
              label="Generator Efficiency (0–1)"
              type="number"
              step="0.01"
              placeholder="e.g. 0.42"
              register={register}
              name="conversion.generator_efficiency"
              error={errors.conversion?.generator_efficiency?.message}
            />
            <TextField
              label="Methane Calorific Value (MJ/m³)"
              type="number"
              step="0.1"
              placeholder="e.g. 35.8"
              register={register}
              name="conversion.methane_calorific_value_mj_m3"
              error={errors.conversion?.methane_calorific_value_mj_m3?.message}
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
              placeholder="e.g. 8000"
              register={register}
              name="operating.annual_operating_hours"
              error={errors.operating?.annual_operating_hours?.message}
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
              placeholder="e.g. 9300"
              register={register}
              name="financial.system_cost"
              error={errors.financial?.system_cost?.message}
            />
            <TextField
              label="Tax Credit Percentage (0–1)"
              type="number"
              step="0.01"
              placeholder="e.g. 0.26"
              register={register}
              name="financial.tax_credit_percentage"
              error={errors.financial?.tax_credit_percentage?.message}
            />
            <TextField
              label="Electricity Tariff Rate ($/kWh)"
              type="number"
              step="0.001"
              placeholder="e.g. 0.16"
              register={register}
              name="financial.electricity_tariff_rate"
              error={errors.financial?.electricity_tariff_rate?.message}
            />
            <TextField
              label="Annual O&M Cost ($)"
              type="number"
              step="1"
              placeholder="e.g. 250"
              register={register}
              name="financial.om_cost_annual"
              error={errors.financial?.om_cost_annual?.message}
            />
          </div>
        </CommonBorderWrapper>

        <CommonBorderWrapper isShadow>
          <SectionHeader size="xl" title="Demand & Market" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TextField
              label="Annual Electricity Demand (kWh)"
              type="number"
              step="1"
              placeholder="e.g. 40000"
              register={register}
              name="market.annual_electricity_demand_kwh"
              error={errors.market?.annual_electricity_demand_kwh?.message}
            />
            <TextField
              label="Local Supplier Count"
              type="number"
              step="1"
              placeholder="e.g. 3"
              register={register}
              name="market.local_supplier_count"
              error={errors.market?.local_supplier_count?.message}
            />
            <TextField
              label="Moisture Content (%)"
              type="number"
              step="0.1"
              placeholder="e.g. 12"
              register={register}
              name="market.moisture_content_percentage"
              error={errors.market?.moisture_content_percentage?.message}
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
            Evaluate Biomass System
          </CommonButton>
        </div>
      </form>
    </div>
  );
};

export default BiomassForm;
