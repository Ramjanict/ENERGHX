const DashboardCardSkeleton = () => {
  return (
    <div className=" my-6">
      <div className="w-full  bg-white rounded-2xl border border-[#E5E5E5]   p-6 animate-pulse">
        <div className="">
          <div className="flex items-center gap-4 py-4 p ">
            <div className={`p-4 rounded-lg bg-gray-100 animate-pulse`}></div>
            <div className="w-full p-4 rounded-lg bg-gray-100 animate-pulse"></div>
          </div>
          <div className="mx-auto w-[50%] p-4 rounded-lg bg-gray-100 animate-pulse"></div>
          <div className="mx-auto w-full p-4 rounded-lg bg-gray-100 animate-pulse mt-4"></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCardSkeleton;
