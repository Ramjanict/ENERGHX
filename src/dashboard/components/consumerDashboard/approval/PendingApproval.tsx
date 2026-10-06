import CustomCheckbox from "@/common/CustomCheckbox";
import GroupSelect from "@/common/GroupSelect";
import TableLoading from "@/common/loading/TableLoading";
import AdminCommonButton from "@/dashboard/Common/AdminCommonButton";
import AdminCommonHeader from "@/dashboard/Common/AdminCommonHeader";
import { AccreditationPayload } from "@/store/LMS/user/types/UserAndAssignTypes";
import {
  useChangeStatusMutation,
  useLazyGetAllUsersQuery,
} from "@/store/LMS/user/userApi";
import { useEffect, useState } from "react";
import Pagination from "../users/Pagination";

const PendingApproval = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const [getAllUsersQuery, { data }] = useLazyGetAllUsersQuery();
  const allUsers = data?.data;
  const allUsersData = allUsers?.users ?? [];
  const totalPages = allUsers?.totalPages ?? 1;
  const totalUser = allUsers?.totalCount ?? 0;
  const perPage = allUsers?.limit ?? 10;

  const handleShowAll = async () => {
    await getAllUsersQuery({ page: 1, limit: totalUser });
    setShowAll(true);
  };

  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalUser);

  useEffect(() => {
    getAllUsersQuery({
      page: currentPage,
      limit: perPage,
      isAccreditedByAdmin: false,
    });
  }, [getAllUsersQuery, currentPage, perPage, showAll]);

  const [changeStatus, { isLoading }] = useChangeStatusMutation();

  const handleAccreditation = async (
    emails: string[],
    accredit: "true" | "false",
  ) => {
    const payload: AccreditationPayload = { emails, accredit };

    try {
      await changeStatus(payload);
      await getAllUsersQuery({ isAccreditedByAdmin: false });
    } catch (error) {
      console.error(" Error sending accreditation payload:", error);
    } finally {
    }
  };

  // --- toggle select all ---
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedEmails(allUsersData.map((u) => u.email));
    } else {
      setSelectedEmails([]);
    }
  };

  // --- toggle single select ---
  const handleSelectOne = (email: string, checked: boolean) => {
    setSelectedEmails((prev) =>
      checked ? [...prev, email] : prev.filter((e) => e !== email),
    );
  };

  if (!allUsersData) {
    return <TableLoading />;
  }
  if (!allUsersData.length) {
    return <p className="text-gray-500 mt-5">No pending users found.</p>;
  }

  return (
    <div className="">
      <div className="flex flex-col xl:flex-row justify-between w-full items-center pb-6 gap-10 ">
        <AdminCommonHeader className="!pb-0">
          Pending Approval ({allUsersData.length})
        </AdminCommonHeader>
        <div className="flex-1">
          <GroupSelect
            totalSelected={selectedEmails.length}
            onApprove={() => handleAccreditation(selectedEmails, "true")}
            onReject={() => handleAccreditation(selectedEmails, "false")}
            selectAll={selectAll}
            onSelectAll={handleSelectAll}
          />
        </div>
      </div>

      <div className="">
        <div className="overflow-hidden">
          <div className="bg-primary text-white px-6 py-6 grid grid-cols-12 gap-4 rounded-lg font-primary font-normal">
            <div className="col-span-1">Serial</div>
            <div className="col-span-1">Level</div>
            <div className="col-span-2">Name</div>
            <div className="col-span-3">Address</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Action</div>
          </div>

          {allUsersData.map((user, index) => (
            <div
              key={user.user_id}
              className={`grid grid-cols-12 gap-4 px-6 py-4 items-center my-[12px] rounded-lg font-primary ${
                index % 2 === 0 ? "bg-[#E7E9E8]" : "bg-[#EAF7E6]"
              }`}
            >
              <div className="col-span-1 text-base font-normal flex items-center gap-2">
                <CustomCheckbox
                  id={`user-${user.user_id}`}
                  checked={selectedEmails.includes(user.email)}
                  onChange={(checked) => handleSelectOne(user.email, checked)}
                />
                {index + 1}
              </div>
              <div className="col-span-1 text-base font-normal">
                {user.level} <br />
                {user?.user_type?.name}
              </div>
              <div className="col-span-2 text-lg font-normal">
                {user.firstname}
              </div>
              <div className="col-span-3 text-lg font-normal flex flex-col">
                <div> {user.country.name}</div>
                <div> {user.state.name}</div>
              </div>
              <div className="col-span-3 text-lg font-normal">{user.email}</div>
              <div className="col-span-2 flex gap-2">
                <AdminCommonButton
                  disabled={isLoading}
                  onClick={() => handleAccreditation([user.email], "true")}
                  className="!w-fit"
                >
                  Approve
                </AdminCommonButton>
                <AdminCommonButton
                  disabled={isLoading}
                  onClick={() => handleAccreditation([user.email], "false")}
                  className="!w-fit !bg-red-600"
                >
                  Reject
                </AdminCommonButton>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!showAll && (
        <Pagination
          title={showAll ? "Show Paginated" : "All Pending Users"}
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

export default PendingApproval;
