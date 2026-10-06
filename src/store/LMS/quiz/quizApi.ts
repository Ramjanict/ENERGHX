import { baseAPI } from "@/store/baseApi/baseApi";
import {
  AllQuizResponse,
  AnswerSubmission,
  QuizData,
  QuizPayload,
  QuizSubmissionResponse,
} from "./types/quizTypes";

export const quizApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    createQuiz: build.mutation<any, QuizPayload>({
      query: (course) => ({
        url: "/quiz",
        method: "POST",
        body: course,
      }),
      invalidatesTags: ["Quiz"],
    }),

    submitQuiz: build.mutation<any, AnswerSubmission>({
      query: (quiz) => ({
        url: `/quiz/submit-quiz`,
        method: "POST",
        body: quiz,
      }),
      invalidatesTags: ["Quiz"],
    }),

    UpdateQuiz: build.mutation<any, { quizId: string; quiz: QuizData }>({
      query: ({ quizId, quiz }) => ({
        url: `/quiz/${quizId}`,
        method: "PATCH",
        body: quiz,
      }),
      invalidatesTags: ["Quiz"],
    }),

    deleteQuiz: build.mutation<any, string>({
      query: (contentId) => ({
        url: `/quiz/delete-quiz/${contentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Quiz"],
    }),

    getAllQuiz: build.query<AllQuizResponse, string>({
      query: (quizId) => ({
        url: `/quiz/get-all-quizzes/${quizId}`,
        method: "GET",
      }),
      providesTags: ["Quiz"],
    }),
    getQuizResult: build.query<QuizSubmissionResponse, void>({
      query: () => ({
        url: `/quiz/result`,
        method: "GET",
      }),
      providesTags: ["Quiz"],
    }),
  }),
});

export const {
  useCreateQuizMutation,
  useSubmitQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
  useGetAllQuizQuery,
  useGetQuizResultQuery,
} = quizApi;
