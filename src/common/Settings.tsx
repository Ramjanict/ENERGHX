import CommonHeader from "@/common/header/CommonHeader";
import { useState } from "react";
import { LuUserRound } from "react-icons/lu";
import { SlLockOpen } from "react-icons/sl";
import Password from "@/common/settings/Password";
import Profile from "@/common/settings/Profile";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "password":
        return <Password />;
      default:
        return <Profile />;
    }
  };

  const tablist = [
    { title: "profile", icon: <LuUserRound /> },
    { title: "password", icon: <SlLockOpen /> },
  ];
  return (
    <div className="w-full">
      <CommonHeader>Settings</CommonHeader>

      <div className="flex gap-6 sm:gap-8 items-center border-b border-primary-gray font-normal flex-wrap">
        {tablist.map((item) => (
          <div
            className={`flex gap-2 items-center justify-center cursor-pointer w-40  py-3 border-b-2 border-transparent ${
              item.title === activeTab &&
              "bg-light-green rounded-sm !border-b-2 !border-primary"
            }`}
            onClick={() => {
              setActiveTab(item.title);
            }}
            key={item.title}
          >
            <button className="text-2xl cursor-pointer ">{item.icon}</button>
            <button className=" capitalize text-base sm:text-lg cursor-pointer ">
              {item.title}
            </button>
          </div>
        ))}
      </div>

      <div className="w-full pt-5">{renderTabContent()}</div>
    </div>
  );
};

export default Settings;
