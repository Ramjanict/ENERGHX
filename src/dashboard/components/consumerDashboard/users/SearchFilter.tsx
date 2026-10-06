import { FaSearch } from "react-icons/fa";
import useWindowWidth from "./useWindowWidth";
import CustomSelect, { SelectOption } from "./CustomSelect";

interface Props<StatusT extends string, UserT extends string> {
  searchQuery: string;
  setSearchQuery: (val: string) => void;

  statusOptions: SelectOption<StatusT>[];
  statusFilter?: StatusT;
  setStatusFilter: (val: StatusT | undefined) => void;

  userTypeOptions: SelectOption<UserT>[];
  userFilter?: UserT;
  setUserFilter: (val: UserT | undefined) => void;
}

const SearchFilter = <StatusT extends string, UserT extends string>({
  searchQuery,
  setSearchQuery,
  statusOptions,
  statusFilter,
  setStatusFilter,
  userTypeOptions,
  userFilter,
  setUserFilter,
}: Props<StatusT, UserT>) => {
  const width = useWindowWidth();

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-center justify-between w-full">
        {/* Search Field */}
        <div className="relative w-full">
          <span className="absolute right-3 top-1/2 -translate-y-1/2 transform rounded-full bg-primary p-2.5">
            <FaSearch className="w-3 h-3 text-white" />
          </span>
          <input
            placeholder={`${
              width > 1024 ? "Enter name, email, phone number" : "Search..."
            }`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-4 text-sm placeholder-gray-500 border border-gray-300 rounded-full outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col w-full justify-end sm:flex-row gap-4">
          <CustomSelect
            value={statusFilter}
            onValueChange={setStatusFilter}
            item={statusOptions}
            w={228}
            className="!rounded-full w-full sm:w-[228px]"
            placeholder="Select status"
          />

          <CustomSelect
            value={userFilter}
            onValueChange={setUserFilter}
            item={userTypeOptions}
            placeholder="Select User Type"
            w={228}
            className="!rounded-full w-full sm:w-[228px]"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
