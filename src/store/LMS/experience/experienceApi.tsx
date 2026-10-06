import { baseAPI } from "@/store/baseApi/baseApi";

export const experienceApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    addExperienceServer: build.mutation<
      any,
      { userId: string; experience: FormData }
    >({
      query: (course) => ({
        url: "/course",
        method: "POST",
        body: course,
      }),
    }),
    addExperienceDeveloper: build.mutation<
      any,
      { userId: string; experience: FormData }
    >({
      query: (course) => ({
        url: "/course",
        method: "POST",
        body: course,
      }),
    }),
  }),
});

export const {
  useAddExperienceServerMutation,
  useAddExperienceDeveloperMutation,
} = experienceApi;
