import { baseAPI } from "@/store/baseApi/baseApi";
import { AllContentResponse } from "./types/contentType";
import { SingleContentResponse } from "./types/singleContent";

export const contentApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    createBasicContent: build.mutation<any, FormData>({
      query: (course) => ({
        url: "/basic-content",
        method: "POST",
        body: course,
      }),
      invalidatesTags: ["BasicContent", "Course"],
    }),

    updateBasicContent: build.mutation<
      any,
      { moduleId: string; module: FormData }
    >({
      query: ({ moduleId, module }) => ({
        url: `/basic-content/${moduleId}`,
        method: "PATCH",
        body: module,
      }),
      invalidatesTags: ["BasicContent"],
    }),

    deleteBasicContent: build.mutation<any, string>({
      query: (moduleId) => ({
        url: `/basic-content/${moduleId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BasicContent"],
    }),

    getAllBasicContent: build.query<any, string>({
      query: () => ({
        url: `/basic-content/all`,
        method: "GET",
      }),
      providesTags: ["BasicContent"],
    }),

    // content
    createContent: build.mutation<any, FormData>({
      query: (course) => ({
        url: "/content",
        method: "POST",
        body: course,
      }),
      invalidatesTags: ["Content"],
    }),

    updateContent: build.mutation<
      any,
      { contentId: string; content: FormData }
    >({
      query: ({ contentId, content }) => ({
        url: `/content/${contentId}`,
        method: "PATCH",
        body: content,
      }),
      invalidatesTags: ["Content"],
    }),

    deleteContent: build.mutation<any, string>({
      query: (contentId) => ({
        url: `/content/${contentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Content", "Module"],
    }),

    getAllContent: build.query<AllContentResponse, string>({
      query: (singleModuleId) => ({
        url: `/module/${singleModuleId}`,
        method: "GET",
      }),
      providesTags: ["Content"],
    }),
    getSingleContent: build.query<SingleContentResponse, string>({
      query: (contentId) => ({
        url: `/content/${contentId}`,
        method: "GET",
      }),
      providesTags: ["Content"],
    }),
  }),
});

export const {
  //basic content
  useGetAllBasicContentQuery,
  useCreateBasicContentMutation,
  useUpdateBasicContentMutation,
  useDeleteBasicContentMutation,

  // content
  useGetAllContentQuery,
  useLazyGetAllContentQuery,
  useGetSingleContentQuery,
  useCreateContentMutation,
  useUpdateContentMutation,
  useDeleteContentMutation,
} = contentApi;
