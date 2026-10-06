import { baseAPI } from "@/store/baseApi/baseApi";
import {
  AllCoursesResponse,
  InstructorCoursesResponse,
} from "./types/courseTypes";

export const courseApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    createCourse: build.mutation<any, FormData>({
      query: (course) => ({
        url: "/course",
        method: "POST",
        body: course,
      }),
      invalidatesTags: ["Course"],
    }),

    updateCourse: build.mutation<any, { courseId: string; course: FormData }>({
      query: ({ courseId, course }) => ({
        url: `/course/${courseId}`,
        method: "PATCH",
        body: course,
      }),
      invalidatesTags: ["Course"],
    }),

    deleteCourse: build.mutation<any, string>({
      query: (courseId) => ({
        url: `/course/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),

    getAllCourse: build.query<AllCoursesResponse, void>({
      query: () => ({
        url: `/course/`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
    getAssociatedAdminCourses: build.query<InstructorCoursesResponse, string>({
      query: (adminId) => ({
        url: `/admin/courses/${adminId}`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
  }),
});

export const {
  useGetAllCourseQuery,
  useGetAssociatedAdminCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseApi;
