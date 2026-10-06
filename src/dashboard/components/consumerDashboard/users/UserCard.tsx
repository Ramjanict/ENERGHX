import img from "@/assets/Profile/profile.png";
import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import {
  User,
  UserRole,
  UserTypeName,
} from "@/store/LMS/user/types/UserAndAssignTypes";
import { useAssignRoleMutation } from "@/store/LMS/user/userApi";
import { Mail, Phone } from "lucide-react";
import React, { useState } from "react";
import CustomSelect, { SelectOption } from "./CustomSelect";
interface UserCardProps {
  user: User | null;
}

const userRoleOptions: SelectOption<UserRole>[] = [
  { label: "Instructor", value: "INSTRUCTOR" },
  { label: "Manager", value: "MANAGER" },
  { label: "Writer", value: "WRITER" },
];

type RoleValue = (typeof userRoleOptions)[number]["value"];

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const [assignRole] = useAssignRoleMutation();
  const [role, setRole] = useState<RoleValue | undefined>(undefined);

  const [loading, setLoading] = useState(false);

  const handleRoleChange = async () => {
    if (!role || !user) return;
    setLoading(true);
    try {
      await assignRole({
        userType: user.user_type.name,
        userRole: role,
        userId: user.user_id,
      });
    } catch (error) {
      console.error(" Failed to assign role:", error);
    } finally {
      setLoading(false);
    }
  };
  const roleColors: Record<UserTypeName, string> = {
    CONSUMER: "bg-green-100 text-green-700",
    SERVER: "bg-blue-100 text-blue-700",
    DEVELOPER: "bg-purple-100 text-purple-700",
    SUPER_ADMIN: "bg-purple-100 text-purple-700",
  };
  const userRoleColors: Record<UserRole, string> = {
    INSTRUCTOR: "bg-green-100 text-green-700",
    MANAGER: "bg-blue-100 text-blue-700",
    WRITER: "bg-purple-100 text-purple-700",
  };
  return (
    user && (
      <CommonBorderWrapper className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src={user?.profile_photo || img}
              alt={user?.firstname}
              className="w-14 h-14 rounded-full object-cover border"
            />
            <div>
              <h2 className="font-semibold text-lg">
                {user?.firstname} {user?.lastname}
              </h2>
              <p className="text-sm text-gray-500  uppercase">{user?.sex}</p>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-600 space-y-1">
          <p className="flex items-center gap-2">
            <Mail size={16} className="text-gray-500" /> {user?.email}
          </p>
          {user?.phoneNumber && (
            <p className="flex items-center gap-2">
              <Phone size={16} className="text-gray-500" /> {user?.phoneNumber}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <div
            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
              roleColors[user?.user_type?.name as UserTypeName]
            }`}
          >
            {user?.user_type?.name}
          </div>
          <div className="flex gap-1">
            {user?.user_role?.map((role, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-full text-xs font-semibold  ${userRoleColors[role]}
                `}
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-2 ">
          {user?.country?.name}, {user.state?.name}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <CustomSelect
              value={role}
              onValueChange={setRole}
              item={userRoleOptions}
              w={80}
              className=""
              placeholder="Select role"
            />
            <CommonButton disabled={loading} onClick={handleRoleChange}>
              {role ? role : "Assign Role"}
            </CommonButton>
          </div>
        </div>
      </CommonBorderWrapper>
    )
  );
};

export default UserCard;
