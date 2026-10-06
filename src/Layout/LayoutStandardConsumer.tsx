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

import { GiPlantRoots } from "react-icons/gi";
import { MdLogout, MdSettings } from "react-icons/md";

import { Building2, Car, ClipboardList, FileSearch } from "lucide-react";
import { CiBatteryCharging } from "react-icons/ci";
import { GoCodeReview } from "react-icons/go";

import { CgProfile } from "react-icons/cg";
import {
  FaHome,
  FaSolarPanel,
  FaThermometerHalf,
  FaTools,
  FaWind,
} from "react-icons/fa";
import { GiJackPlug } from "react-icons/gi";
import { GrServices, GrValidate } from "react-icons/gr";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { IoBagCheckOutline } from "react-icons/io5";
import { LiaUsersSolid } from "react-icons/lia";
import { PiCodesandboxLogo, PiLightningBold } from "react-icons/pi";
import { RiBattery2ChargeFill, RiContactsFill } from "react-icons/ri";
import { SiCountingworkspro } from "react-icons/si";
export const standardConsumerMenu: MenuItem[] = [
  {
    path: "/standard-consumer/dashboard",
    label: "Dashboard",
    icon: FaHome,
  },

  {
    path: "#",
    label: "Commodity Setup",
    icon: PiLightningBold,
    children: [
      {
        path: "/standard-consumer/energy-commodity-setup",
        label: "Energy Commodity Setup",
        icon: FaTools,
      },
      {
        path: "/standard-consumer/zev",
        label: "Zero Emission Vehicle (ZEV)",
        icon: Car,
      },
      {
        path: "/standard-consumer/nzeb",
        label: "Net Zero Energy Building (NZEB)",
        icon: RiBattery2ChargeFill,
      },
      {
        path: "/standard-consumer/thermal-comfort-simulation",
        label: "Thermal Comfort Simulation",
        icon: FaThermometerHalf,
      },
      {
        path: "/standard-consumer/engineering-services",
        label: "Add Engineering Services",
        icon: GrServices,
      },
      {
        path: "/standard-consumer/solar-energy",
        label: "Solar Energy System Design & Sizing",
        icon: FaSolarPanel,
      },
      {
        path: "/standard-consumer/wind-energy",
        label: "Wind Energy System Design & Sizing",
        icon: FaWind,
      },
      {
        path: "/standard-consumer/biomass-energy",
        label: "Biomass Energy System Design & Sizing",
        icon: GiPlantRoots,
      },
      {
        path: "/standard-consumer/hvac-modelling",
        label: "Building HVAC Modelling",
        icon: Building2,
      },
      {
        path: "/standard-consumer/battery-storage",
        label: "Battery Storage Design",
        icon: CiBatteryCharging,
      },
      {
        path: "/standard-consumer/ev-charging",
        label: "EV Charging Infrastructure",
        icon: GiJackPlug,
      },
    ],
  },

  {
    path: "#",
    label: "Validation & Approval",
    icon: FileSearch,
    children: [
      {
        path: "/standard-consumer/res-sequence-validation",
        label: "RES Sequence Validation",
        icon: GrValidate,
      },
      {
        path: "/standard-consumer/engineering-review",
        label: "Engineering Review & Approval",
        icon: GoCodeReview,
      },
    ],
  },

  {
    path: "#",
    label: "Contracts & Reports",
    icon: ClipboardList,
    children: [
      {
        path: "/standard-consumer/project-proposal",
        label: "Project Proposal & Contract",
        icon: RiContactsFill,
      },
      {
        path: "/standard-consumer/contract-documents",
        label: "Contract Documents",
        icon: HiOutlineClipboardDocumentList,
      },
      {
        path: "/standard-consumer/contract-process",
        label: "Contract Process",
        icon: SiCountingworkspro,
      },
      {
        path: "/standard-consumer/commodity-contract",
        label: "Commodity Contract",
        icon: PiCodesandboxLogo,
      },
      {
        path: "/standard-consumer/checkout-report",
        label: "Checkout Report",
        icon: IoBagCheckOutline,
      },
    ],
  },

  {
    path: "#",
    label: "Settings",
    icon: MdSettings,
    children: [
      {
        path: "/standard-consumer/profile-settings",
        label: "Profile Settings",
        icon: CgProfile,
      },
      {
        path: "/standard-consumer/assigned-associates",
        label: "Assigned Associates",
        icon: LiaUsersSolid,
      },
    ],
  },

  {
    path: "/login",
    label: "Logout",
    icon: MdLogout,
  },
];

const LayoutStandardConsumer = () => {
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
            <Sidebar menuItems={standardConsumerMenu} />
          </div>

          <div className="flex-1 min-w-0 border-t border-t-[#E7E9E8] py-3 pl-3 pr-3 sm:py-6 sm:pl-6 sm:pr-6 2xl:pr-0  ">
            <Outlet />
          </div>
        </div>
      </CommonWrapper>
    </div>
  );
};

export default LayoutStandardConsumer;
