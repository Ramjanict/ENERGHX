import { baseAPI } from "@/store/baseApi/baseApi";
import {
  BatteryCategoriesResponse,
  BatteryProductDetailResponse,
  BatteryProductsResponse,
  GetBatteryProductsParams,
  SolveBatteryDesignPayload,
  SolveBatteryDesignResponse,
} from "./types/batteryDesign";

export const batteryDesignApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getBatteryCategories: build.query<BatteryCategoriesResponse, void>({
      query: () => ({
        url: `/workflows/consumer/standard/designs/battery/categories`,
        method: "GET",
      }),
      providesTags: ["BatteryCategories"],
    }),

    getBatteryProducts: build.query<
      BatteryProductsResponse,
      GetBatteryProductsParams
    >({
      query: (params) => ({
        url: `/workflows/consumer/standard/designs/battery/products`,
        method: "GET",
        params,
      }),
      providesTags: ["BatteryProducts"],
    }),

    getBatteryProductById: build.query<BatteryProductDetailResponse, number>({
      query: (productId) => ({
        url: `/workflows/consumer/standard/designs/battery/products/${productId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, productId) => [
        { type: "BatteryProducts", id: productId },
      ],
    }),

    solveBatteryDesign: build.mutation<
      SolveBatteryDesignResponse,
      SolveBatteryDesignPayload
    >({
      query: (payload) => ({
        url: `/workflows/consumer/standard/designs/battery/solve`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetBatteryCategoriesQuery,
  useGetBatteryProductsQuery,
  useGetBatteryProductByIdQuery,
  useSolveBatteryDesignMutation,
} = batteryDesignApi;
