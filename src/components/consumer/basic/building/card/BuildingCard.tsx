import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import CommonHeader from "@/common/header/CommonHeader";
import { useBuildingDeleteMutation } from "@/store/consumer/basic/building/buildingApi";
import { UserBuilding } from "@/store/consumer/basic/building/types/building";
import { Building2, Car, Users, Zap } from "lucide-react";
import BMiniCard from "./BMiniCard";

interface BuildingCardProps {
  building: UserBuilding;
}
const BuildingCard: React.FC<BuildingCardProps> = ({ building }) => {
  const stats = [
    {
      icon: Users,
      label: "Rooms",
      value: building?.card_summary?.rooms ?? 0,
      valueClassName: "text-xl",
    },
    {
      icon: Car,
      label: "EVs",
      value: building?.card_summary?.evs ?? 0,
      valueClassName: "text-xl",
    },
    {
      icon: Zap,
      label: "Energy Usage",
      value: building?.card_summary?.energy_usage ?? 0,
      valueClassName: "text-base",
    },
    {
      icon: Building2,
      label: "Type",
      value: building?.building_type?.name ?? "",
      valueClassName: "text-sm",
    },
  ];

  const [deleteBuilding, { isLoading, originalArgs }] =
    useBuildingDeleteMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteBuilding(id).unwrap();
    } catch (error) {
      console.error("Failed to delete building:", error);
    }
  };
  return (
    <CommonBorderWrapper isShadow>
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
        <div>
          <CommonHeader size="xl">{building?.building_name}</CommonHeader>
          <CommonHeader size="sm">
            <Building2 className="w-4 h-4" />
            {building?.building_type?.name} •{" "}
            {building?.building_sub_type?.name}
          </CommonHeader>
        </div>

        <CommonButton
          variant="outline"
          shape="rounded"
          to={`./building-details/${building.user_building_details_id}`}
          className="w-full sm:w-auto"
        >
          View Details
        </CommonButton>
      </div>

      <div className="grid grid-col-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <BMiniCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <div className="flex flex-wrap gap-2 ">
          <CommonButton
            to={`./add-room/${building.user_building_details_id}`}
            showDefaultIcon
            className="w-full sm:w-auto"
          >
            Add Room
          </CommonButton>

          <CommonButton
            variant="outline"
            to={`./manage-all-appliances/${building.user_building_details_id}`}
            className="w-full sm:w-auto"
          >
            Manage All Appliances
          </CommonButton>
        </div>
        <CommonButton
          isLoading={
            isLoading && originalArgs === building.user_building_details_id
          }
          loadingText="Deleting..."
          onClick={() => handleDelete(building.user_building_details_id!)}
          variant="destructive"
        >
          Delete
        </CommonButton>
      </div>
    </CommonBorderWrapper>
  );
};

export default BuildingCard;
