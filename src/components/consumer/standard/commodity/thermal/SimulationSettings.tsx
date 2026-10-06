import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonHeader from "@/common/header/CommonHeader";
import SectionHeader from "@/common/header/SectionHeader";
import RadioOptionCard from "@/components/consumer/standard/commodity/thermal/RadioOptionCard";
import { inputClass } from "@/pages/Login";
import {
  buildAnalysisType,
  buildGridResolution,
  ThermalFormValues,
} from "@/store/consumer/standard/Simulations/schema/fvm/thermalSchema";
import { Box } from "lucide-react";
import React from "react";
import { Controller, UseFormReturn, useWatch } from "react-hook-form";
import { TbBoxMargin } from "react-icons/tb";

interface Props {
  form: UseFormReturn<ThermalFormValues>;
}

const SimulationSettings: React.FC<Props> = ({ form }) => {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const values = useWatch({ control });
  const gridResolution = buildGridResolution({
    ...form.getValues(),
    ...values,
  } as ThermalFormValues);
  const analysisType = buildAnalysisType({
    ...form.getValues(),
    ...values,
  } as ThermalFormValues);

  return (
    <CommonBorderWrapper isShadow>
      <CommonHeader size="xl">Simulation Settings</CommonHeader>

      <div>
        <label className={inputClass.label}>Convergence Tolerance</label>
        <input
          type="text"
          className={inputClass.input}
          {...register("convergenceTolerance")}
        />
        <p className="text-xs text-[#758179] mt-1">
          Maximum acceptable error threshold
        </p>
        {errors.convergenceTolerance && (
          <p className="text-sm text-red-500 mt-1">
            {errors.convergenceTolerance.message}
          </p>
        )}
      </div>

      <div>
        <label className={inputClass.label}>Maximum Iterations</label>
        <input
          type="text"
          className={inputClass.input}
          {...register("maximumIterations")}
        />
        <p className="text-xs text-[#758179] mt-1">
          Computational limit for convergence
        </p>
        {errors.maximumIterations && (
          <p className="text-sm text-red-500 mt-1">
            {errors.maximumIterations.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className={inputClass.label}>Grid Nodes (X)</label>
          <input
            type="text"
            className={inputClass.input}
            {...register("gridNx")}
          />
          {errors.gridNx && (
            <p className="text-sm text-red-500 mt-1">{errors.gridNx.message}</p>
          )}
        </div>
        <div>
          <label className={inputClass.label}>Grid Nodes (Y)</label>
          <input
            type="text"
            className={inputClass.input}
            {...register("gridNy")}
          />
          {errors.gridNy && (
            <p className="text-sm text-red-500 mt-1">{errors.gridNy.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className={inputClass.label}>Solver Type</label>
        <input
          type="text"
          className={inputClass.input}
          {...register("solverType")}
        />
        {errors.solverType && (
          <p className="text-sm text-red-500 mt-1">
            {errors.solverType.message}
          </p>
        )}
      </div>

      <div className="rounded-xl bg-white border border-[#E7E9E8]">
        <div className="flex items-center gap-2 mb-4 bg-[#EAF7E6]/40 p-4">
          <TbBoxMargin className="text-2xl text-primary" />
          <SectionHeader size="md" title="Simulation Solver Configuration" />
        </div>

        <div className="space-y-3 p-4">
          <p className="text-xs font-semibold text-[#758179] uppercase mb-2">
            Simulation Method
          </p>
          <Controller
            control={control}
            name="simulationMethod"
            render={({ field }) => (
              <>
                <RadioOptionCard
                  title="Finite Volume Method (FVM)"
                  description="Suitable for heat transfer, airflow, and energy conservation simulations."
                  selected={field.value === "FVM"}
                  onClick={() => field.onChange("FVM")}
                />
                <RadioOptionCard
                  title="Finite Element Method (FEM)"
                  description="Suitable for complex geometries and high-precision thermal analysis."
                  selected={field.value === "FEM"}
                  onClick={() => field.onChange("FEM")}
                />
              </>
            )}
          />
        </div>

        <p className="text-xs font-semibold text-[#758179] uppercase mb-2 px-4">
          Simulation Dimension
        </p>
        <Controller
          control={control}
          name="simulationDimension"
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-0 border border-[#E7E9E8] rounded-xl overflow-hidden m-4">
              <button
                type="button"
                onClick={() => field.onChange("2D")}
                className={`flex cursor-pointer items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
                  field.value === "2D"
                    ? "bg-[#EAF7E6]/50 text-[#112518]"
                    : "bg-white text-[#758179] hover:bg-gray-50"
                }`}
              >
                <Box className="w-4 h-4" />
                2D Simulation
              </button>
              <button
                type="button"
                onClick={() => field.onChange("3D")}
                className={`flex cursor-pointer items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors border-l border-[#E7E9E8] ${
                  field.value === "3D"
                    ? "bg-[#EAF7E6]/50 text-[#112518]"
                    : "bg-white text-[#758179] hover:bg-gray-50"
                }`}
              >
                <Box className="w-4 h-4" />
                3D Simulation
              </button>
            </div>
          )}
        />
      </div>

      <div className="rounded-xl bg-green-50 border border-[#E7E9E8] p-5">
        <SectionHeader size="md" title="Simulation Configuration" />
        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
          <div>
            <p className="text-[#758179] mb-1">Grid Resolution</p>
            <p className="font-bold text-[#112518]">{gridResolution}</p>
          </div>
          <div>
            <p className="text-[#758179] mb-1">Analysis Type</p>
            <p className="font-bold text-[#112518]">{analysisType}</p>
          </div>
          <div>
            <p className="text-[#758179] mb-1">Solver Type</p>
            <p className="font-bold text-[#112518]">
              {values.solverType || "--"}
            </p>
          </div>
          <div>
            <p className="text-[#758179] mb-1">Est. Runtime</p>
            <p className="font-bold text-[#112518]">
              ~{values.estimatedRuntimeSeconds ?? "--"} sec
            </p>
          </div>
        </div>
      </div>
    </CommonBorderWrapper>
  );
};

export default SimulationSettings;
