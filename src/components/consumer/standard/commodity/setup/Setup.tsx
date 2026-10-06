import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import CommonSelect, { SelectOption } from "@/common/button/CommonSelect";
import Separator from "@/common/form/Separator";
import SectionHeader from "@/common/header/SectionHeader";
import Spinner from "@/common/loading/Spinner";
import BMiniCard from "@/components/consumer/basic/building/card/BMiniCard";
import ImageDropzone from "@/components/consumer/basic/building/ImageDropzone";
import Welcome from "@/components/consumer/basic/dashboard/Welcome";
import { inputClass } from "@/pages/Login";
import type { UserBuilding } from "@/store/consumer/basic/building/types/building";
import {
  CommoditySetupFormValues,
  ENERGY_PLANS,
  EnergyPlanType,
  getEnergyPlan,
} from "@/store/consumer/standard/commoditySetup/schema/commoditySetupSchema";
import type { UtilityBill } from "@/store/consumer/standard/commoditySetup/types/commoditySetup";
import { Building2, FileText, TrendingUp, Zap } from "lucide-react";
import { Controller, UseFormReturn, useWatch } from "react-hook-form";
import {
  applyBuildingUtilities,
  applySelectedUtility,
  getCommodityUtilities,
  toUtilitySelectOptions,
} from "./buildingUtilities";
import EnergyPlanCard from "./EnergyPlanCard";

interface SetupProps {
  form: UseFormReturn<CommoditySetupFormValues>;
  buildings: UserBuilding[];
  utilityBills: UtilityBill[];
  billFile: File | null;
  onBillFileSelect: (file: File) => void;
  isSaving: boolean;
  isLoading: boolean;

  onSubmit: () => void;
}

interface Option {
  label: string;
  value: string;
}

const TARIFF_OPTIONS: SelectOption<string>[] = ENERGY_PLANS.map((plan) => ({
  label: plan.label,
  value: plan.label,
}));

const withCurrentValue = (options: Option[], value: string): Option[] =>
  !value || options.some((option) => option.value === value)
    ? options
    : [...options, { label: value, value }];

const formatUsage = (value: number) =>
  Number.isFinite(value) ? `${value.toLocaleString()} kWh` : "—";

const formatRate = (value: number) =>
  Number.isFinite(value) ? `$${value}` : "—";

const formatCost = (usage: number, rate: number) =>
  Number.isFinite(usage) && Number.isFinite(rate)
    ? `$${(usage * rate).toFixed(2)}`
    : "—";

