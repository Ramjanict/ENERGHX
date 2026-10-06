import { baseAPI } from "@/store/baseApi/baseApi";
import {
  AdminCreatePayload,
  AssignCoursesPayload,
  PaymentResponse,
} from "./types/paymentAndAdmin";

export const paymentCourseApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    payment: build.mutation<any, string>({
      query: (programId) => ({
        url: "/payment/checkout",
        method: "POST",
        body: programId,
      }),
      invalidatesTags: ["Payment"],
    }),

    //assignCoursesToInstructor
    assignCoursesToInstructor: build.mutation<any, AssignCoursesPayload>({
      query: (programId) => ({
        url: `/admin/assign-courses-to-admin`,
        method: "POST",
        body: programId,
      }),
    }),
    //admin

    addAdmin: build.mutation<any, AdminCreatePayload>({
      query: (admin) => ({
        url: `/admin/add-an-admin`,
        method: "POST",
        body: admin,
      }),
      invalidatesTags: ["Admin"],
    }),
    updateAdmin: build.mutation<any, { adminId: string; admin: FormData }>({
      query: ({ adminId, admin }) => ({
        url: `/admin/${adminId}`,
        method: "PATCH",
        body: admin,
      }),
      invalidatesTags: ["Admin"],
    }),

    deleteAdmin: build.mutation<any, string>({
      query: (adminId) => ({
        url: `/admin/${adminId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admin"],
    }),

    getAllAdmin: build.query<PaymentResponse, void>({
      query: () => ({
        url: `/admin`,
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),
    getAllPayment: build.query<PaymentResponse, void>({
      query: () => ({
        url: `/payment/all`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  usePaymentMutation,
  useGetAllPaymentQuery,
  useLazyGetAllPaymentQuery,
  // assignCoursesToInstructor
  useAssignCoursesToInstructorMutation,
  // admin
  useAddAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
  useGetAllAdminQuery,
} = paymentCourseApi;
