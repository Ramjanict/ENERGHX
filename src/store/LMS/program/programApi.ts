import { baseAPI } from "@/store/baseApi/baseApi";
import {
  AllProgramsResponse,
  MyProgramsResponse,
  SingleProgramApiResponse,
} from "./types/programTypes";

export const programApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    createProgram: build.mutation<any, FormData>({
      query: (program) => ({
        url: "/program",
        method: "POST",
        body: program,
      }),
      invalidatesTags: ["Program"],
    }),

    updateProgram: build.mutation<
      any,
      { programId: string; program: FormData }
    >({
      query: ({ programId, program }) => ({
        url: `/program/${programId}`,
        method: "PATCH",
        body: program,
      }),
      invalidatesTags: ["Program"],
    }),

    deleteProgram: build.mutation<any, string>({
      query: (programId) => ({
        url: `/program/${programId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Program"],
    }),

    getAllProgram: build.query<AllProgramsResponse, void>({
      query: () => ({
        url: `/program/`,
        method: "GET",
      }),
      providesTags: ["Program"],
    }),
    getSingleProgram: build.query<SingleProgramApiResponse, string>({
      query: (programId) => ({
        url: `/program/${programId}`,
        method: "GET",
      }),
      providesTags: ["Program"],
    }),

    getMyProgram: build.query<MyProgramsResponse, void>({
      query: () => ({
        url: "/program/my-programs/all",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllProgramQuery,
  useGetSingleProgramQuery,
  useGetMyProgramQuery,
  useCreateProgramMutation,
  useUpdateProgramMutation,
  useDeleteProgramMutation,
} = programApi;
