import { BiomassFormValues } from "@/components/consumer/basic/renewable/schema/biomassFormSchema";
import { SolarFormValues } from "@/components/consumer/basic/renewable/schema/solarPanelSchema";
import { WindFormValues } from "@/components/consumer/basic/renewable/schema/windFormSchema";
import { baseAPI } from "@/store/baseApi/baseApi";
import { BiomassResponse } from "./types/biomas";
import { SolarResponse } from "./types/solar";
import { WindResponse } from "./types/wind";

export const renewableEnergyAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    calculateSolar: build.mutation<SolarResponse, SolarFormValues>({
      query: (data) => ({
        url: `/analysis/solar/calculate`,
        method: "POST",
        body: data,
      }),
    }),

    calculateWind: build.mutation<WindResponse, WindFormValues>({
      query: (data) => ({
        url: `/analysis/wind/calculate`,
        method: "POST",
        body: data,
      }),
    }),

    calculateBiomass: build.mutation<BiomassResponse, BiomassFormValues>({
      query: (data) => ({
        url: `/analysis/biomass/calculate`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useCalculateSolarMutation,
  useCalculateWindMutation,
  useCalculateBiomassMutation,
} = renewableEnergyAPI;
