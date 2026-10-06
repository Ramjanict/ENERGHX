import { AddRoomPayload } from "@/components/consumer/basic/building/room/AddRoom";
import { baseAPI } from "@/store/baseApi/baseApi";
import { updateRoomPayload } from "./types/room";
export const roomApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    addRoom: build.mutation<void, AddRoomPayload>({
      query: (building) => ({
        url: `/buildings/room`,
        method: "POST",
        body: building,
      }),
      invalidatesTags: ["Room"],
    }),
    updateRoom: build.mutation<
      void,
      { room_id: string; body: updateRoomPayload }
    >({
      query: ({ room_id, body }) => ({
        url: `/buildings/room/${room_id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { body }) => [
        { type: "Buildings", id: body.user_building_details_id },
        "Room",
      ],
    }),
    deleteRoom: build.mutation<void, { room_id: string; building_id: string }>({
      query: ({ room_id }) => ({
        url: `/buildings/room/${room_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { building_id }) => [
        { type: "Buildings", id: building_id },
        "Room",
      ],
    }),
  }),
});

export const {
  useAddRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} = roomApi;
