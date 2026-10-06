import { baseAPI } from "@/store/baseApi/baseApi";
import {
  GetSolarProductsParams,
  SolarCategoriesResponse,
  SolarProductDetailResponse,
  SolarProductsResponse,
  SolveSolarDesignPayload,
  SolveSolarDesignResponse,
} from "./types/solarDesign";

export const solarDesignApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getSolarCategories: build.query<SolarCategoriesResponse, void>({
      query: () => ({
        url: `/workflows/consumer/standard/designs/solar/categories`,
        method: "GET",
      }),
      providesTags: ["SolarCategories"],
    }),

    getSolarProducts: build.query<
      SolarProductsResponse,
      GetSolarProductsParams
    >({
      query: (params) => ({
        url: `/workflows/consumer/standard/designs/solar/products`,
        method: "GET",
        params,
      }),
      providesTags: ["SolarProducts"],
    }),

    getSolarProductById: build.query<SolarProductDetailResponse, number>({
      query: (productId) => ({
        url: `/workflows/consumer/standard/designs/solar/products/${productId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, productId) => [
        { type: "SolarProducts", id: productId },
      ],
    }),

    solveSolarDesign: build.mutation<
      SolveSolarDesignResponse,
      SolveSolarDesignPayload
    >({
      query: (payload) => ({
        url: `/workflows/consumer/standard/designs/solar/solve`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetSolarCategoriesQuery,
  useGetSolarProductsQuery,
  useGetSolarProductByIdQuery,
  useSolveSolarDesignMutation,
} = solarDesignApi;
