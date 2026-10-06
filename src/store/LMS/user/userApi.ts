import { baseAPI } from "@/store/baseApi/baseApi";

import {
  CommoditiesResponse,
  CountriesResponse,
  StatesResponse,
  UtilitiesResponse,
} from "./types/countryType";
import {
  AccreditationPayload,
  AllUsersResponse,
  ConsumerDeveloperAssignment,
  ConsumerServerAssignment,
  CountryCurrency,
  StateList,
  UserDeveloperAssignmentResponse,
  UserParams,
  UserServerAssignment,
  UserServerAssignmentResponse,
  UserTypeAndRole,
} from "./types/UserAndAssignTypes";

export const userApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    //country
    addCountry: build.mutation<any, CountryCurrency>({
      query: (country) => ({
        url: "/country",
        method: "POST",
        body: country,
      }),
      invalidatesTags: ["Country"],
    }),
    getAllCountries: build.query<CountriesResponse, void>({
      query: () => ({
        url: `/countries/`,
        method: "GET",
      }),
      providesTags: ["Country"],
    }),
    addState: build.mutation<any, { countryId: string; state: StateList }>({
      query: ({ countryId, state }) => ({
        url: `/countries/${countryId}/states`,
        method: "POST",
        body: state,
      }),
      invalidatesTags: ["State"],
    }),
    getAllStates: build.query<StatesResponse, string>({
      query: (id) => ({
        url: `/countries/${id}/states`,
        method: "GET",
      }),
      providesTags: ["State"],
    }),
    getAllCommodities: build.query<CommoditiesResponse, void>({
      query: () => ({
        url: `/commodities`,
        method: "GET",
      }),
    }),
    getAllServices: build.query<
      UtilitiesResponse,
      { countryId: string; stateId: string; commodityId: string }
    >({
      query: ({ countryId, stateId, commodityId }) => ({
        url: `/countries/${countryId}/state/${stateId}/commodities/${commodityId}/utilities`,
        method: "GET",
      }),
    }),
    // user
    changeStatus: build.mutation<any, AccreditationPayload>({
      query: (status) => ({
        url: `/admin/users-validation`,
        method: "POST",
        body: status,
      }),
      invalidatesTags: ["User"],
    }),
    getAllUsers: build.query<AllUsersResponse, UserParams>({
      query: (params) => ({
        url: `/admin/users/all/`,
        method: "GET",
        params,
      }),
      providesTags: ["User"],
    }),
    getSingleUsers: build.query<void, string>({
      query: (userId) => ({
        url: `/admin/user-details/${userId}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    assignRole: build.mutation<any, UserTypeAndRole>({
      query: (role) => ({
        url: "/admin/assign-roles",
        method: "POST",
        body: role,
      }),
      invalidatesTags: ["User"],
    }),
    assignServer: build.mutation<any, ConsumerServerAssignment>({
      query: (role) => ({
        url: `/admin/assign-server-to-user`,
        method: "POST",
        body: role,
      }),
      invalidatesTags: ["User"],
    }),
    assignDeveloper: build.mutation<any, ConsumerDeveloperAssignment>({
      query: (role) => ({
        url: `/admin/assign-developer-to-user`,
        method: "POST",
        body: role,
      }),
      invalidatesTags: ["User"],
    }),
    getServerAssignments: build.query<UserServerAssignmentResponse, void>({
      query: () => ({
        url: `/admin/user-server-assignments`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getDeveloperAssignments: build.query<UserDeveloperAssignmentResponse, void>(
      {
        query: () => ({
          url: `/admin/user-developer-assignments`,
          method: "GET",
        }),
        providesTags: ["User"],
      },
    ),
    getAvailableServer: build.query<UserServerAssignment, string>({
      query: (serverId) => ({
        url: `/admin/server-assignments/${serverId}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getAvailableDeveloper: build.query<UserServerAssignment, string>({
      query: (developerId) => ({
        url: `/admin/developer-assignments/${developerId}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  //country
  useAddCountryMutation,
  useAddStateMutation,
  useGetAllCountriesQuery,
  useGetAllStatesQuery,
  useLazyGetAllStatesQuery,
  useGetAllCommoditiesQuery,
  useGetAllServicesQuery,

  //user
  useChangeStatusMutation,
  useGetAllUsersQuery,
  useLazyGetAllUsersQuery,
  useGetSingleUsersQuery,
  useLazyGetSingleUsersQuery,
  useAssignRoleMutation,
  // server
  useAssignServerMutation,
  // developer
  useAssignDeveloperMutation,

  // assignments
  useGetServerAssignmentsQuery,
  useGetDeveloperAssignmentsQuery,
  useGetAvailableServerQuery,
  useGetAvailableDeveloperQuery,
} = userApi;
