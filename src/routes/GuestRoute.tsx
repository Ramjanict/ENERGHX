import { getDashboardPath } from "@/help/getDashboardPath";
import { RootState } from "@/store/store";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface GuestRouteProps {
  children: ReactNode;
}

const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { user, token } = useSelector((state: RootState) => state.auth);

  if (token && user) {
    return <Navigate to={getDashboardPath(user)} replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;
