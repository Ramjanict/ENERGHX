import AdminCommonHeader from "@/dashboard/Common/AdminCommonHeader";
import { useLazyGetAllUsersQuery } from "@/store/LMS/user/userApi";
import { useEffect, useState } from "react";
import Pagination from "../users/Pagination";
import ApprovedCard from "./ApprovedCard";

const AcceptApproval = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  const [getAllUsersQuery, { data }] = useLazyGetAllUsersQuery();
  const allUsers = data?.data;
  const allUsersData = allUsers?.users ?? [];
  const totalPages = allUsers?.totalPages ?? 1;
  const totalUser = allUsers?.totalCount ?? 0;
  const perPage = allUsers?.limit ?? 10;

  const handleShowAll = async () => {
    await getAllUsersQuery({
      page: 1,
      limit: totalUser,
      isAccreditedByAdmin: true,
    });
    setShowAll(true);
  };

  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalUser);

  useEffect(() => {
    getAllUsersQuery({
      isAccreditedByAdmin: true,
      page: currentPage,
      limit: perPage,
    });
  }, [getAllUsersQuery, currentPage, perPage, showAll]);

  if (!allUsersData.length)
    return <p className="text-gray-500 mt-5">No approved users found.</p>;

  return (
    <div>
      <AdminCommonHeader className="!pb-0">
        Accepted Approval ({allUsersData.length})
      </AdminCommonHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6 pb-10">
        {allUsersData.map((user, index) => (
          <ApprovedCard key={index} user={user} />
        ))}
      </div>

      {!showAll && (
        <Pagination
          title={showAll ? "Show Paginated" : "All Approved Users"}
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

export default AcceptApproval;
