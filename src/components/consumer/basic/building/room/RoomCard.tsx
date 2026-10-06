import ActionButton from "@/common/button/ActionButton";
import CommonButton from "@/common/button/CommonButton";
import Modal from "@/common/form/Modal";
import CommonHeader from "@/common/header/CommonHeader";
import { Room } from "@/store/consumer/basic/building/types/building";
import { useDeleteRoomMutation } from "@/store/consumer/basic/room/roomApi";
import React, { useState } from "react";
import AddRoom from "./AddRoom";

interface RoomCardProps {
  room: Room;
}
const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const applianceCount =
    room.windows.length +
    room.lightBulbs.length +
    room.Acs.length +
    room.otherAppliances.length;

  const [deleteRoom, { isLoading, originalArgs }] = useDeleteRoomMutation();

  const handleDelete = async (room_id: string, building_id: string) => {
    try {
      await deleteRoom({ room_id, building_id }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const [isRoomEdit, setIsRoomEdit] = useState(false);

  return (
    <div>
      <div className="bg-[#EAF7E6]/30 rounded-xl p-4 border border-[#E7E9E8]">
        <div className="flex items-start justify-between space-y-3 ">
          <div className="space-y-3">
            <div>
              <CommonHeader className="font-bold!">{room.title}</CommonHeader>
              <CommonHeader size="sm">{room.activity_type}</CommonHeader>
            </div>
            <div>
              <CommonHeader size="sm">Appliances</CommonHeader>
              <CommonHeader size="md" className="font-bold! text-[#112518]!">
                {applianceCount}
              </CommonHeader>
            </div>
          </div>
          <div className="  self-end">
            <CommonHeader size="sm">Estimated Usage</CommonHeader>
            <CommonHeader size="md" className="font-bold! text-[#112518]!">
              {room.estimated_usage} {room.estimated_usage_unit}
            </CommonHeader>
          </div>
          <div className="flex items-center gap-2 ">
            <ActionButton onClick={() => setIsRoomEdit(true)} type="edit" />
            <ActionButton
              type="delete"
              isLoading={isLoading && originalArgs?.room_id === room.id}
              onClick={() =>
                handleDelete(room.id, room.user_building_details_id)
              }
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row  gap-2 mt-3">
          <CommonButton
            size="sm"
            to={`../add-appliance/${room.user_building_details_id}/${room.id}`}
            showDefaultIcon
            className="w-full"
          >
            Add Appliances
          </CommonButton>
          <CommonButton
            size="sm"
            to={`../add-ev/${room.user_building_details_id}/${room.id}`}
            showDefaultIcon
            className="w-full"
          >
            Add Electric Vehicles
          </CommonButton>
        </div>
      </div>
      <Modal isOpen={isRoomEdit} onClose={() => setIsRoomEdit(false)}>
        <AddRoom room={room} onClose={() => setIsRoomEdit(false)} />
      </Modal>
    </div>
  );
};

export default RoomCard;
