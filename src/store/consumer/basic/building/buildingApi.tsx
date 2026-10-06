import { baseAPI } from "@/store/baseApi/baseApi";
import {
  BuildingDetailsResponse,
  CreateBuildingPayload,
  GetAllUserBuildingsResponse,
} from "./types/building";
import {
  GetAllBuildingTypesResponse,
  GetSingleBuildingTypeResponse,
} from "./types/buildingTypes";

export const buildingApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    creatingBuilding: build.mutation<void, CreateBuildingPayload>({
      query: (building) => ({
        url: "/users/buildings",
        method: "POST",
        body: building,
      }),
      invalidatesTags: ["Buildings"],
    }),
    getAllBuildings: build.query<GetAllUserBuildingsResponse, void>({
      query: () => ({
        url: `/users/buildings`,
        method: "GET",
      }),
      providesTags: ["Buildings"],
    }),
    buildingDetails: build.query<BuildingDetailsResponse, string>({
      query: (id) => ({
        url: `/buildings/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Buildings", id }],
    }),
    buildingDelete: build.mutation<void, string>({
      query: (id) => ({
        url: `/users/buildings/${id}`,
        method: "DelETE",
      }),
      invalidatesTags: ["Buildings"],
    }),
    //buildings types and sub buildings
    creatingBuildingsTypes: build.mutation<void, { name: string }>({
      query: (buildingTypes) => ({
        url: "/buildings/types",
        method: "POST",
        body: buildingTypes,
      }),
      invalidatesTags: ["BuildingTypes"],
    }),
    creatingSubBuildingsTypes: build.mutation<
      void,
      {
        subType: string;
        building_type_id: string;
      }
    >({
      query: (subBuilding) => ({
        url: `/buildings/sub-buildings`,
        method: "POST",
        body: subBuilding,
      }),
      invalidatesTags: ["SubBuildingsTypes"],
    }),

    getAllBuildingsTypes: build.query<GetAllBuildingTypesResponse, void>({
      query: () => ({
        url: `/buildings/types`,
        method: "GET",
      }),
      providesTags: ["BuildingTypes"],
    }),
    getAllSubBuildingsTypes: build.query<GetSingleBuildingTypeResponse, string>(
      {
        query: (buildingTypeId) => ({
          url: `/buildings/types/${buildingTypeId}/sub-buildings`,
          method: "GET",
        }),
        providesTags: ["SubBuildingsTypes"],
      },
    ),
    upgrade: build.mutation<void, {}>({
      query: () => ({
        url: `/users/consumer/upgrade-level`,
        method: "POST",
        body: {},
      }),
    }),
  }),
});

export const {
  useCreatingBuildingsTypesMutation,
  useCreatingSubBuildingsTypesMutation,
  useGetAllBuildingsTypesQuery,
  useGetAllSubBuildingsTypesQuery,
  //buildings
  useCreatingBuildingMutation,
  useGetAllBuildingsQuery,
  useBuildingDetailsQuery,
  useBuildingDeleteMutation,
  //upgrade
  useUpgradeMutation,
} = buildingApi;
