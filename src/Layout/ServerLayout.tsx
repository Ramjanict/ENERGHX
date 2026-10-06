import userImg from "@/assets/images/user.png";
import CommonBanner from "@/common/CommonBanner";
import CommonWrapper from "@/common/CommonWrapper";
import Sidebar from "@/common/sidebar/Sidebar";
import NavbarAdmin from "@/Layout/NavbarAdmin";
import { useState } from "react";
import { FaHome, FaPhotoVideo } from "react-icons/fa";
import { HiOutlineViewfinderCircle } from "react-icons/hi2";
import { MdLogout, MdSettings } from "react-icons/md";
import { Outlet, useLocation } from "react-router-dom";

import NavbarStandard from "@/Layout/NavbarStandard";
import { RootState } from "@/store/store";
import { GrUserExpert } from "react-icons/gr";
import { useSelector } from "react-redux";

const serverInternMenu = [
  {
    path: "/user/dashboard",
    label: "Dashboard",
    icon: FaHome,
  },
  {
    path: "/user/all-program",
    label: "All Program",
    icon: HiOutlineViewfinderCircle,
  },

  {
    path: "/user/all-courses",
    label: "All Courses",
    icon: FaPhotoVideo,
  },
  {
    path: "/user/experience",
    label: "Experience",
    icon: GrUserExpert,
  },

  {
    path: "/user/settings",
    label: "Settings",
    icon: MdSettings,
  },
  { path: "/login", label: "Logout", icon: MdLogout },
];

const ServerLayout = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const [devUser] = useState({
    name: `${user?.data.firstname ?? ""} ${user?.data.lastname ?? ""}`.trim(),
    role: user?.data?.userType ?? "",
    profileImg: user?.data?.profile_photo ?? userImg,
  });

  const { pathname } = useLocation();

  const show = pathname === "/user/signup/" || pathname === "/user/signup";
  return (
    <div>
      {show && <NavbarStandard />}
      {!show && <NavbarAdmin user={devUser} />}
      {!show && (
        <CommonBanner
          name={devUser.name}
          role={devUser.role}
          imageUrl={devUser.profileImg}
        />
      )}

      <CommonWrapper>
        <div className="flex w-full">
          <div className={`${pathname === "/user/signup" && "hidden"} shrink-0`}>
            <Sidebar menuItems={serverInternMenu} />
          </div>

          <div className="flex-1 min-w-0 border-t border-t-[#E7E9E8] p-6 ">
            <Outlet />
          </div>
        </div>
      </CommonWrapper>
    </div>
  );
};

export default ServerLayout;
