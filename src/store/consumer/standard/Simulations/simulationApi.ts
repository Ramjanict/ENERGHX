import { baseAPI } from "@/store/baseApi/baseApi";
import {
  GetFvmSimulationResponse,
  RunFvmSimulationPayload,
  RunFvmSimulationResponse,
  UpdateFvmSimulationPayload,
} from "./types/fvm/fvm";
import {
  GetNzebSimulationResponse,
  RunNzebSimulationPayload,
  RunNzebSimulationResponse,
  UpdateNzebSimulationPayload,
} from "./types/nzeb/nzeb";
import {
  GetZevSimulationResponse,
  RunZevSimulationPayload,
  RunZevSimulationResponse,
  UpdateZevSimulationPayload,
} from "./types/zev/zev";

export const simulationApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    // ---------- ZEV ----------
    getZevSimulation: build.query<GetZevSimulationResponse, void>({
      query: () => ({
        url: "/workflows/consumer/standard/simulations/zev",
        method: "GET",
      }),
      providesTags: ["ZevSimulation"],
    }),
    updateZevSimulation: build.mutation<void, UpdateZevSimulationPayload>({
      query: (payload) => ({
        url: "/workflows/consumer/standard/simulations/zev",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["ZevSimulation"],
    }),
    runZevSimulation: build.mutation<
      RunZevSimulationResponse,
      RunZevSimulationPayload
    >({
      query: (payload) => ({
        url: "/analysis/zev/simulation",
        method: "POST",
        body: payload,
      }),
      // The workflow is only refetched once the run result has been persisted
      // by updateZevSimulation, so nothing is invalidated here.
    }),

    // ---------- NZEB ----------
    getNzebSimulation: build.query<GetNzebSimulationResponse, void>({
      query: () => ({
        url: "/workflows/consumer/standard/simulations/nzeb",
        method: "GET",
      }),
      providesTags: ["NzebSimulation"],
    }),
    updateNzebSimulation: build.mutation<void, UpdateNzebSimulationPayload>({
      query: (payload) => ({
        url: "/workflows/consumer/standard/simulations/nzeb",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["NzebSimulation"],
    }),
    runNzebSimulation: build.mutation<
      RunNzebSimulationResponse,
      RunNzebSimulationPayload
    >({
      query: (payload) => ({
        url: "/analysis/nzeb/simulation",
        method: "POST",
        body: payload,
      }),
      // Run-only — same pattern as ZEV; nothing is invalidated here.
    }),
    // ---------- FVM ----------
    getFVMSimulation: build.query<GetFvmSimulationResponse, void>({
      query: () => ({
        url: "/workflows/consumer/standard/simulations/thermal-comfort",
        method: "GET",
      }),
      providesTags: ["FVMSimulation"],
    }),
    updateFVMSimulation: build.mutation<void, UpdateFvmSimulationPayload>({
      query: (payload) => ({
        url: "/workflows/consumer/standard/simulations/thermal-comfort",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["FVMSimulation", "Dashboard"],
    }),
    runFVMSimulation: build.mutation<
      RunFvmSimulationResponse,
      RunFvmSimulationPayload
    >({
      query: (payload) => {
        const method = payload.endpointOptions?.method || payload.simulation.method;
        const dimension = payload.endpointOptions?.dimension || payload.simulation.dimension;

        const is3D = dimension === "3D";
        const isFem = method === "FEM";

        const url = isFem
          ? is3D
            ? "/analysis/3dfem_model/simulate"
            : "/analysis/fem_model/simulate"
          : is3D
            ? "/analysis/3dfvm_model/simulate"
            : "/analysis/fvm/simulate";

        // Exact body matching backend developer's working Postman specification
        const body = {
          building: {
            thermal_conductivity: payload.building.thermal_conductivity,
            domain_width_m: payload.building.domain_width_m,
            domain_height_m: payload.building.domain_height_m,
            boundary_conditions: {
              interior_temp_c: payload.building.boundary_conditions.interior_temp_c,
              exterior_temp_c: payload.building.boundary_conditions.exterior_temp_c,
            },
            density: payload.building.density,
            specific_heat: payload.building.specific_heat,
          },
          simulation: {
            convergence_tolerance: payload.simulation.convergence_tolerance,
            max_iterations: payload.simulation.max_iterations,
            method: "FVM",
            dimension: "2D",
            grid_nx: payload.simulation.grid_nx,
            grid_ny: payload.simulation.grid_ny,
          },
        };

        return {
          url,
          method: "POST",
          body,
        };
      },
      extraOptions: { silent: true },
    }),
  }),
});

export const {
  // ---------- ZEV ----------
  useGetZevSimulationQuery,
  useUpdateZevSimulationMutation,
  useRunZevSimulationMutation,

  // ---------- NZEB ----------
  useGetNzebSimulationQuery,
  useUpdateNzebSimulationMutation,
  useRunNzebSimulationMutation,

  // ---------- FVM ----------
  useGetFVMSimulationQuery,
  useUpdateFVMSimulationMutation,
  useRunFVMSimulationMutation,
} = simulationApi;
