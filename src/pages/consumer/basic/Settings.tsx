import StandardTabs from "@/common/button/StandardTabs";
import SectionHeader from "@/common/header/SectionHeader";
import EnergyCommodityForm from "@/components/consumer/basic/settings/EnergyCommodityForm";
import PasswordForm from "@/components/consumer/basic/settings/PasswordForm";
import ProfileForm from "@/components/consumer/basic/settings/ProfileForm";
import { ConsumerLoginResponse } from "@/store/auth/types/loginUser";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const Settings = () => {
  const { pathname } = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const consumerUser = user as ConsumerLoginResponse | null;
  // Check if current context or user level is Basic Consumer
  const isBasicConsumer =
    pathname.startsWith("/basic-consumer") ||
    consumerUser?.data?.level === "BASIC" ||
    (!pathname.startsWith("/standard-consumer") &&
      consumerUser?.data?.level !== "STANDARD");

  const [activeTab, setActiveTab] = useState("profile");

  // Fallback to profile if on basic consumer and commodity was somehow selected
  useEffect(() => {
    if (isBasicConsumer && activeTab === "commodity") {
      setActiveTab("profile");
    }
  }, [isBasicConsumer, activeTab]);

  const tabs = isBasicConsumer
    ? [
        { label: "Profile", key: "profile" },
        { label: "Password", key: "password" },
      ]
    : [
        { label: "Profile", key: "profile" },
        { label: "Energy Commodity Information", key: "commodity" },
        { label: "Password", key: "password" },
      ];

  return (
    <div className="space-y-6 ">
      <SectionHeader title="Settings" />
      <StandardTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="w-full">
        {activeTab === "profile" && <ProfileForm />}

        {!isBasicConsumer && activeTab === "commodity" && (
          <EnergyCommodityForm />
        )}

        {activeTab === "password" && <PasswordForm />}
      </div>
    </div>
  );
};

export default Settings;

