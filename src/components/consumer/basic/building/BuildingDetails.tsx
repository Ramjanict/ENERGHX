import BackButton from "@/common/button/BackButton";
import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import CommonHeader from "@/common/header/CommonHeader";
import SectionHeader from "@/common/header/SectionHeader";
import { Spinner } from "@/common/loading/Spinner";
import { useBuildingDetailsQuery } from "@/store/consumer/basic/building/buildingApi";
import { useParams } from "react-router-dom";
import BMiniCard from "./card/BMiniCard";
import RoomCard from "./room/RoomCard";

const BuildingDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useBuildingDetailsQuery(id || "", {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const buildingDetails = data?.data;

  const buildingStart = [
    { label: "Total Rooms", value: buildingDetails?.rooms?.length },

    { label: "Electric Vehicles", value: buildingDetails?.evs?.length },
    {
      label: "Total Energy",
      value: `${buildingDetails?.user_building_utility[0]?.unit} kWh`,
    },
  ];
  const rooms = buildingDetails?.rooms ?? [];
  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner text={"Building details..."} size="xl" />
        </div>
      ) : (
        <div className=" space-y-6">
          <BackButton />
          <CommonBorderWrapper isShadow>
            <div className="flex items-start justify-between">
              <div>
                <CommonHeader size="xl">
                  {buildingDetails?.building_name}
                </CommonHeader>
                <CommonHeader size="sm">
                  {buildingDetails?.building_type?.name} •{" "}
                  {buildingDetails?.building_sub_type?.name}
                </CommonHeader>
              </div>
              <div>{/* <ActionButton type="edit" /> */}</div>
            </div>
            <div className="grid grid-col sm:grid-cols-2 md:grid-cols-3 gap-3 ">
              {buildingStart.map((s) => (
                <BMiniCard
                  key={s.label}
                  label={s.label}
                  value={s.value as string}
                />
              ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-2 ">
              <CommonButton
                to={`../add-room/${buildingDetails?.user_building_details_id}`}
                showDefaultIcon
              >
                Add Room
              </CommonButton>
            </div>
          </CommonBorderWrapper>

          <div className="space-y-2">
            <SectionHeader title="Rooms" />
            <div className="space-y-4">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildingDetails;
