import DropDown from "@/common/DropDown";
import UpdatedModal from "@/common/password/UpdatedModal";
import { RootState } from "@/store/store";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useSelector } from "react-redux";
import image from "../../assets/Profile/imran.png";

const TopBar = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center w-1/2 max-w-md border border-gray-300 rounded-md overflow-hidden">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 text-sm text-gray-700 focus:outline-none"
          />
          <button className="px-4 text-gray-500 hover:text-black">
            <FiSearch size={18} />
          </button>
        </div>

        <div className="relative">
          <DropDown
            onUpdatePassword={() => setShowModal(true)}
            trigger={
              <div className="flex gap-2 relative cursor-pointer">
                <div>
                  <img
                    src={user?.data?.profile_photo || image}
                    alt="User"
                    className="w-12 h-12 ring-2 ring-primary rounded-full"
                  />
                </div>
                <div className="hidden sm:block">
                  <h2 className="text-[#112518] text-base ">
                    {user?.data?.firstname}
                  </h2>
                  <p className="text-primary font-semibold text-sm">
                    {user?.data.userType.replace(/_/g, " ")}
                  </p>
                </div>
              </div>
            }
          />
        </div>
      </header>
      {showModal && <UpdatedModal setShowModal={setShowModal} />}
    </>
  );
};

export default TopBar;
