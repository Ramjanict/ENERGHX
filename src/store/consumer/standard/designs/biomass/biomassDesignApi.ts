import { baseAPI } from "@/store/baseApi/baseApi";
import {
  BiomassCategoriesResponse,
  BiomassProductDetailResponse,
  BiomassProductsResponse,
  GetBiomassProductsParams,
  SolveBiomassDesignPayload,
  SolveBiomassDesignResponse,
} from "./types/biomassDesign";

export const biomassDesignApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getBiomassCategories: build.query<BiomassCategoriesResponse, void>({
      query: () => ({
        url: `/workflows/consumer/standard/designs/biomass/categories`,
        method: "GET",
      }),
      providesTags: ["BiomassCategories"],
    }),

    getBiomassProducts: build.query<
      BiomassProductsResponse,
      GetBiomassProductsParams
    >({
      query: (params) => ({
        url: `/workflows/consumer/standard/designs/biomass/products`,
        method: "GET",
        params,
      }),
      providesTags: ["BiomassProducts"],
    }),

    getBiomassProductById: build.query<BiomassProductDetailResponse, number>({
      query: (productId) => ({
        url: `/workflows/consumer/standard/designs/biomass/products/${productId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, productId) => [
        { type: "BiomassProducts", id: productId },
      ],
    }),

    solveBiomassDesign: build.mutation<
      SolveBiomassDesignResponse,
      SolveBiomassDesignPayload
    >({
      query: (payload) => ({
        url: `/workflows/consumer/standard/designs/biomass/solve`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetBiomassCategoriesQuery,
  useGetBiomassProductsQuery,
  useGetBiomassProductByIdQuery,
  useSolveBiomassDesignMutation,
} = biomassDesignApi;
