import { baseAPI } from "@/store/baseApi/baseApi";
import {
  CreateEngineeringServicePayload,
  GetConsumerEngineeringServicesResponse,
  GetEngineeringServiceByIdResponse,
  GetEngineeringServicesCatalogResponse,
  MutateEngineeringServiceResponse,
  SaveConsumerEngineeringServicesPayload,
  SaveConsumerEngineeringServicesResponse,
  UpdateEngineeringServicePayload,
} from "./types/engineeringServices";

export const engineeringServicesApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    // ---------- Catalog ----------
    getEngineeringServicesCatalog: build.query<
      GetEngineeringServicesCatalogResponse,
      void
    >({
      query: () => ({
        url: "/workflows/engineering-services",
        method: "GET",
      }),
      providesTags: ["EngineeringServicesCatalog"],
    }),

    getEngineeringServiceById: build.query<
      GetEngineeringServiceByIdResponse,
      string
    >({
      query: (id) => ({
        url: `/workflows/engineering-services/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "EngineeringServicesCatalog", id },
      ],
    }),

    createEngineeringService: build.mutation<
      MutateEngineeringServiceResponse,
      CreateEngineeringServicePayload
    >({
      query: (payload) => ({
        url: "/workflows/engineering-services",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["EngineeringServicesCatalog"],
    }),

    updateEngineeringService: build.mutation<
      MutateEngineeringServiceResponse,
      { id: string; body: UpdateEngineeringServicePayload }
    >({
      query: ({ id, body }) => ({
        url: `/workflows/engineering-services/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EngineeringServicesCatalog"],
    }),

    deleteEngineeringService: build.mutation<void, string>({
      query: (id) => ({
        url: `/workflows/engineering-services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EngineeringServicesCatalog"],
    }),

    // ---------- Consumer workflow selection ----------
    getConsumerEngineeringServices: build.query<
      GetConsumerEngineeringServicesResponse,
      void
    >({
      query: () => ({
        url: "/workflows/consumer/standard/engineering-services",
        method: "GET",
      }),
      providesTags: ["ConsumerEngineeringServices"],
    }),

    saveConsumerEngineeringServices: build.mutation<
      SaveConsumerEngineeringServicesResponse,
      SaveConsumerEngineeringServicesPayload
    >({
      query: (payload) => ({
        url: "/workflows/consumer/standard/engineering-services",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ConsumerEngineeringServices", "Dashboard"],
    }),
  }),
});

export const {
  useGetEngineeringServicesCatalogQuery,
  useGetEngineeringServiceByIdQuery,
  useCreateEngineeringServiceMutation,
  useUpdateEngineeringServiceMutation,
  useDeleteEngineeringServiceMutation,
  useGetConsumerEngineeringServicesQuery,
  useSaveConsumerEngineeringServicesMutation,
} = engineeringServicesApi;
