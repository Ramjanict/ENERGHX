import { baseAPI } from "@/store/baseApi/baseApi";
import {
  GetHvacProductsParams,
  HvacCategoriesResponse,
  HvacProductDetailResponse,
  HvacProductsResponse,
  SolveHvacDesignPayload,
  SolveHvacDesignResponse,
} from "./types/hvacDesign";

export const hvacDesignApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getHvacCategories: build.query<HvacCategoriesResponse, void>({
      query: () => ({
        url: `/workflows/consumer/standard/designs/hvac/categories`,
        method: "GET",
      }),
      providesTags: ["HvacCategories"],
    }),

    getHvacProducts: build.query<HvacProductsResponse, GetHvacProductsParams>({
      query: (params) => ({
        url: `/workflows/consumer/standard/designs/hvac/products`,
        method: "GET",
        params,
      }),
      providesTags: ["HvacProducts"],
    }),

    getHvacProductById: build.query<HvacProductDetailResponse, number>({
      query: (productId) => ({
        url: `/workflows/consumer/standard/designs/hvac/products/${productId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, productId) => [
        { type: "HvacProducts", id: productId },
      ],
    }),

    solveHvacDesign: build.mutation<
      SolveHvacDesignResponse,
      SolveHvacDesignPayload
    >({
      query: (payload) => ({
        url: `/workflows/consumer/standard/designs/hvac/solve`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetHvacCategoriesQuery,
  useGetHvacProductsQuery,
  useGetHvacProductByIdQuery,
  useSolveHvacDesignMutation,
} = hvacDesignApi;
