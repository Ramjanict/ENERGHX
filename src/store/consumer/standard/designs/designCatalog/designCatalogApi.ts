import { baseAPI } from "@/store/baseApi/baseApi";
import {
  GetDesignCatalogByIdResponse,
  GetDesignCatalogsParams,
  GetDesignCatalogsResponse,
  GetDesignProductByIdResponse,
  GetDesignProductCategoriesParams,
  GetDesignProductCategoriesResponse,
  GetDesignProductCategoryByIdResponse,
  GetDesignProductsParams,
  GetDesignProductsResponse,
} from "./types/designCatalog";

export const designCatalogApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getDesignCatalogs: build.query<
      GetDesignCatalogsResponse,
      GetDesignCatalogsParams | void
    >({
      query: (params) => ({
        url: "/workflows/design-catalogs",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["DesignCatalogs"],
    }),

    getDesignCatalogById: build.query<GetDesignCatalogByIdResponse, string>({
      query: (id) => ({
        url: `/workflows/design-catalogs/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "DesignCatalogs", id }],
    }),

    getDesignProductCategories: build.query<
      GetDesignProductCategoriesResponse,
      GetDesignProductCategoriesParams | void
    >({
      query: (params) => ({
        url: "/workflows/design-product-categories",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["DesignProductCategories"],
    }),

    getDesignProductCategoryById: build.query<
      GetDesignProductCategoryByIdResponse,
      string
    >({
      query: (id) => ({
        url: `/workflows/design-product-categories/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "DesignProductCategories", id },
      ],
    }),

    getDesignProducts: build.query<
      GetDesignProductsResponse,
      GetDesignProductsParams | void
    >({
      query: (params) => ({
        url: "/workflows/design-products",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["DesignProducts"],
    }),

    getDesignProductById: build.query<GetDesignProductByIdResponse, string>({
      query: (id) => ({
        url: `/workflows/design-products/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "DesignProducts", id }],
    }),
  }),
});

export const {
  useGetDesignCatalogsQuery,
  useGetDesignCatalogByIdQuery,
  useGetDesignProductCategoriesQuery,
  useGetDesignProductCategoryByIdQuery,
  useGetDesignProductsQuery,
  useGetDesignProductByIdQuery,
} = designCatalogApi;
