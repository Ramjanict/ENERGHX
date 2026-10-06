import userImg from "@/assets/images/user.png";
import CommonBanner from "@/common/CommonBanner";
import CommonWrapper from "@/common/CommonWrapper";
import Sidebar, { MenuItem } from "@/common/sidebar/Sidebar";
import NavbarAdmin from "@/Layout/NavbarAdmin";
import NavbarStandard from "@/Layout/NavbarStandard";
import { RootState } from "@/store/store";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";

import { Building2 } from "lucide-react";
import { FaChartBar, FaHome, FaSolarPanel, FaWind } from "react-icons/fa";
import { GiPlantRoots } from "react-icons/gi";
import { MdGroups, MdLogout, MdSettings } from "react-icons/md";
import { RiLeafLine } from "react-icons/ri";

export const basicConsumerMenu: MenuItem[] = [
  {
    path: "/basic-consumer/dashboard",
    label: "Dashboard",
    icon: FaHome,
  },
  {
    path: "/basic-consumer/building",
    label: "Building Information",
    icon: Building2,
  },
  {
    label: "Renewables",
    icon: RiLeafLine,
    children: [
      {
        path: "/basic-consumer/solar-energy",
        label: "Solar Energy",
        icon: FaSolarPanel,
      },
      {
        path: "/basic-consumer/wind-energy",
        label: "Wind Energy",
        icon: FaWind,
      },
      {
        path: "/basic-consumer/biomass-energy",
        label: "Biomass Energy",
        icon: GiPlantRoots,
      },
    ],
  },
  {
    path: "/basic-consumer/analysis",
    label: "Analysis",
    icon: FaChartBar,
  },
  {
    path: "/basic-consumer/assigned-associates",
    label: "Assigned Associates",
    icon: MdGroups,
  },
  {
    path: "/basic-consumer/settings",
    label: "Settings",
    icon: MdSettings,
  },
  {
    path: "/login",
    label: "Logout",
    icon: MdLogout,
  },
];

const LayoutBasicConsumer = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const [devUser] = useState({
    name: `${user?.data?.firstname ?? ""} ${user?.data?.lastname ?? ""}`.trim(),
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
            <Sidebar menuItems={basicConsumerMenu} />
          </div>
          <div className="flex-1 min-w-0 border-t border-t-[#E7E9E8]  py-3 pl-3 pr-3 sm:py-6 sm:pl-6 sm:pr-6 2xl:pr-0 ">
            <Outlet />
          </div>
        </div>
      </CommonWrapper>
    </div>
  );
};

export default LayoutBasicConsumer;
