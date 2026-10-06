import { baseAPI } from "@/store/baseApi/baseApi";
import {
  GetEngineeringReviewResponse,
  GetEngineeringReviewStatusResponse,
} from "./types/engineeringReview";
import {
  unwrapEngineeringReviewResponse,
  unwrapEngineeringReviewStatusResponse,
} from "./unwrapEngineeringReview";

export const engineeringReviewApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getEngineeringReview: build.query<GetEngineeringReviewResponse, void>({
      query: () => ({
        url: "/workflows/consumer/standard/engineering-review",
        method: "GET",
      }),
      transformResponse: (response: unknown) =>
        unwrapEngineeringReviewResponse(response),
      providesTags: ["EngineeringReview"],
    }),
    getEngineeringReviewStatus: build.query<
      GetEngineeringReviewStatusResponse,
      void
    >({
      query: () => ({
        url: "/workflows/consumer/standard/engineering-review/status",
        method: "GET",
      }),
      transformResponse: (response: unknown) =>
        unwrapEngineeringReviewStatusResponse(response),
      providesTags: ["EngineeringReview"],
    }),
  }),
});

export const {
  useGetEngineeringReviewQuery,
  useGetEngineeringReviewStatusQuery,
} = engineeringReviewApi;
