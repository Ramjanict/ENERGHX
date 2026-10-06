import { baseAPI } from "@/store/baseApi/baseApi";
import { AllModuleResponse } from "./types/moduleTyps";
import { GetModuleResponse } from "./types/regularModule";

export const moduleApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    createModule: build.mutation<any, FormData>({
      query: (course) => ({
        url: "/module",
        method: "POST",
        body: course,
      }),
      invalidatesTags: ["Module"],
    }),

    updateModule: build.mutation<any, { moduleId: string; module: FormData }>({
      query: ({ moduleId, module }) => ({
        url: `/module/${moduleId}`,
        method: "PATCH",
        body: module,
      }),
      invalidatesTags: ["Module"],
    }),

    deleteModule: build.mutation<any, string>({
      query: (courseId) => ({
        url: `/module/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Module"],
    }),

    getAllModule: build.query<AllModuleResponse, string>({
      query: (singleCourseId) => ({
        url: `/course/${singleCourseId}/instructor`,
        method: "GET",
      }),
      providesTags: ["Module"],
    }),
    getAllModuleRegular: build.query<GetModuleResponse, string>({
      query: (singleCourseId) => ({
        url: `/course/${singleCourseId}/regular`,
        method: "GET",
      }),
      providesTags: ["Module"],
    }),
  }),
});

export const {
  useGetAllModuleQuery,
  useGetAllModuleRegularQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
} = moduleApi;
