import { ServerDeveloperLoginResponse } from "@/store/auth/types/loginUser";
import { RootState } from "@/store/store";
import { useState } from "react";
import { BiHive, BiSolidBookmarkAltPlus } from "react-icons/bi";
import { BsFillGridFill } from "react-icons/bs";
import { FaFlagCheckered, FaRegCalendarCheck } from "react-icons/fa";
import { FaPeopleCarryBox } from "react-icons/fa6";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoIosPersonAdd } from "react-icons/io";
import { LiaPhotoVideoSolid } from "react-icons/lia";
import { MdOutlineReviews, MdPayment, MdQuiz } from "react-icons/md";
import { PiVideoFill } from "react-icons/pi";
import { RiBuilding2Line } from "react-icons/ri";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { VscFileSubmodule } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import logo from "../../assets/wordpress/logo.png";

const AdminSidebar = () => {
  const [sidebar, setSidebar] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const serverUser = user as ServerDeveloperLoginResponse | null;

  const superAdmin = serverUser?.data.userType === "SUPER_ADMIN";
  const writer = serverUser?.data.user_role.includes("WRITER") ?? false;
  const manager = serverUser?.data.user_role.includes("MANAGER") ?? false;

  const sidebarList = superAdmin
    ? [
        { label: "Home", path: "home", icon: BsFillGridFill },
        { label: "Program", path: "program", icon: VscFileSubmodule },
        { label: "Course", path: "course", icon: BiHive },
        { label: "Module", path: "module", icon: PiVideoFill },
        {
          label: "Basic Content",
          path: "basic-content",
          icon: BiSolidBookmarkAltPlus,
        },
        { label: "Content", path: "content", icon: LiaPhotoVideoSolid },
        { label: "Quiz", path: "quiz", icon: MdQuiz },
        { label: "Review", path: "review", icon: MdOutlineReviews },
        { label: "Payment", path: "payment", icon: MdPayment },
        {
          label: "Assign Course",
          path: "assign-course",
          icon: IoIosPersonAdd,
        },
        {
          label: "Building Type",
          path: "create-building-type",
          icon: RiBuilding2Line,
        },
        {
          label: "Country",
          path: "country",
          icon: FaFlagCheckered,
        },
        {
          label: "Users",
          path: "users",
          icon: HiOutlineUserGroup,
        },
        {
          label: "Approval",
          path: "approval",
          icon: FaRegCalendarCheck,
        },
        {
          label: "Consumer Selection",
          path: "consumer",
          icon: FaPeopleCarryBox,
        },
      ]
    : manager
      ? [
          { label: "Home", path: "home", icon: BsFillGridFill },
          { label: "Program", path: "program", icon: VscFileSubmodule },
          { label: "Course", path: "course", icon: BiHive },
          { label: "Module", path: "module", icon: PiVideoFill },
          {
            label: "Basic Content",
            path: "basic-content",
            icon: BiSolidBookmarkAltPlus,
          },
          { label: "Content", path: "content", icon: LiaPhotoVideoSolid },
          { label: "Quiz", path: "quiz", icon: MdQuiz },
          {
            label: "Assign Course",
            path: "assign-course",
            icon: IoIosPersonAdd,
          },
          {
            label: "Building Type",
            path: "create-building-type",
            icon: RiBuilding2Line,
          },
          {
            label: "Country",
            path: "country",
            icon: FaFlagCheckered,
          },
          {
            label: "Users",
            path: "users",
            icon: HiOutlineUserGroup,
          },
        ]
      : writer
        ? [
            { label: "Home", path: "home", icon: BsFillGridFill },
            { label: "Program", path: "program", icon: VscFileSubmodule },
            { label: "Course", path: "course", icon: BiHive },
            { label: "Module", path: "module", icon: PiVideoFill },
            {
              label: "Basic Content",
              path: "basic-content",
              icon: BiSolidBookmarkAltPlus,
            },
            { label: "Content", path: "content", icon: LiaPhotoVideoSolid },
            { label: "Quiz", path: "quiz", icon: MdQuiz },
            { label: "Review", path: "review", icon: MdOutlineReviews },
          ]
        : [
            { label: "Course", path: "instructor-course", icon: BiHive },
            { label: "Module", path: "instructor-module", icon: PiVideoFill },
            {
              label: "Basic Content",
              path: "instructor-basic-content",
              icon: BiSolidBookmarkAltPlus,
            },
            {
              label: "Content",
              path: "instructor-content",
              icon: LiaPhotoVideoSolid,
            },
            { label: "Quiz", path: "instructor-quiz", icon: MdQuiz },
          ];

  return (
    <div
      className={`${
        sidebar ? "w-[72px]" : "w-[240px]"
      } border-r border-[#e4e4e4] flex flex-col transition-all duration-300 ease-in-out overflow-hidden bg-white h-full`}
    >
      <div className="p-4 flex items-center justify-between">
        {!sidebar && (
          <NavLink to="/" className="max-w-28">
            <img src={logo} alt="Logo" />
          </NavLink>
        )}
        <span
          onClick={() => setSidebar((prev) => !prev)}
          className="cursor-pointer text-xl ml-auto"
        >
          {sidebar ? <SlArrowRight /> : <SlArrowLeft />}
        </span>
      </div>

      <nav className="flex-1 flex flex-col gap-1 p-2">
        {sidebarList.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `relative group flex items-center gap-2 p-2 rounded-md transition-all duration-200 ${
                isActive
                  ? "bg-primary text-white font-semibold"
                  : "hover:bg-gray-100 text-[#283F3A]"
              }`
            }
          >
            <item.icon size={22} />
            <span
              className={`${
                sidebar ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
              }`}
            >
              {item.label}
            </span>

            {/* Tooltip for collapsed state */}
            {sidebar && (
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 invisible group-hover:visible z-10">
                <div className="bg-primary text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-md">
                  {item.label}
                </div>
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
