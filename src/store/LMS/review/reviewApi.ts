import { baseAPI } from "@/store/baseApi/baseApi";
import {
  AllReviewsResponse,
  MyReviewsResponse,
  ReviewPayload,
  SingleReviewResponse,
} from "./types/reviewsType";

export const reviewApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    AddReview: build.mutation<any, ReviewPayload>({
      query: (review) => ({
        url: "/review",
        method: "POST",
        body: review,
      }),
      invalidatesTags: ["Review"],
    }),

    updateMyReview: build.mutation<
      any,
      { reviewId: string; review: ReviewPayload }
    >({
      query: ({ reviewId, review }) => ({
        url: `/review/${reviewId}`,
        method: "PATCH",
        body: review,
      }),
      invalidatesTags: ["Review"],
    }),

    deleteMyReview: build.mutation<any, string>({
      query: (reviewId) => ({
        url: `/review/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review"],
    }),

    getAllReview: build.query<AllReviewsResponse, void>({
      query: () => ({
        url: `/review/`,
        method: "GET",
      }),
      providesTags: ["Review"],
    }),
    getSingleReview: build.query<SingleReviewResponse, string>({
      query: (courseId) => ({
        url: `/review/course/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Review"],
    }),
    getMyReview: build.query<MyReviewsResponse, void>({
      query: () => ({
        url: `/review/my-reviews`,
        method: "GET",
      }),
      providesTags: ["Review"],
    }),
  }),
});

export const {
  useAddReviewMutation,
  useUpdateMyReviewMutation,
  useDeleteMyReviewMutation,
  useGetAllReviewQuery,
  useGetSingleReviewQuery,
  useGetMyReviewQuery,
} = reviewApi;
