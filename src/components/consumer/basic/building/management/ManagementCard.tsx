import CommonHeader from "@/common/header/CommonHeader";
import SectionHeader from "@/common/header/SectionHeader";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";

export type Category =
  | "Kitchen"
  | "Cooling"
  | "Laundry"
  | "Lighting"
  | "Entertainment"
  | "Office";

export interface Appliance {
  id: string;
  name: string;
  category: Category;
  watts: number;
  qty: number;
  usageKwhDay: number;
  icon: LucideIcon | IconType;
}
interface Props {
  appliance: Appliance;
}

const ManagementCard: React.FC<Props> = ({ appliance }) => {
  const Icon = appliance.icon;

  return (
    <div className="bg-white rounded-xl border border-[#E7E9E8] p-4 flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50">
        <Icon className="w-5 h-5 text-slate-600" />
      </span>
      <div className="min-w-0">
        <SectionHeader size="md" title={appliance.name} />
        <CommonHeader size="sm">
          {appliance.category} •
          <span className="text-emerald-600 font-medium">
            {appliance.watts}W
          </span>{" "}
          • Qty: {appliance.qty}
        </CommonHeader>
        <CommonHeader size="sm">
          Usage: {appliance.usageKwhDay} kWh/day
        </CommonHeader>
      </div>
    </div>
  );
};
export default ManagementCard;
