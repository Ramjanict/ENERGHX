import { LoginResponse } from "@/store/auth/types/loginUser";

export const getDashboardPath = (
  result: LoginResponse | null | undefined,
): string => {
  const userType = result?.data?.userType;
  const level = result?.data?.level;

  switch (userType) {
    case "SUPER_ADMIN":
      return "/dashboard";

    case "CONSUMER":
      return level === "STANDARD" ? "/standard-consumer" : "/basic-consumer";

    case "SERVER":
    case "DEVELOPER":
      return "/user";

    default:
      return "/login";
  }
};
