import { baseAPI } from "@/store/baseApi/baseApi";
import {
  AveragePercentageResponse,
  CourseProgressResponse,
  UserQuizResultsResponse,
} from "./types/progressType";

export const progressAndCertificateApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    setProgress: build.mutation<
      any,
      { courseId: string; singleContentId: string }
    >({
      query: ({ courseId, singleContentId }) => ({
        url: `/course/progress/${courseId}/${singleContentId}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Progress"],
    }),

    submitCertificate: build.mutation<
      any,
      { courseId: string; userId: string }
    >({
      query: ({ courseId, userId }) => ({
        url: `grading/${courseId}/${userId}/certificate`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Progress"],
    }),
    getResult: build.query<
      UserQuizResultsResponse,
      { courseId: string; userId: string }
    >({
      query: ({ courseId, userId }) => ({
        url: `grading/${courseId}/${userId}/results`,
        method: "GET",
      }),
      providesTags: ["Progress"],
    }),
    getCalculatedMark: build.query<
      AveragePercentageResponse,
      { courseId: string; userId: string }
    >({
      query: ({ courseId, userId }) => ({
        url: `grading/${courseId}/${userId}`,
        method: "GET",
      }),
      providesTags: ["Progress"],
    }),

    getProgress: build.query<CourseProgressResponse, string>({
      query: (courseId) => ({
        url: `/course/progress/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Progress"],
    }),
  }),
});

export const {
  useSetProgressMutation,
  useGetProgressQuery,
  useLazyGetProgressQuery,
  useSubmitCertificateMutation,
  useGetCalculatedMarkQuery,
  useLazyGetCalculatedMarkQuery,
  useGetResultQuery,
  useLazyGetResultQuery,
} = progressAndCertificateApi;
