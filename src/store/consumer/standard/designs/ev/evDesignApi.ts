import { baseAPI } from "@/store/baseApi/baseApi";
import {
  EvCategoriesResponse,
  EvProductDetailResponse,
  EvProductsResponse,
  GetEvProductsParams,
  SolveEvDesignPayload,
  SolveEvDesignResponse,
} from "./types/evDesign";

export const evDesignApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getEvCategories: build.query<EvCategoriesResponse, void>({
      query: () => ({
        url: `/workflows/consumer/standard/designs/ev/categories`,
        method: "GET",
      }),
      providesTags: ["EvCategories"],
    }),

    getEvProducts: build.query<EvProductsResponse, GetEvProductsParams>({
      query: (params) => ({
        url: `/workflows/consumer/standard/designs/ev/products`,
        method: "GET",
        params,
      }),
      providesTags: ["EvProducts"],
    }),

    getEvProductById: build.query<EvProductDetailResponse, number>({
      query: (productId) => ({
        url: `/workflows/consumer/standard/designs/ev/products/${productId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, productId) => [
        { type: "EvProducts", id: productId },
      ],
    }),

    solveEvDesign: build.mutation<SolveEvDesignResponse, SolveEvDesignPayload>({
      query: (payload) => ({
        url: `/workflows/consumer/standard/designs/ev/solve`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetEvCategoriesQuery,
  useGetEvProductsQuery,
  useGetEvProductByIdQuery,
  useSolveEvDesignMutation,
} = evDesignApi;
