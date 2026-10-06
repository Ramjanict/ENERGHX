import { baseAPI } from "@/store/baseApi/baseApi";
import {
  SolveBatteryDesignPayload,
  SolveBatteryDesignResponse,
  SolveBiomassDesignPayload,
  SolveBiomassDesignResponse,
  SolveEvDesignPayload,
  SolveEvDesignResponse,
  SolveHvacDesignPayload,
  SolveHvacDesignResponse,
  SolveSolarDesignPayload,
  SolveSolarDesignResponse,
  SolveWindDesignPayload,
  SolveWindDesignResponse,
} from "./types";

export const designPostApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    computeSolarDesign: build.mutation<
      SolveSolarDesignResponse,
      SolveSolarDesignPayload
    >({
      query: (payload) => ({
        url: "/workflows/consumer/standard/designs/solar/solve",
        method: "POST",
        body: payload,
      }),
    }),

    computeWindDesign: build.mutation<
      SolveWindDesignResponse,
      SolveWindDesignPayload
    >({
      query: (payload) => ({
        url: "/workflows/consumer/standard/designs/wind/solve",
        method: "POST",
        body: payload,
      }),
    }),

    computeBiomassDesign: build.mutation<
      SolveBiomassDesignResponse,
      SolveBiomassDesignPayload
    >({
      query: (payload) => ({
        url: "/workflows/consumer/standard/designs/biomass/solve",
        method: "POST",
        body: payload,
      }),
    }),

    computeEvDesign: build.mutation<
      SolveEvDesignResponse,
      SolveEvDesignPayload
    >({
      query: (payload) => ({
        url: "/workflows/consumer/standard/designs/ev/solve",
        method: "POST",
        body: payload,
      }),
    }),

    computeHvacDesign: build.mutation<
      SolveHvacDesignResponse,
      SolveHvacDesignPayload
    >({
      query: (payload) => ({
        url: "/workflows/consumer/standard/designs/hvac/solve",
        method: "POST",
        body: payload,
      }),
    }),

    computeBatteryDesign: build.mutation<
      SolveBatteryDesignResponse,
      SolveBatteryDesignPayload
    >({
      query: (payload) => ({
        url: "/workflows/consumer/standard/designs/battery/solve",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useComputeSolarDesignMutation,
  useComputeWindDesignMutation,
  useComputeBiomassDesignMutation,
  useComputeEvDesignMutation,
  useComputeHvacDesignMutation,
  useComputeBatteryDesignMutation,
} = designPostApi;
