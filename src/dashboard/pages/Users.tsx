import DashboardCardSkeleton from "@/common/loading/DashboardCardSkeleton";
import useDebounce from "@/common/useDebounce";
import { loadingList } from "@/help/help";
import {
  UserLevel,
  UserParams,
  UserRole,
  UserTypeName,
} from "@/store/LMS/user/types/UserAndAssignTypes";
import { useGetAllUsersQuery } from "@/store/LMS/user/userApi";
import { useState } from "react";
import AdminCommonHeader from "../Common/AdminCommonHeader";
import CustomSelect, {
  SelectOption,
} from "../components/consumerDashboard/users/CustomSelect";
import Pagination from "../components/consumerDashboard/users/Pagination";
import SearchFilter from "../components/consumerDashboard/users/SearchFilter";
import UserCard from "../components/consumerDashboard/users/UserCard";
const Users = () => {
  const statusOptions: SelectOption<UserLevel>[] = [
    { label: "Basic", value: "BASIC" },
    { label: "Standard", value: "STANDARD" },
    { label: "Certified", value: "CERTIFIED" },
  ];
  const userTypeOptions: SelectOption<UserTypeName>[] = [
    { label: "Consumer", value: "CONSUMER" },
    { label: "Server", value: "SERVER" },
    { label: "Developer", value: "DEVELOPER" },
  ];
  const userRoleOptions: SelectOption<UserRole>[] = [
    { label: "Instructor", value: "INSTRUCTOR" },
    { label: "Manager", value: "MANAGER" },
    { label: "Writer", value: "WRITER" },
  ];

  type StatusValue = (typeof statusOptions)[number]["value"];
  type UserValue = (typeof userTypeOptions)[number]["value"];
  type UserRoleValue = (typeof userRoleOptions)[number]["value"];

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [statusFilter, setStatusFilter] = useState<StatusValue | undefined>(
    undefined,
  );
  const [userFilter, setUserFilter] = useState<UserValue | undefined>(
    undefined,
  );
  const [userRole, setUserRole] = useState<UserRoleValue | undefined>(
    undefined,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  const queryParams: UserParams = {
    page: currentPage,
    ...(debouncedSearchQuery && { searchFilter: debouncedSearchQuery }),
    ...(statusFilter && { level: statusFilter }),
    ...(userFilter && { user_type_name: userFilter }),
    ...(userRole && { user_role: userRole }),
  };

  const { data, isLoading } = useGetAllUsersQuery(queryParams);

  const allUsersData = data?.data?.users ?? [];
  const totalPages = data?.data?.totalPages ?? 1;
  const totalUser = data?.data?.totalCount ?? 0;
  const perPage = data?.data?.limit ?? 10;

  const handleShowAll = () => {
    setShowAll(true);
    // refetch with totalUser as limit
  };

  const { data: allData } = useGetAllUsersQuery(
    { page: 1, limit: totalUser },
    { skip: !showAll || totalUser === 0 },
  );

  const displayedUsers = showAll ? (allData?.data?.users ?? []) : allUsersData;

  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalUser);

  return (
    <div>
      <AdminCommonHeader>All Users</AdminCommonHeader>

      <SearchFilter<StatusValue, UserValue>
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusOptions={statusOptions}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        userTypeOptions={userTypeOptions}
        userFilter={userFilter}
        setUserFilter={setUserFilter}
      />

      <div>
        <AdminCommonHeader className="pt-6">
          Find Instructor, Manager or Writer
        </AdminCommonHeader>
        <CustomSelect
          value={userRole}
          onValueChange={setUserRole}
          item={userRoleOptions}
          w={228}
          className="!rounded-full w-full sm:w-[228px]"
          placeholder="Select status"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-10">
        {isLoading
          ? loadingList.map((_, index) => <DashboardCardSkeleton key={index} />)
          : displayedUsers.map((user) => (
              <UserCard key={user.user_id} user={user} />
            ))}
      </div>

      {!showAll && (
        <Pagination
          title="All Users"
          showText={`Showing ${start} to ${end} of ${totalUser} Users`}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onToggleShowAll={handleShowAll}
          showAll={showAll}
        />
      )}
    </div>
  );
};

export default Users;
