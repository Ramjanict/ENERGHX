import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonSelect from "@/common/button/CommonSelect";
import SectionHeader from "@/common/header/SectionHeader";
import { inputClass } from "@/pages/Login";
import {
  CHARGING_METHOD_OPTIONS,
  VEHICLE_TYPE_OPTIONS,
  ZevFormValues,
} from "@/store/consumer/standard/Simulations/schema/zev/zevSchema";
import { Controller, UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<ZevFormValues>;
}

interface Option {
  label: string;
  value: string;
}

const withCurrentValue = (options: Option[], value: string): Option[] =>
  !value || options.some((option) => option.value === value)
    ? options
    : [...options, { label: value, value }];

const VehicleChargingConfiguration = ({ form }: Props) => {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CommonBorderWrapper isShadow>
        <SectionHeader size="xl" title="Vehicle Configuration" />
        <div className="space-y-5">
          <div>
            <label className={inputClass.label}>Vehicle Type</label>
            <Controller
              control={control}
              name="vehicleType"
              render={({ field }) => (
                <CommonSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  item={withCurrentValue(VEHICLE_TYPE_OPTIONS, field.value)}
                  placeholder="select"
                  className="w-full"
                />
              )}
            />
            {errors.vehicleType && (
              <p className="text-sm text-red-500 mt-1">
                {errors.vehicleType.message}
              </p>
            )}
          </div>

          <div>
            <label className={inputClass.label}>Battery Capacity (kWh)</label>
            <input
              type="text"
              className={inputClass.input}
              {...register("batteryCapacityKwh")}
            />
            {errors.batteryCapacityKwh && (
              <p className="text-sm text-red-500 mt-1">
                {errors.batteryCapacityKwh.message}
              </p>
            )}
          </div>

          <div>
            <label className={inputClass.label}>Daily Distance (miles)</label>
            <input
              type="text"
              className={inputClass.input}
              {...register("dailyDistanceMiles")}
            />
            {errors.dailyDistanceMiles && (
              <p className="text-sm text-red-500 mt-1">
                {errors.dailyDistanceMiles.message}
              </p>
            )}
          </div>

          <div>
            <label className={inputClass.label}>Vehicle Class</label>
            <input
              type="text"
              className={inputClass.input}
              {...register("vehicleClass")}
            />
            {errors.vehicleClass && (
              <p className="text-sm text-red-500 mt-1">
                {errors.vehicleClass.message}
              </p>
            )}
          </div>
        </div>
      </CommonBorderWrapper>

      <CommonBorderWrapper isShadow>
        <SectionHeader size="xl" title="Charging Configuration" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 ">
          <div>
            <label className={inputClass.label}>Charging Method</label>
            <Controller
              control={control}
              name="chargingMethod"
              render={({ field }) => (
                <CommonSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  item={withCurrentValue(CHARGING_METHOD_OPTIONS, field.value)}
                  placeholder="select"
                  className="w-full"
                />
              )}
            />
            {errors.chargingMethod && (
              <p className="text-sm text-red-500 mt-1">
                {errors.chargingMethod.message}
              </p>
            )}
          </div>

          <div>
            <label className={inputClass.label}>Number of Charging Ports</label>
            <input
              type="text"
              className={inputClass.input}
              {...register("numberOfChargingPorts")}
            />
            {errors.numberOfChargingPorts && (
              <p className="text-sm text-red-500 mt-1">
                {errors.numberOfChargingPorts.message}
              </p>
            )}
          </div>

          <div>
            <label className={inputClass.label}>
              Charging Duration (hours/day)
            </label>
            <input
              type="text"
              className={inputClass.input}
              {...register("chargingDurationHoursPerDay")}
            />
            {errors.chargingDurationHoursPerDay && (
              <p className="text-sm text-red-500 mt-1">
                {errors.chargingDurationHoursPerDay.message}
              </p>
            )}
          </div>

          <div>
            <label className={inputClass.label}>
              Expected Station Uptime (%)
            </label>
            <input
              type="text"
              className={inputClass.input}
              {...register("expectedStationUptimePercent")}
            />
            {errors.expectedStationUptimePercent && (
              <p className="text-sm text-red-500 mt-1">
                {errors.expectedStationUptimePercent.message}
              </p>
            )}
          </div>

          <div>
            <label className={inputClass.label}>
              Average Waiting Time (min)
            </label>
            <input
              type="text"
              className={inputClass.input}
              {...register("averageWaitingTimeMinutes")}
            />
            {errors.averageWaitingTimeMinutes && (
              <p className="text-sm text-red-500 mt-1">
                {errors.averageWaitingTimeMinutes.message}
              </p>
            )}
          </div>

          <div>
            <label className={inputClass.label}>Energy Tariff ($/kWh)</label>
            <input
              type="text"
              className={inputClass.input}
              {...register("energyTariffPerKwh")}
            />
            {errors.energyTariffPerKwh && (
              <p className="text-sm text-red-500 mt-1">
                {errors.energyTariffPerKwh.message}
              </p>
            )}
          </div>
        </div>
      </CommonBorderWrapper>
    </div>
  );
};

export default VehicleChargingConfiguration;
