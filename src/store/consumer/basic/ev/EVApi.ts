import { baseAPI } from "@/store/baseApi/baseApi";
import {
  AddVehiclePayload,
  EvDatabaseParams,
  GetEvChargersResponse,
  GetEvDatabaseResponse,
} from "./types/ev";
export const EVApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    addEv: build.mutation<void, AddVehiclePayload>({
      query: (ev) => ({
        url: `/buildings/ev`,
        method: "POST",
        body: ev,
      }),
      invalidatesTags: ["EV"],
    }),
    getEvDatabase: build.query<GetEvDatabaseResponse, EvDatabaseParams>({
      query: (params) => ({
        url: `/buildings/ev/database`,
        method: "GET",
        params,
      }),
      providesTags: ["EV"],
    }),
    getUserEV: build.query<GetEvChargersResponse, void>({
      query: () => ({
        url: `/buildings/ev`,
        method: "GET",
      }),
      providesTags: ["EV"],
    }),
    updateEv: build.mutation<void, { ev_id: string; ev: AddVehiclePayload }>({
      query: ({ ev_id, ev }) => ({
        url: `/buildings/ev/${ev_id}`,
        method: "PATCH",
        body: ev,
      }),
      invalidatesTags: ["EV"],
    }),
    deleteEv: build.mutation<void, string>({
      query: (ev_id) => ({
        url: `/buildings/ev/${ev_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EV"],
    }),
  }),
});

export const {
  useAddEvMutation,
  useUpdateEvMutation,
  useGetEvDatabaseQuery,
  useDeleteEvMutation,

  useGetUserEVQuery,
} = EVApi;
