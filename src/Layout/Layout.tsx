import { Outlet, useLocation } from "react-router-dom";
import NavbarStandard from "./NavbarStandard";

const Layout: React.FC = () => {
  const { pathname } = useLocation();

  const normalizedPath =
    pathname.endsWith("/") && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname;

  const hideNavbar =
    normalizedPath.startsWith("/dashboard") ||
    normalizedPath === "/admin-login";

  return (
    <div>
      {!hideNavbar && <NavbarStandard />}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
