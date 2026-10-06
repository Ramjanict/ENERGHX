import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonHeader from "@/common/header/CommonHeader";
import SectionHeader from "@/common/header/SectionHeader";
import { inputClass } from "@/pages/Login";
import { NzebFormValues } from "@/store/consumer/standard/Simulations/schema/nzeb/nzebSchema";
import {
  AlertCircle,
  Battery,
  DollarSign,
  Leaf,
  Sun,
  Wind,
} from "lucide-react";
import React from "react";
import { FieldError, UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<NzebFormValues>;
}

const FieldErrorMessage = ({ error }: { error?: FieldError }) =>
  error ? (
    <p className="text-sm text-red-500 mt-1">{error.message}</p>
  ) : null;

const ModuleConfigs: React.FC<Props> = ({ form }) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CommonBorderWrapper isShadow>
          <CommonHeader size="xl">
            <Sun className="w-5 h-5 text-amber-500" /> Solar Module
          </CommonHeader>

          <div className="space-y-5">
            <div>
              <label className={inputClass.label}>Panel Area (m²)</label>
              <input
                type="text"
                className={inputClass.input}
                {...register("panelAreaM2")}
              />
              <FieldErrorMessage error={errors.panelAreaM2} />
            </div>
            <div>
              <label className={inputClass.label}>PV Efficiency (%)</label>
              <input
                type="text"
                className={inputClass.input}
                {...register("pvEfficiencyPercent")}
              />
              <FieldErrorMessage error={errors.pvEfficiencyPercent} />
            </div>
            <div>
              <label className={inputClass.label}>
                Solar Irradiance (kWh/m²/day)
              </label>
              <input
                type="text"
                className={inputClass.input}
                {...register("solarIrradianceKwhM2Day")}
              />
              <FieldErrorMessage error={errors.solarIrradianceKwhM2Day} />
            </div>
          </div>
        </CommonBorderWrapper>

        <CommonBorderWrapper isShadow>
          <CommonHeader size="xl">
            <Wind className="w-5 h-5 text-blue-500" />
            Wind Module
          </CommonHeader>
          <div className="space-y-5">
            <div>
              <label className={inputClass.label}>Wind Speed (m/s)</label>
              <input
                type="text"
                className={inputClass.input}
                {...register("windSpeedMs")}
              />
              <FieldErrorMessage error={errors.windSpeedMs} />
            </div>
            <div>
              <label className={inputClass.label}>Turbine Size (kW)</label>
              <input
                type="text"
                className={inputClass.input}
                {...register("turbineSizeKw")}
              />
              <FieldErrorMessage error={errors.turbineSizeKw} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={inputClass.label}>Cut-In Speed (m/s)</label>
                <input
                  type="text"
                  className={inputClass.input}
                  {...register("cutInSpeedMs")}
                />
                <FieldErrorMessage error={errors.cutInSpeedMs} />
              </div>
              <div>
                <label className={inputClass.label}>Cut-Out Speed (m/s)</label>
                <input
                  type="text"
                  className={inputClass.input}
                  {...register("cutOutSpeedMs")}
                />
                <FieldErrorMessage error={errors.cutOutSpeedMs} />
              </div>
            </div>
          </div>
        </CommonBorderWrapper>

        <CommonBorderWrapper isShadow>
          <CommonHeader size="xl">
            <Leaf className="w-5 h-5 text-green-600" />
            Biomass Module
          </CommonHeader>
          <div className="space-y-5">
            <div>
              <label className={inputClass.label}>
                Feedstock Mass (kg/day)
              </label>
              <input
                type="text"
                className={inputClass.input}
                {...register("feedstockMassKgDay")}
              />
              <FieldErrorMessage error={errors.feedstockMassKgDay} />
            </div>
            <div>
              <label className={inputClass.label}>Methane Yield (m³/kg)</label>
              <input
                type="text"
                className={inputClass.input}
                {...register("methaneYieldM3Kg")}
              />
              <FieldErrorMessage error={errors.methaneYieldM3Kg} />
            </div>
            <div>
              <label className={inputClass.label}>
                Generator Efficiency (%)
              </label>
              <input
                type="text"
                className={inputClass.input}
                {...register("generatorEfficiencyPercent")}
              />
              <FieldErrorMessage error={errors.generatorEfficiencyPercent} />
            </div>
          </div>
        </CommonBorderWrapper>

        <CommonBorderWrapper isShadow>
          <CommonHeader size="xl">
            <Battery className="w-5 h-5 text-purple-600" />
            Battery Storage Module
          </CommonHeader>

          <div className="space-y-5 mb-5">
            <div>
              <label className={inputClass.label}>Battery Capacity (kWh)</label>
              <input
                type="text"
                className={inputClass.input}
                {...register("batteryCapacityKwh")}
              />
              <FieldErrorMessage error={errors.batteryCapacityKwh} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={inputClass.label}>
                  Charge Efficiency (%)
                </label>
                <input
                  type="text"
                  className={inputClass.input}
                  {...register("chargeEfficiencyPercent")}
                />
                <FieldErrorMessage error={errors.chargeEfficiencyPercent} />
              </div>
              <div>
                <label className={inputClass.label}>
                  Discharge Efficiency (%)
                </label>
                <input
                  type="text"
                  className={inputClass.input}
                  {...register("dischargeEfficiencyPercent")}
                />
                <FieldErrorMessage error={errors.dischargeEfficiencyPercent} />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-[#FAF5FF] border border-[#E9D4FF] p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-[#9810FA] shrink-0 mt-0.5" />
            <div>
              <SectionHeader
                size="md"
                title="Storage Optimization"
                description="Battery stores excess renewable energy for peak demand periods"
              />
            </div>
          </div>
        </CommonBorderWrapper>
      </div>

      <CommonBorderWrapper isShadow>
        <CommonHeader size="xl" className="">
          <DollarSign className="w-5 h-5 text-green-600" />
          Financial Parameters
        </CommonHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className={inputClass.label}>Capital Cost ($)</label>
            <input
              type="text"
              className={inputClass.input}
              {...register("capitalCost")}
            />
            <FieldErrorMessage error={errors.capitalCost} />
          </div>
          <div>
            <label className={inputClass.label}>O&amp;M Cost ($/year)</label>
            <input
              type="text"
              className={inputClass.input}
              {...register("omCostPerYear")}
            />
            <FieldErrorMessage error={errors.omCostPerYear} />
          </div>
          <div>
            <label className={inputClass.label}>Project Life (years)</label>
            <input
              type="text"
              className={inputClass.input}
              {...register("projectLifeYears")}
            />
            <FieldErrorMessage error={errors.projectLifeYears} />
          </div>
          <div>
            <label className={inputClass.label}>Discount Rate (%)</label>
            <input
              type="text"
              className={inputClass.input}
              {...register("discountRatePercent")}
            />
            <FieldErrorMessage error={errors.discountRatePercent} />
          </div>
        </div>
      </CommonBorderWrapper>
    </div>
  );
};

export default ModuleConfigs;
