import BackButton from "@/common/button/BackButton";
import CommonButton from "@/common/button/CommonButton";
import CommonSelect from "@/common/button/CommonSelect";
import FormInput from "@/common/form/FormInput";
import SectionHeader from "@/common/header/SectionHeader";
import { inputClass } from "@/pages/Login";
import { Room } from "@/store/consumer/basic/building/types/building";
import {
  useAddRoomMutation,
  useUpdateRoomMutation,
} from "@/store/consumer/basic/room/roomApi";
import { updateRoomPayload } from "@/store/consumer/basic/room/types/room";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { LuPackage } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom"; // TODO: confirm this matches your router
import { z } from "zod";
import IconSectionHeader from "../../renewable/IconSectionHeader";

// NOTE: wall-type / roof-type / lighting-type are free-text lookups on the
// backend (e.g. "Wall 1", "Roof 1", "non-in-celing fluorescent luminaire"),
// not a small fixed enum, so those fields were switched from <CommonSelect>
// to plain text <FormInput> below.

const CONSTRUCTION_TYPES = [
  { label: "Light", value: "light" },
  { label: "Medium", value: "medium" },
  { label: "Heavy", value: "heavy" },
];

const INDOOR_SHADING_OPTIONS = [
  { label: "Yes", value: "True" },
  { label: "No", value: "False" },
];

// Body posture / activity — backend key "activity-type"
// (this used to be what the form called "velocityType")
const ACTIVITY_TYPES = [
  { label: "Seated", value: "seated" },
  { label: "Standing", value: "standing" },
  { label: "Walking", value: "walking" },
];

// Air movement / velocity — backend key "velocity-type"
// (this is a new concept the form did not previously capture correctly)
const VELOCITY_TYPES = [
  { label: "Still Air", value: "still air" },
  { label: "Low Velocity", value: "low velocity" },
  { label: "Medium Velocity", value: "medium velocity" },
  { label: "High Velocity", value: "high velocity" },
];

const formSchema = z.object({
  title: z.string().nonempty("Title is required"),

  construction: z.string().nonempty("Please select construction type"),
  constructionSubtype: z.string().nonempty("Construction subtype is required"),
  percentageGlass: z.string().nonempty("Percentage glass is required"),
  city: z.string().nonempty("City is required"),
  month: z.string().nonempty("Month is required"),
  startHour: z.string().nonempty("Start hour is required"),
  endHour: z.string().nonempty("End hour is required"),
  percentageMDDB: z.string().nonempty("Percentage MDDB is required"),
  percentageMDHR: z.string().nonempty("Percentage MDHR is required"),
  lsm: z.string().nonempty("LSM is required"),
  fenestrationArea: z.string().nonempty("Fenestration area is required"),
  floorArea: z.string().nonempty("Floor area is required"),

  wallType: z.string().nonempty("Wall type is required"),
  northWallArea: z.string().nonempty("North wall area is required"),
  southWallArea: z.string().nonempty("South wall area is required"),
  eastWallArea: z.string().nonempty("East wall area is required"),
  westWallArea: z.string().nonempty("West wall area is required"),

  roofType: z.string().nonempty("Roof type is required"),
  roofArea: z.string().nonempty("Roof area is required"),

  uValue: z.string().nonempty("U-value is required"),
  indoorShading: z.string().nonempty("Please select indoor shading"),
  beamSHGC: z.string().nonempty("Beam solar heat gain coefficient is required"),
  beamIndoorAttenuation: z
    .string()
    .nonempty("Beam indoor solar attenuation coefficient is required"),
  diffuseSHGC: z
    .string()
    .nonempty("Diffuse solar heat gain coefficient is required"),
  diffuseIndoorAttenuation: z
    .string()
    .nonempty("Diffuse indoor solar attenuation coefficient is required"),
  northSunlitArea: z
    .string()
    .nonempty("North fenestration sunlit area is required"),
  eastSunlitArea: z
    .string()
    .nonempty("East fenestration sunlit area is required"),
  southSunlitArea: z
    .string()
    .nonempty("South fenestration sunlit area is required"),
  westSunlitArea: z
    .string()
    .nonempty("West fenestration sunlit area is required"),
  northShadedArea: z
    .string()
    .nonempty("North fenestration shaded area is required"),
  eastShadedArea: z
    .string()
    .nonempty("East fenestration shaded area is required"),
  southShadedArea: z
    .string()
    .nonempty("South fenestration shaded area is required"),
  westShadedArea: z
    .string()
    .nonempty("West fenestration shaded area is required"),

  lightingType: z.string().nonempty("Lighting type is required"),
  numberLighting: z.string().nonempty("Number of lighting is required"),
  lightingRating: z.string().nonempty("Lighting rating is required"),

  peopleCapacity: z.string().nonempty("Capacity is required"),
  velocityType: z.string().nonempty("Please select a velocity type"),
  activityType: z.string().nonempty("Please select an activity type"),
  activityLocation: z.string().nonempty("Activity location is required"),

  infiltrationRate: z.string().nonempty("Infiltration rate is required"),
});