const Setup: React.FC<SetupProps> = ({
  form,
  buildings,
  utilityBills,
  billFile,
  onBillFileSelect,
  isSaving,
  isLoading,
  onSubmit,
}) => {
  const {
    register,
    control,
    formState: { errors, isSubmitted, touchedFields },
  } = form;

  const showError = (error?: { message?: string }, isTouched?: boolean) =>
    Boolean(error && (isSubmitted || isTouched));

  const buildingId = useWatch({ control, name: "buildingId" });
  const selectedPlanType = useWatch({
    control,
    name: "selectedEnergyPlanType",
  });
  const electricity = useWatch({ control, name: "electricity" });
  const naturalGas = useWatch({ control, name: "naturalGas" });
  const peakUsageWindow = useWatch({ control, name: "peakUsageWindow" });

  const selectedBuilding = buildings.find(
    (building) => building.user_building_details_id === buildingId,
  );

  const buildingOptions = withCurrentValue(
    buildings.map((building) => ({
      label: [building.building_name, building.city]
        .filter(Boolean)
        .join(" — "),
      value: building.user_building_details_id,
    })),
    buildingId,
  );

  const electricityUtilityOptions = toUtilitySelectOptions(
    getCommodityUtilities(selectedBuilding, "electricity"),
    electricity?.utilityCompanyId,
    electricity?.providerName,
  );

  const gasUtilityOptions = toUtilitySelectOptions(
    getCommodityUtilities(selectedBuilding, "gas"),
    naturalGas?.utilityCompanyId,
    naturalGas?.providerName,
  );

  const rates = {
    standardRate: Number(electricity?.standardRate),
    peakRate: Number(electricity?.peakRate),
    offPeakRate: Number(electricity?.offPeakRate),
  };

  const handlePlanSelect = (type: EnergyPlanType) => {
    const plan = getEnergyPlan(type);
    form.setValue("selectedEnergyPlanType", type, { shouldValidate: true });
    form.setValue("electricity.tariffType", plan.label, {
      shouldValidate: true,
    });
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <Welcome
        title="Energy Commodity Setup"
        description="Professional utility configuration and rate structure management"
        className="border-[rgba(45,173,0,0.20)] bg-[linear-gradient(90deg,_rgba(45,173,0,0.10)_0%,_#EAF7E6_100%)]"
        Icons={Building2}
        iconColor="text-green-600"
        iconBg="bg-white"
      />
      {isLoading ? (
        <Spinner size="xl" text="Loading commodity setup" />
      ) : (
        <>
          <CommonBorderWrapper isShadow>
            <SectionHeader
              size="xl"
              title="Electricity Provider Configuration"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className={inputClass.label}>Building</label>
                <Controller
                  control={control}
                  name="buildingId"
                  render={({ field }) => (
                    <CommonSelect
                      value={field.value}
                      onValueChange={(value) =>
                        applyBuildingUtilities(form, buildings, value)
                      }
                      item={buildingOptions}
                      placeholder="Select a building"
                      className="w-full"
                      disabled={buildings.length === 0}
                    />
                  )}
                />
                {showError(errors.buildingId, touchedFields.buildingId) && (
                  <p className={inputClass.error}>
                    {errors.buildingId?.message}
                  </p>
                )}
                {buildings.length === 0 && (
                  <p className="text-sm text-[#758179] mt-1">
                    Create a building first so utility companies can be loaded.
                  </p>
                )}
              </div>

              <div>
                <label className={inputClass.label}>Electricity Provider</label>
                <Controller
                  control={control}
                  name="electricity.utilityCompanyId"
                  render={({ field }) => (
                    <CommonSelect
                      value={field.value}
                      onValueChange={(value) =>
                        applySelectedUtility(
                          form,
                          selectedBuilding,
                          "electricity",
                          value,
                        )
                      }
                      item={electricityUtilityOptions}
                      placeholder="Select electricity provider"
                      className="w-full"
                      disabled={!buildingId}
                    />
                  )}
                />
                {showError(
                  errors.electricity?.utilityCompanyId,
                  touchedFields.electricity?.utilityCompanyId,
                ) && (
                  <p className={inputClass.error}>
                    {errors.electricity?.utilityCompanyId?.message}
                  </p>
                )}
              </div>

              <div>
                <label className={inputClass.label}>
                  Utility Account Number
                </label>
                <input
                  type="text"
                  placeholder="EL-2024-892341"
                  className={inputClass.input}
                  {...register("electricity.utilityAccountNumber")}
                />
                {showError(
                  errors.electricity?.utilityAccountNumber,
                  touchedFields.electricity?.utilityAccountNumber,
                ) && (
                  <p className={inputClass.error}>
                    {errors.electricity?.utilityAccountNumber?.message}
                  </p>
                )}
              </div>

              <div>
                <label className={inputClass.label}>
                  Utility Service Territory
                </label>
                <input
                  type="text"
                  className={inputClass.input}
                  {...register("electricity.serviceTerritory")}
                />
                {showError(
                  errors.electricity?.serviceTerritory,
                  touchedFields.electricity?.serviceTerritory,
                ) && (
                  <p className={inputClass.error}>
                    {errors.electricity?.serviceTerritory?.message}
                  </p>
                )}
              </div>

              <div>
                <label className={inputClass.label}>Tariff Type</label>
                <Controller
                  control={control}
                  name="electricity.tariffType"
                  render={({ field }) => (
                    <CommonSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      item={withCurrentValue(TARIFF_OPTIONS, field.value)}
                      placeholder="Select tariff type"
                      className="w-full"
                    />
                  )}
                />
                {showError(
                  errors.electricity?.tariffType,
                  touchedFields.electricity?.tariffType,
                ) && (
                  <p className={inputClass.error}>
                    {errors.electricity?.tariffType?.message}
                  </p>
                )}
              </div>
            </div>

            <Separator />
            <div className="space-y-2">
              <SectionHeader size="lg" title="Rate Structure" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className={inputClass.label}>
                    Standard Rate ($/kWh)
                  </label>
                  <input
                    type="text"
                    className={inputClass.input}
                    {...register("electricity.standardRate")}
                  />
                  {showError(
                    errors.electricity?.standardRate,
                    touchedFields.electricity?.standardRate,
                  ) && (
                    <p className={inputClass.error}>
                      {errors.electricity?.standardRate?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={inputClass.label}>Peak Rate ($/kWh)</label>
                  <input
                    type="text"
                    className={inputClass.input}
                    {...register("electricity.peakRate")}
                  />
                  {showError(
                    errors.electricity?.peakRate,
                    touchedFields.electricity?.peakRate,
                  ) && (
                    <p className={inputClass.error}>
                      {errors.electricity?.peakRate?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={inputClass.label}>
                    Off-Peak Rate ($/kWh)
                  </label>
                  <input
                    type="text"
                    className={inputClass.input}
                    {...register("electricity.offPeakRate")}
                  />
                  {showError(
                    errors.electricity?.offPeakRate,
                    touchedFields.electricity?.offPeakRate,
                  ) && (
                    <p className={inputClass.error}>
                      {errors.electricity?.offPeakRate?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />
            <div className="space-y-2">
              <SectionHeader size="lg" title="Consumption Data" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={inputClass.label}>
                    Monthly Consumption (kWh)
                  </label>
                  <input
                    type="text"
                    className={inputClass.input}
                    {...register("electricity.monthlyConsumptionKwh")}
                  />
                  {showError(
                    errors.electricity?.monthlyConsumptionKwh,
                    touchedFields.electricity?.monthlyConsumptionKwh,
                  ) && (
                    <p className={inputClass.error}>
                      {errors.electricity?.monthlyConsumptionKwh?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={inputClass.label}>
                    Annual Consumption (kWh)
                  </label>
                  <input
                    type="text"
                    className={inputClass.input}
                    {...register("electricity.annualConsumptionKwh")}
                  />
                  {showError(
                    errors.electricity?.annualConsumptionKwh,
                    touchedFields.electricity?.annualConsumptionKwh,
                  ) && (
                    <p className={inputClass.error}>
                      {errors.electricity?.annualConsumptionKwh?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={inputClass.label}>Peak Usage Window</label>
                  <input
                    type="text"
                    placeholder="6-9 PM"
                    className={inputClass.input}
                    {...register("peakUsageWindow")}
                  />
                  {showError(
                    errors.peakUsageWindow,
                    touchedFields.peakUsageWindow,
                  ) && (
                    <p className={inputClass.error}>
                      {errors.peakUsageWindow?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CommonBorderWrapper>

          <CommonBorderWrapper isShadow>
            <SectionHeader
              size="xl"
              title="Natural Gas Provider Configuration"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={inputClass.label}>Natural Gas Provider</label>
                <Controller
                  control={control}
                  name="naturalGas.utilityCompanyId"
                  render={({ field }) => (
                    <CommonSelect
                      value={field.value}
                      onValueChange={(value) =>
                        applySelectedUtility(
                          form,
                          selectedBuilding,
                          "gas",
                          value,
                        )
                      }
                      item={gasUtilityOptions}
                      placeholder="Select natural gas provider"
                      className="w-full"
                      disabled={!buildingId}
                    />
                  )}
                />
                {showError(
                  errors.naturalGas?.utilityCompanyId,
                  touchedFields.naturalGas?.utilityCompanyId,
                ) && (
                  <p className={inputClass.error}>
                    {errors.naturalGas?.utilityCompanyId?.message}
                  </p>
                )}
              </div>
              <div>
                <label className={inputClass.label}>
                  Utility Account Number
                </label>
                <input
                  type="text"
                  placeholder="GA-2024-892341"
                  className={inputClass.input}
                  {...register("naturalGas.utilityAccountNumber")}
                />
                {showError(
                  errors.naturalGas?.utilityAccountNumber,
                  touchedFields.naturalGas?.utilityAccountNumber,
                ) && (
                  <p className={inputClass.error}>
                    {errors.naturalGas?.utilityAccountNumber?.message}
                  </p>
                )}
              </div>
              <div>
                <label className={inputClass.label}>
                  Utility Service Territory
                </label>
                <input
                  type="text"
                  className={inputClass.input}
                  {...register("naturalGas.serviceTerritory")}
                />
                {showError(
                  errors.naturalGas?.serviceTerritory,
                  touchedFields.naturalGas?.serviceTerritory,
                ) && (
                  <p className={inputClass.error}>
                    {errors.naturalGas?.serviceTerritory?.message}
                  </p>
                )}
              </div>
              <div>
                <label className={inputClass.label}>Tariff Type</label>
                <Controller
                  control={control}
                  name="naturalGas.tariffType"
                  render={({ field }) => (
                    <CommonSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      item={withCurrentValue(TARIFF_OPTIONS, field.value)}
                      placeholder="Select tariff type"
                      className="w-full"
                    />
                  )}
                />
                {showError(
                  errors.naturalGas?.tariffType,
                  touchedFields.naturalGas?.tariffType,
                ) && (
                  <p className={inputClass.error}>
                    {errors.naturalGas?.tariffType?.message}
                  </p>
                )}
              </div>
            </div>
          </CommonBorderWrapper>

          <CommonBorderWrapper isShadow>
            <SectionHeader size="xl" title="Utility Bill Upload" />
            <ImageDropzone
              accept=".pdf,.jpg,.jpeg,.png"
              label="Drag and drop or click to browse (PDF, JPG, PNG)"
              onFileSelect={onBillFileSelect}
              description="Upload your utility bill"
            />
            {billFile && (
              <p className="text-sm text-[#112518]">
                Selected file:{" "}
                <span className="font-medium">{billFile.name}</span>
              </p>
            )}
            {utilityBills.length > 0 && (
              <div className="space-y-3">
                <SectionHeader size="lg" title="Uploaded bills" />
                <div className="space-y-2">
                  {utilityBills.map((bill) => (
                    <a
                      key={bill.id}
                      href={bill.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 rounded-xl border border-[#E7E9E8] px-4 py-3 hover:border-gray-300"
                    >
                      <FileText className="w-5 h-5 text-green-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#112518] truncate">
                          {bill.fileName}
                        </p>
                        <p className="text-xs text-[#758179]">
                          {new Date(bill.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </CommonBorderWrapper>

          <CommonBorderWrapper isShadow>
            <SectionHeader size="lg" title="Historical Usage Summary" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <BMiniCard
                icon={Zap}
                iconColorClassName="text-green-600"
                iconBgClassName="bg-green-600/20"
                label="Monthly Usage"
                value={formatUsage(Number(electricity?.monthlyConsumptionKwh))}
              />
              <BMiniCard
                icon={TrendingUp}
                iconColorClassName="text-green-600"
                iconBgClassName="bg-green-600/20"
                label="Peak Usage"
                value={peakUsageWindow || "—"}
              />
              <BMiniCard
                icon={Zap}
                iconColorClassName="text-green-600"
                iconBgClassName="bg-green-600/20"
                label="Current Rate"
                value={formatRate(Number(electricity?.standardRate))}
              />
              <BMiniCard
                icon={TrendingUp}
                iconColorClassName="text-green-600"
                iconBgClassName="bg-green-600/20"
                label="Monthly Cost"
                value={formatCost(
                  Number(electricity?.monthlyConsumptionKwh),
                  Number(electricity?.standardRate),
                )}
              />
            </div>
          </CommonBorderWrapper>

          <CommonBorderWrapper isShadow>
            <SectionHeader size="lg" title="Select Energy Plan (Optional)" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ENERGY_PLANS.map((plan) => (
                <EnergyPlanCard
                  key={plan.type}
                  title={plan.label}
                  rate={plan.rateLabel(rates)}
                  description={plan.description}
                  features={plan.features}
                  selected={selectedPlanType === plan.type}
                  onClick={() => handlePlanSelect(plan.type)}
                />
              ))}
            </div>
          </CommonBorderWrapper>

          <CommonButton
            type="submit"
            className="w-full"
            isLoading={isSaving}
            loadingText="Saving..."
          >
            Continue to Renewable System Sizing
          </CommonButton>
        </>
      )}
    </form>
  );
};

export default Setup;
