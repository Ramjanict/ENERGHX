import { type FC } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import CommonButton from "@/common/button/CommonButton";

interface GroupSelectProps {
  totalSelected: number;
  selectAll: boolean;
  onSelectAll: (checked: boolean) => void;
  onApprove: () => void;
  onReject: () => void;
}

const GroupSelect: FC<GroupSelectProps> = ({
  totalSelected,
  selectAll,
  onSelectAll,
  onApprove,
  onReject,
}) => {
  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 items-center justify-between rounded-lg border border-[#E9E3E3] p-2">
      <div className="flex items-center gap-3 font-playfair">
        <Checkbox
          id="select-all"
          checked={selectAll}
          onCheckedChange={(checked) => onSelectAll(!!checked)}
          className="border-gray-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 data-[state=checked]:text-white"
        />
        <label
          htmlFor="select-all"
          className="text-xl text-black font-medium cursor-pointer"
        >
          Select all
        </label>
        <span className="text-base text-[#454F5B]"> ({totalSelected})</span>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-3">
        <CommonButton onClick={onApprove} className="text-white">
          Approved Selected
        </CommonButton>
        <CommonButton
          onClick={onReject}
          className=" !bg-[#FF4842] hover:bg-red-600 text-white"
        >
          Reject Selected
        </CommonButton>
      </div>
    </div>
  );
};

export default GroupSelect;
