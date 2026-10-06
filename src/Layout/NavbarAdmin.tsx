import Logo from "@/assets/images/logo.svg";
import userImg from "@/assets/images/user.png";
import CommonWrapper from "@/common/CommonWrapper";
import DropDown from "@/common/DropDown";
import { Link } from "react-router-dom";

export interface NavbarUserProps {
  name?: string;
  role: string;
  profileImg: string;
}
interface NavbarAdminProps {
  user: NavbarUserProps;
}
const NavbarAdmin = ({ user }: NavbarAdminProps) => {
  return (
    <>
      <nav
        className="
        bg-white flex justify-between items-center px-4 xl:px-[5%] py-4 border-b border-[#E7E9E8] z-50"
      >
        <CommonWrapper>
          <div className="w-full flex justify-between items-center">
            <Link to="/">
              <img src={Logo} alt="Logo" className="h-8 w-[120px]" />
            </Link>

            <div className="">
              <div className="flex gap-2 relative">
                <div>
                  <DropDown
                    trigger={
                      <img
                        src={user.profileImg || userImg}
                        alt="User"
                        className="w-12 h-12 ring-2 ring-primary rounded-full cursor-pointer"
                      />
                    }
                  />
                </div>
                <div className="hidden sm:block">
                  <h2 className="text-[#112518] text-base ">{user.name}</h2>
                  <p className="text-primary font-semibold text-sm">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CommonWrapper>
      </nav>
    </>
  );
};

export default NavbarAdmin;