type FormData = z.infer<typeof formSchema>;

// Backend expects percentage fields as strings with a trailing "%"
// (e.g. "50%", "5.0%"). Users just type the number; we append the sign here.
const asPercent = (value: string) => {
  const trimmed = value.trim();
  return trimmed.endsWith("%") ? trimmed : `${trimmed}%`;
};

const buildAddRoomPayload = (data: FormData, buildingId: string) => ({
  buildingId,
  title: data.title,
  construction: data.construction,
  "construction-subtype": data.constructionSubtype,
  "percentage-glass": asPercent(data.percentageGlass),
  "start-hour": data.startHour,
  "end-hour": data.endHour,
  "wall-type": data.wallType,
  city: data.city,
  month: data.month,
  "percentage-MDDB": asPercent(data.percentageMDDB),
  LSM: Number(data.lsm),
  "north-wall-area": Number(data.northWallArea),
  "east-wall-area": Number(data.eastWallArea),
  "south-wall-area": Number(data.southWallArea),
  "west-wall-area": Number(data.westWallArea),
  "roof-type": data.roofType,
  "roof-area": Number(data.roofArea),
  "north-fenestration-area-shaded": Number(data.northShadedArea),
  "north-fenestration-area-sunlit": Number(data.northSunlitArea),
  "east-fenestration-area-shaded": Number(data.eastShadedArea),
  "east-fenestration-area-sunlit": Number(data.eastSunlitArea),
  "south-fenestration-area-shaded": Number(data.southShadedArea),
  "south-fenestration-area-sunlit": Number(data.southSunlitArea),
  "west-fenestration-area-shaded": Number(data.westShadedArea),
  "west-fenestration-area-sunlit": Number(data.westSunlitArea),
  "indoor-shading": data.indoorShading,
  "u-value-window": Number(data.uValue),
  "beam-solar-heat-gain-coefficient": Number(data.beamSHGC),
  "diffuse-solar-heat-gain-coefficient": Number(data.diffuseSHGC),
  "beam-indoor-solar-attenuation-coefficient": Number(
    data.beamIndoorAttenuation,
  ),
  "diffuse-indoor-solar-attenuation-coefficient": Number(
    data.diffuseIndoorAttenuation,
  ),
  "lighting-type": data.lightingType,
  "number-lighting": Number(data.numberLighting),
  "lighting-rating": Number(data.lightingRating),
  "activity-type": data.activityType,
  "activity-location": data.activityLocation,
  "velocity-type": data.velocityType,
  "occupant-capacity": Number(data.peopleCapacity),
  "percentage-MDHR": asPercent(data.percentageMDHR),
  "infiltration-rate": Number(data.infiltrationRate),
  "fenestration-area": Number(data.fenestrationArea),
  "floor-area": Number(data.floorArea),
});
export type AddRoomPayload = ReturnType<typeof buildAddRoomPayload>;

