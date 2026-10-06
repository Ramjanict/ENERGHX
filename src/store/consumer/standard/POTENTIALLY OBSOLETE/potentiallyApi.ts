import { baseAPI } from "@/store/baseApi/baseApi";
import {
  StandardConsumerStatusResponse,
  UtilityConsentPayload,
} from "./types/potentiall";

export const simulationApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getDashboard: build.query<StandardConsumerStatusResponse, void>({
      query: () => ({
        url: "/workflows/consumer/standard/status",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
    utilityPermissions: build.mutation<void, UtilityConsentPayload>({
      query: (body) => ({
        url: "/workflows/consumer/standard/utility-permission",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardQuery, useUtilityPermissionsMutation } =
  simulationApi;
