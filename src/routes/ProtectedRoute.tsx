import { ServerDeveloperLoginResponse } from "@/store/auth/types/loginUser";
import { RootState } from "@/store/store";
import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const serverUser = user as ServerDeveloperLoginResponse | null;

  const superAdmin = serverUser?.data.userType === "SUPER_ADMIN";
  const instructor = serverUser?.data.user_role.includes("INSTRUCTOR") ?? false;
  const lastLogin = serverUser?.data?.lastLogin;
  const role = serverUser?.data?.user_role;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Redirect INSTRUCTOR to change password on first login
    if (instructor && !lastLogin) {
      navigate("/dashboard/change-password");
      return;
    }

    // SUPER_ADMIN can access everything
    if (superAdmin) {
      return;
    }

    // Role-based restriction for others
    // if (
    //   allowedRoles &&
    //   allowedRoles.length > 0 &&
    //   !role?.some((role) => allowedRoles.includes(role))
    // ) {
    //   navigate("/login");
    //   return;
    // }
  }, [token, user, allowedRoles, navigate]);

  return <>{children}</>;
};

export default ProtectedRoute;
