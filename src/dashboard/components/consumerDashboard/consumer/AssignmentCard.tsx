import { UserServerAssignment } from "@/store/LMS/user/types/UserAndAssignTypes";
import React from "react";

interface AssignmentCardProps {
  assignment: UserServerAssignment;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment }) => {
  const { user, server } = assignment;

  return (
    <div className="max-w-md w-full bg-white shadow-lg rounded-xl overflow-hidden border p-4 mb-4 hover:shadow-xl transition-shadow duration-300">
      {/* User Info */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700">User</h3>
        <p className="text-gray-600">
          <strong>Name:</strong> {user.firstname} {user.lastname}
        </p>
        <p className="text-gray-600">
          <strong>Email:</strong> {user.email}
        </p>
        <p className="text-gray-600">
          <strong>Phone:</strong> {user.phonenumber || "N/A"}
        </p>
      </div>

      {/* Server Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700">Server</h3>
        <p className="text-gray-600">
          <strong>Name:</strong> {server.firstname} {server.lastname}
        </p>
        <p className="text-gray-600">
          <strong>Email:</strong> {server.email}
        </p>
        <p className="text-gray-600">
          <strong>Phone:</strong> {server.phonenumber || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default AssignmentCard;
