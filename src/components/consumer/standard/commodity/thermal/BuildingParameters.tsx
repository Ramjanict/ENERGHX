import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonHeader from "@/common/header/CommonHeader";
import SectionHeader from "@/common/header/SectionHeader";
import { inputClass } from "@/pages/Login";
import { ThermalFormValues } from "@/store/consumer/standard/Simulations/schema/fvm/thermalSchema";
import React from "react";
import { UseFormReturn, useWatch } from "react-hook-form";

interface Props {
  form: UseFormReturn<ThermalFormValues>;
}

const BuildingParameters: React.FC<Props> = ({ form }) => {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const interior = useWatch({ control, name: "interiorTemperatureC" });
  const exterior = useWatch({ control, name: "exteriorTemperatureC" });
  const delta = Math.abs(Number(exterior) - Number(interior)) || 0;

  return (
    <CommonBorderWrapper className="bg-[#EAF7E6]/30! border-[#E7E9E8]! space-y-6">
      <CommonHeader size="lg">Building Parameters</CommonHeader>

      <div>
        <label className={inputClass.label}>Thermal Conductivity (W/m·K)</label>
        <input
          type="text"
          className={inputClass.input}
          {...register("thermalConductivityWmK")}
        />
        <p className="text-xs text-[#758179] mt-1">
          Material heat conduction property
        </p>
        {errors.thermalConductivityWmK && (
          <p className="text-sm text-red-500 mt-1">
            {errors.thermalConductivityWmK.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className={inputClass.label}>Domain Width (m)</label>
          <input
            type="text"
            className={inputClass.input}
            {...register("domainWidthM")}
          />
          {errors.domainWidthM && (
            <p className="text-sm text-red-500 mt-1">
              {errors.domainWidthM.message}
            </p>
          )}
        </div>
        <div>
          <label className={inputClass.label}>Domain Height (m)</label>
          <input
            type="text"
            className={inputClass.input}
            {...register("domainHeightM")}
          />
          {errors.domainHeightM && (
            <p className="text-sm text-red-500 mt-1">
              {errors.domainHeightM.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className={inputClass.label}>Density (kg/m³)</label>
          <input
            type="text"
            className={inputClass.input}
            {...register("density")}
          />
          {errors.density && (
            <p className="text-sm text-red-500 mt-1">{errors.density.message}</p>
          )}
        </div>
        <div>
          <label className={inputClass.label}>Specific Heat (J/kg·K)</label>
          <input
            type="text"
            className={inputClass.input}
            {...register("specificHeat")}
          />
          {errors.specificHeat && (
            <p className="text-sm text-red-500 mt-1">
              {errors.specificHeat.message}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-green-50 border border-green-100 p-5">
        <SectionHeader size="md" title="Boundary Conditions" />

        <div className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label className="text-sm text-[#758179] shrink-0">
              Interior Temperature (°C)
            </label>
            <input
              type="text"
              className="w-24 border border-gray-200 p-2 rounded-lg outline-none text-right"
              {...register("interiorTemperatureC")}
            />
          </div>
          {errors.interiorTemperatureC && (
            <p className="text-sm text-red-500">
              {errors.interiorTemperatureC.message}
            </p>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label className="text-sm text-[#758179] shrink-0">
              Exterior Temperature (°C)
            </label>
            <input
              type="text"
              className="w-24 border border-gray-200 p-2 rounded-lg outline-none text-right"
              {...register("exteriorTemperatureC")}
            />
          </div>
          {errors.exteriorTemperatureC && (
            <p className="text-sm text-red-500">
              {errors.exteriorTemperatureC.message}
            </p>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-[#E7E9E8]">
            <span className="text-sm font-semibold text-foreground">
              Temperature Delta (ΔT)
            </span>
            <span className="text-lg font-bold text-green-600">{delta}°C</span>
          </div>
        </div>
      </div>
    </CommonBorderWrapper>
  );
};

export default BuildingParameters;
