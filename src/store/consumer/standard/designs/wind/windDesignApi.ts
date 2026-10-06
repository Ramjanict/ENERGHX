import { baseAPI } from "@/store/baseApi/baseApi";
import {
  GetWindProductsParams,
  SolveWindDesignPayload,
  SolveWindDesignResponse,
  WindCategoriesResponse,
  WindProductDetailResponse,
  WindProductsResponse,
} from "./types/windDesign";

export const windDesignApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getWindCategories: build.query<WindCategoriesResponse, void>({
      query: () => ({
        url: `/workflows/consumer/standard/designs/wind/categories`,
        method: "GET",
      }),
      providesTags: ["WindCategories"],
    }),

    getWindProducts: build.query<WindProductsResponse, GetWindProductsParams>({
      query: (params) => ({
        url: `/workflows/consumer/standard/designs/wind/products`,
        method: "GET",
        params,
      }),
      providesTags: ["WindProducts"],
    }),

    getWindProductById: build.query<WindProductDetailResponse, number>({
      query: (productId) => ({
        url: `/workflows/consumer/standard/designs/wind/products/${productId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, productId) => [
        { type: "WindProducts", id: productId },
      ],
    }),

    solveWindDesign: build.mutation<
      SolveWindDesignResponse,
      SolveWindDesignPayload
    >({
      query: (payload) => ({
        url: `/workflows/consumer/standard/designs/wind/solve`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetWindCategoriesQuery,
  useGetWindProductsQuery,
  useGetWindProductByIdQuery,
  useSolveWindDesignMutation,
} = windDesignApi;