interface AddRoomProps {
  room?: Room;
  onClose?: () => void;
}
const AddRoom: React.FC<AddRoomProps> = ({ room, onClose }) => {
  const { id: buildingId } = useParams<{ id: string }>();

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Room 1",
      construction: "medium",
      constructionSubtype: "with carpet",
      percentageGlass: "20",
      city: "San Francisco",
      month: "Jul",
      startHour: "08:00",
      endHour: "22:00",
      percentageMDDB: "2",
      percentageMDHR: "50",
      lsm: "1",
      fenestrationArea: "4",
      floorArea: "32",
      wallType: "Wall 1",
      northWallArea: "12",
      southWallArea: "12",
      eastWallArea: "10",
      westWallArea: "10",
      roofType: "Roof 1",
      roofArea: "55",
      uValue: "2.2",
      indoorShading: "True",
      beamSHGC: "0.6",
      beamIndoorAttenuation: "0.3",
      diffuseSHGC: "0.5",
      diffuseIndoorAttenuation: "0.3",
      northSunlitArea: "1",
      eastSunlitArea: "1",
      southSunlitArea: "1",
      westSunlitArea: "1",
      northShadedArea: "1",
      eastShadedArea: "1",
      southShadedArea: "1",
      westShadedArea: "1",
      lightingType: "non-in-celing fluorescent luminaire",
      numberLighting: "6",
      lightingRating: "9",
      peopleCapacity: "4",
      velocityType: "low velocity",
      activityType: "seated",
      activityLocation: "Living Room",
      infiltrationRate: "0.5",
    },
  });

  const [addRoom, { isLoading: isAdding }] = useAddRoomMutation();
  const [updateRoom, { isLoading: isUpdating }] = useUpdateRoomMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!room) return;

    reset({
      title: room.title,
      construction: room.construction,
      constructionSubtype: room.construction_subtype,
      percentageGlass: String(room.percentage_glass).replace("%", ""),
      city: room.city,
      month: room.month,
      startHour: room.start_hour,
      endHour: room.end_hour,
      percentageMDDB: String(room.percentage_MDDB).replace("%", ""),
      percentageMDHR: String(room.percentage_MDHR).replace("%", ""),
      lsm: String(room.LSM),
      fenestrationArea: String(room.fenestration_area),
      floorArea: String(room.floor_area),
      wallType: room.wall_type,
      northWallArea: String(room.north_wall_area),
      southWallArea: String(room.south_wall_area),
      eastWallArea: String(room.east_wall_area),
      westWallArea: String(room.west_wall_area),
      roofType: room.roof_type,
      roofArea: String(room.roof_area),
      uValue: String(room.u_value_window),
      indoorShading: String(room.indoor_shading),
      beamSHGC: String(room.beam_solar_heat_gain_coefficient),
      beamIndoorAttenuation: String(
        room.beam_indoor_solar_attenuation_coefficient,
      ),
      diffuseSHGC: String(room.diffuse_solar_heat_gain_coefficient),
      diffuseIndoorAttenuation: String(
        room.diffuse_indoor_solar_attenuation_coefficient,
      ),
      northSunlitArea: String(room.north_fenestration_area_sunlit),
      eastSunlitArea: String(room.east_fenestration_area_sunlit),
      southSunlitArea: String(room.south_fenestration_area_sunlit),
      westSunlitArea: String(room.west_fenestration_area_sunlit),
      northShadedArea: String(room.north_fenestration_area_shaded),
      eastShadedArea: String(room.east_fenestration_area_shaded),
      southShadedArea: String(room.south_fenestration_area_shaded),
      westShadedArea: String(room.west_fenestration_area_shaded),
      lightingType: room.lighting_type,
      numberLighting: String(room.number_lighting),
      lightingRating: String(room.lighting_rating),
      // NOTE: this previously read `room.lighting_rating` (a copy/paste bug).
      // Update `occupant_capacity` below to whatever field your `Room` type
      // actually uses for capacity — it wasn't present in the shared type.
      peopleCapacity: String(
        (room as unknown as { occupant_capacity?: number }).occupant_capacity ??
          "",
      ),
      velocityType: room.velocity_type,
      activityType: room.activity_type,
      activityLocation: room.activity_location,
      infiltrationRate: String(room.infiltration_rate),
    });
  }, [room, reset]);

  const buildUpdateRoomPayload = (
    data: FormData,
    room: Room,
    buildingId: string,
  ): updateRoomPayload => ({
    user_building_details_id: room.user_building_details_id,
    buildingId,
    title: data.title,
    construction: data.construction,
    "construction-subtype": data.constructionSubtype,
    "percentage-glass": asPercent(data.percentageGlass),
    "start-hour": data.startHour,
    "end-hour": data.endHour,
    "wall-type": data.wallType,
    city: data.city,
    month: data.month,
    "percentage-MDDB": asPercent(data.percentageMDDB),
    LSM: Number(data.lsm),
    "north-wall-area": Number(data.northWallArea),
    "east-wall-area": Number(data.eastWallArea),
    "south-wall-area": Number(data.southWallArea),
    "west-wall-area": Number(data.westWallArea),
    "roof-type": data.roofType,
    "roof-area": Number(data.roofArea),
    "north-fenestration-area-shaded": Number(data.northShadedArea),
    "north-fenestration-area-sunlit": Number(data.northSunlitArea),
    "east-fenestration-area-shaded": Number(data.eastShadedArea),
    "east-fenestration-area-sunlit": Number(data.eastSunlitArea),
    "south-fenestration-area-shaded": Number(data.southShadedArea),
    "south-fenestration-area-sunlit": Number(data.southSunlitArea),
    "west-fenestration-area-shaded": Number(data.westShadedArea),
    "west-fenestration-area-sunlit": Number(data.westSunlitArea),
    "indoor-shading": data.indoorShading,
    "u-value-window": Number(data.uValue),
    "beam-solar-heat-gain-coefficient": Number(data.beamSHGC),
    "diffuse-solar-heat-gain-coefficient": Number(data.diffuseSHGC),
    "beam-indoor-solar-attenuation-coefficient": Number(
      data.beamIndoorAttenuation,
    ),
    "diffuse-indoor-solar-attenuation-coefficient": Number(
      data.diffuseIndoorAttenuation,
    ),
    "lighting-type": data.lightingType,
    "number-lighting": Number(data.numberLighting),
    "lighting-rating": Number(data.lightingRating),
    "activity-type": data.activityType,
    "activity-location": data.activityLocation,
    "velocity-type": data.velocityType,
    "occupant-capacity": Number(data.peopleCapacity),
    "percentage-MDHR": asPercent(data.percentageMDHR),
    "infiltration-rate": Number(data.infiltrationRate),
    "fenestration-area": Number(data.fenestrationArea),
    "floor-area": Number(data.floorArea),
  });
  const onSubmit = async (data: FormData) => {
    if (!buildingId) {
      console.error("Missing buildingId from route params");
      return;
    }
    try {
      if (room) {
        const payload = buildUpdateRoomPayload(data, room, buildingId);
        await updateRoom({
          room_id: room.id,
          body: payload,
        }).unwrap();

        onClose?.();
      } else {
        const payload = buildAddRoomPayload(data, buildingId);
        await addRoom(payload).unwrap();
        navigate("/basic-consumer/building");
      }
      reset();
    } catch (err) {
      console.error(`Failed to ${room ? "update" : "add"} room:`, err);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <BackButton to="../" />
      <IconSectionHeader
        icon={LuPackage}
        title={`${room ? "Edit" : "Add Room"}  to Building`}
        description={`Then ${room ? "Edit" : "Add"} appliances, electrical devices, and HVAC systems.`}
        iconBgClassName="bg-[#FFEDD4]"
        iconClassName="text-[#F54900]"
      />

      <div className="space-y-2">
        <SectionHeader size="xl" title="Room Information" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <FormInput
            name="title"
            register={register}
            errors={errors}
            placeholder="Title"
          />

          <div>
            <Controller
              control={control}
              name="construction"
              render={({ field }) => (
                <CommonSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  item={CONSTRUCTION_TYPES}
                  placeholder="Construction"
                  className="w-full"
                />
              )}
            />
            {errors.construction && (
              <p className={inputClass.error}>{errors.construction.message}</p>
            )}
          </div>

          <FormInput
            name="constructionSubtype"
            register={register}
            errors={errors}
            placeholder="Construction Subtype"
          />
          <FormInput
            name="percentageGlass"
            register={register}
            errors={errors}
            placeholder="Percentage Glass (e.g. 20)"
          />
          <FormInput
            name="city"
            register={register}
            errors={errors}
            placeholder="City"
          />
          <FormInput
            name="month"
            register={register}
            errors={errors}
            placeholder="Month"
          />
          <FormInput
            name="startHour"
            register={register}
            errors={errors}
            placeholder="Start Hour (e.g. 08:00)"
          />
          <FormInput
            name="endHour"
            register={register}
            errors={errors}
            placeholder="End Hour (e.g. 22:00)"
          />
          <FormInput
            name="percentageMDDB"
            register={register}
            errors={errors}
            placeholder="Percentage MDDB (e.g. 5)"
          />
          <FormInput
            name="percentageMDHR"
            register={register}
            errors={errors}
            placeholder="Percentage MDHR (e.g. 5)"
          />
          <FormInput
            name="lsm"
            register={register}
            errors={errors}
            placeholder="LSM"
          />
          <FormInput
            name="fenestrationArea"
            register={register}
            errors={errors}
            placeholder="Fenestration Area"
          />
          <FormInput
            name="floorArea"
            register={register}
            errors={errors}
            placeholder="Floor Area"
          />
        </div>
      </div>

      <div className="space-y-2">
        <SectionHeader size="xl" title="Walls" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <FormInput
            name="wallType"
            register={register}
            errors={errors}
            placeholder="Wall Type (e.g. Wall 1)"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FormInput
            name="northWallArea"
            register={register}
            errors={errors}
            placeholder="North Wall Area"
          />
          <FormInput
            name="southWallArea"
            register={register}
            errors={errors}
            placeholder="South Wall Area"
          />
          <FormInput
            name="eastWallArea"
            register={register}
            errors={errors}
            placeholder="East Wall Area"
          />
          <FormInput
            name="westWallArea"
            register={register}
            errors={errors}
            placeholder="West Wall Area"
          />
        </div>
      </div>

      {/* Roof */}
      <div className="space-y-2">
        <SectionHeader size="xl" title="Roof" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormInput
            name="roofType"
            register={register}
            errors={errors}
            placeholder="Roof Type (e.g. Roof 1)"
          />
          <FormInput
            name="roofArea"
            register={register}
            errors={errors}
            placeholder="Area"
          />
        </div>
      </div>

      {/* Fenestration */}
      <div className="space-y-2">
        <SectionHeader size="xl" title="Fenestration" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormInput
            name="uValue"
            register={register}
            errors={errors}
            placeholder="U-value"
          />

          <div>
            <Controller
              control={control}
              name="indoorShading"
              render={({ field }) => (
                <CommonSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  item={INDOOR_SHADING_OPTIONS}
                  placeholder="Indoor Shading"
                  className="w-full"
                />
              )}
            />
            {errors.indoorShading && (
              <p className={inputClass.error}>{errors.indoorShading.message}</p>
            )}
          </div>

          <FormInput
            name="beamSHGC"
            register={register}
            errors={errors}
            placeholder="Beam Solar Heat Gain Coefficient"
          />
          <FormInput
            name="beamIndoorAttenuation"
            register={register}
            errors={errors}
            placeholder="Beam Indoor Solar attenuation Coefficient"
          />
          <FormInput
            name="diffuseSHGC"
            register={register}
            errors={errors}
            placeholder="Diffuse Solar Heat Gain Coefficient"
          />
          <FormInput
            name="diffuseIndoorAttenuation"
            register={register}
            errors={errors}
            placeholder="Diffuse Indoor Solar attenuation Coefficient"
          />
          <FormInput
            name="northSunlitArea"
            register={register}
            errors={errors}
            placeholder="North Fenestration Sunlit Area"
          />
          <FormInput
            name="eastSunlitArea"
            register={register}
            errors={errors}
            placeholder="East Fenestration Sunlit Area"
          />
          <FormInput
            name="southSunlitArea"
            register={register}
            errors={errors}
            placeholder="South Fenestration Sunlit Area"
          />
          <FormInput
            name="westSunlitArea"
            register={register}
            errors={errors}
            placeholder="West Fenestration Sunlit Area"
          />
          <FormInput
            name="northShadedArea"
            register={register}
            errors={errors}
            placeholder="North Fenestration Shaded Area"
          />
          <FormInput
            name="eastShadedArea"
            register={register}
            errors={errors}
            placeholder="East Fenestration Shaded Area"
          />
          <FormInput
            name="southShadedArea"
            register={register}
            errors={errors}
            placeholder="South Fenestration Shaded Area"
          />
          <FormInput
            name="westShadedArea"
            register={register}
            errors={errors}
            placeholder="West Fenestration Shaded Area"
          />
        </div>
      </div>

      {/* Lighting */}
      <div className="space-y-2">
        <SectionHeader size="xl" title="Lighting" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-1">
          <FormInput
            name="lightingType"
            register={register}
            errors={errors}
            placeholder="Lighting Type (e.g. non-in-celing fluorescent luminaire)"
          />
          <FormInput
            name="numberLighting"
            register={register}
            errors={errors}
            placeholder="Number of Lighting"
          />
          <FormInput
            name="lightingRating"
            register={register}
            errors={errors}
            placeholder="Lighting Rating"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Energy Consumption from lighting: 0
        </p>
      </div>

      {/* People */}
      <div className="space-y-2">
        <SectionHeader size="xl" title="People" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FormInput
            name="peopleCapacity"
            register={register}
            errors={errors}
            placeholder="Capacity"
          />

          <div>
            <Controller
              control={control}
              name="activityType"
              render={({ field }) => (
                <CommonSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  item={ACTIVITY_TYPES}
                  placeholder="Activity Type"
                  className="w-full"
                />
              )}
            />
            {errors.activityType && (
              <p className={inputClass.error}>{errors.activityType.message}</p>
            )}
          </div>

          <div>
            <Controller
              control={control}
              name="velocityType"
              render={({ field }) => (
                <CommonSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  item={VELOCITY_TYPES}
                  placeholder="Velocity Type"
                  className="w-full"
                />
              )}
            />
            {errors.velocityType && (
              <p className={inputClass.error}>{errors.velocityType.message}</p>
            )}
          </div>

          <FormInput
            name="activityLocation"
            register={register}
            errors={errors}
            placeholder="Activity Location"
          />
        </div>
      </div>

      {/* Infiltration */}
      <div className="space-y-2">
        <SectionHeader size="xl" title="Infiltration" />
        <div className="max-w-xs">
          <FormInput
            name="infiltrationRate"
            register={register}
            errors={errors}
            placeholder="Infiltration Rate"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <CommonButton
          type="submit"
          disabled={isAdding || isUpdating}
          isLoading={isAdding || isUpdating}
          loadingText={room ? "Updating..." : "Adding..."}
        >
          {room ? "Update Room" : "Add Room"}
        </CommonButton>
      </div>
    </form>
  );
};

export default AddRoom;
