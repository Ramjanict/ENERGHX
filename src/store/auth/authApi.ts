import { baseAPI } from "@/store/baseApi/baseApi";
import { LoginResponse } from "./types/loginUser";

export const authApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, { email: string; password: string }>({
      query: (user) => ({
        url: "/auth/login",
        method: "POST",
        body: user,
      }),
    }),
    userRegister: build.mutation<any, FormData>({
      query: (user) => ({
        url: "/auth/register",
        method: "POST",
        body: user,
      }),
    }),
    updateProfile: build.mutation<any, FormData>({
      query: (user) => ({
        url: "/users/profile",
        method: "PATCH",
        body: user,
      }),
    }),
    createPassword: build.mutation<
      any,
      { token: string; email: string; password: string }
    >({
      query: (user) => ({
        url: `/auth/create-password`,
        method: "POST",
        body: user,
      }),
    }),
    forgotPassword: build.mutation<any, { email: string }>({
      query: (email) => ({
        url: `/auth/forgot-password`,
        method: "POST",
        body: email,
      }),
    }),
    resetPassword: build.mutation<any, { email: string }>({
      query: (email) => ({
        url: `/auth/forgot-password`,
        method: "POST",
        body: email,
      }),
    }),
    changePassword: build.mutation<
      any,
      {
        oldPassword: string;
        newPassword: string;
      }
    >({
      query: (user) => ({
        url: `/auth/change-password`,
        method: "PATCH",
        body: user,
      }),
    }),

    updateUser: build.mutation<any, FormData>({
      query: (user) => ({
        url: `/users/profile/server`,
        method: "PATCH",
        body: user,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useUserRegisterMutation,
  useUpdateProfileMutation,
  useCreatePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateUserMutation,
} = authApi;
