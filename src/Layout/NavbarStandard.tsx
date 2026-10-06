import Logo from "@/assets/images/logo.svg";
import userImg from "@/assets/images/user.png";
import DropDown from "@/common/DropDown";
import { RootState } from "@/store/store";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MobileMenu from "./MobileMenu";

const menuItems = [
  { menu: "Home", path: "/home" },
  { menu: "About Us", path: "/about-us" },
  { menu: "Consulting", path: "/consulting" },
  { menu: "Research", path: "/research" },
  { menu: "EnerghxPlus", path: "/energhxplus" },
  { menu: "Contact Us", path: "/contact-us" },
];

const NavbarStandard = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className={` w-full z-10`}>
      <nav className="bg-white flex justify-between items-center px-4 xl:px-[5%] h-18 border-b border-[#E7E9E8] z-50 transition-all duration-300">
        <Link to="/">
          <img src={Logo} alt="Logo" className="h-8 cursor-pointer  " />
        </Link>

        <div className="flex gap-4 items-center">
          <ul className="text-primary-gray gap-2 text-xs lg:text-[16px] lg:gap-5 hidden md:flex">
            {menuItems.map((item, i) => (
              <li key={i}>
                <Link
                  to={item.path}
                  className="relative px-4 py-2 group hover:text-primary"
                >
                  {item.menu}
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary transform scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-70"></span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <div className="flex gap-2 relative">
              <DropDown
                trigger={
                  <img
                    src={user?.data?.profile_photo || userImg}
                    alt="User"
                    className="w-12 h-12 ring-2 ring-primary rounded-full cursor-pointer"
                  />
                }
              />
            </div>
            <button
              onClick={toggleMenu}
              className="md:hidden text-primary-gray text-2xl cursor-pointer"
            >
              {!isOpen && <FiMenu />}
            </button>
            <div className="hidden sm:block ">
              <h2 className="text-[#112518] text-base">
                {user?.data?.firstname && user?.data.lastname
                  ? `${user?.data?.firstname} ${user?.data?.lastname}`
                  : ""}
              </h2>

              <p className="text-primary font-semibold text-sm">
                {user?.data?.userType}
              </p>
            </div>
          </div>
        </div>

        {isOpen && <MobileMenu setIsOpen={setIsOpen} />}
      </nav>
      <hr className="w-full text-[#E7E9E8]" />
    </div>
  );
};

export default NavbarStandard;
