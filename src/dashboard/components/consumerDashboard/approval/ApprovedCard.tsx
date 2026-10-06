import img from "@/assets/Profile/profile.png";
import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import { User } from "@/store/LMS/user/types/UserAndAssignTypes";
import React from "react";
interface RequestCardProps {
  user: User;
  onClick?: () => void;
}

const levelColors: Record<string, string> = {
  BASIC: "bg-blue-100 text-blue-800",
  ADVANCED: "bg-green-100 text-green-800",
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-200 text-green-900",
  INACTIVE: "bg-red-200 text-red-900",
};

const ApprovedCard: React.FC<RequestCardProps> = ({ user, onClick }) => {
  return (
    <CommonBorderWrapper onClick={onClick} className="">
      <div className="flex gap-1">
        <div className="w-16 h-16 ">
          <img
            src={user.profile_photo || img}
            alt={`${user.firstname} ${user.lastname}`}
            className=" w-full h-full rounded-full  object-cover border border-border"
          />
        </div>

        <div className="flex-1 space-y-4">
          <h3 className="text-base font-bold text-gray-900">
            {user.firstname} {user.othername ? `${user.othername} ` : ""}
            {user.lastname}
          </h3>
          <p className="text-gray-500 text-sm">{user.email}</p>
          {user.phoneNumber && (
            <p className="text-gray-500 text-sm">{user.phoneNumber}</p>
          )}
        </div>

        <div className="flex flex-col items-end space-y-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              levelColors[user.level] || "bg-gray-100 text-gray-800"
            }`}
          >
            {user.level}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {user?.user_type?.name}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center pb-4">
        <div className="text-gray-600 text-sm">
          {user.country.name}, {user.state.name}
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[user.status] || "bg-gray-100 text-gray-700"
          }`}
        >
          {user.status}
        </span>
      </div>
    </CommonBorderWrapper>
  );
};

export default ApprovedCard;
