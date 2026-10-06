import ActionButton from "@/common/button/ActionButton";
import BackButton from "@/common/button/BackButton";
import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import CommonHeader from "@/common/header/CommonHeader";
import SectionHeader from "@/common/header/SectionHeader";
import EmptyState from "@/common/loading/EmptyState";
import Spinner from "@/common/loading/Spinner";
import {
  useDeleteEvMutation,
  useGetUserEVQuery,
  useUpdateEvMutation,
} from "@/store/consumer/basic/ev/EVApi";
import {
  AddVehiclePayload,
  EvCharger,
} from "@/store/consumer/basic/ev/types/ev";
import { Battery, Car, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BMiniCard from "./card/BMiniCard";
import Counter from "./Counter";

const RECOMMENDATIONS = [
  "Consider Level 2 charging installation for overnight charging",
  "Solar panels can offset 80% of your EV charging needs",
  "Time-of-use electricity rates can reduce charging costs by 40%",
];

const toUpdatePayload = (v: EvCharger, noOfEvs: string): AddVehiclePayload => ({
  buildingId:
    v.user_building_details_id ?? "97bc8736-ccb0-464e-89cb-3fc5290d1d15",
  chargerModel: v.chargerModelId,
  powerRating: v.power_rating,
  chargingHours: v.charging_hours,
  name: v.name,
  noOfEvs,
  title: v.title,
  "battery-manufacturer": v.battery_manufacturer,
  "battery-class": v.battery_class,
  "battery-model": v.battery_model,
  "battery-length": v.battery_length,
  "battery-diameter": v.battery_diameter,
  "battery-height": v.battery_height,
  "battery-width": v.battery_width,
  "battery-thickness": v.battery_thickness,
  "battery-mass": v.battery_mass,
  "battery-capacity": v.battery_capacity,
  "battery-voltage": v.battery_voltage,
  "battery-peak-C-rate": v.battery_peak_C_rate,
  "battery-continous-C-rate": v.battery_continous_C_rate,
  "average-energy-consumption": v.average_energy_consumption,
  "vehicle-range": v.vehicle_range,
  "nominal-voltage": v.nominal_voltage,
});

const EVManagement = () => {
  const { buildingId, roomId } = useParams<{
    buildingId: string;
    roomId: string;
  }>();

  console.log("EVManagement params:", { buildingId, roomId }); // add this

  const { data, isLoading } = useGetUserEVQuery();
  const [updateEv] = useUpdateEvMutation();
  const [deleteEv] = useDeleteEvMutation();
  const EMPTY: EvCharger[] = [];

  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const vehicles = data?.data ?? EMPTY;

  useEffect(() => {
    setQuantities((prev) => {
      let changed = false;
      const next = { ...prev };
      vehicles.forEach((v) => {
        if (next[v.id] === undefined) {
          next[v.id] = Number(v.no_of_ev) || 1;
          changed = true;
        }
      });
      return changed ? next : prev; // bail out if nothing actually changed
    });
  }, [vehicles]);

  const changeQty = async (vehicle: EvCharger, delta: number) => {
    const nextValue = Math.max(1, (quantities[vehicle.id] ?? 1) + delta);
    setQuantities((q) => ({ ...q, [vehicle.id]: nextValue }));

    try {
      await updateEv({
        ev_id: vehicle.id,
        ev: toUpdatePayload(vehicle, String(nextValue)),
      }).unwrap();
    } catch (error) {
      console.error("Failed to update vehicle quantity:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEv(id).unwrap();
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
    }
  };

  const totalVehicles = vehicles.length;
  const totalBattery = vehicles.reduce(
    (sum, v) => sum + v.battery_capacity * (Number(v.no_of_ev) || 1),
    0,
  );
  const monthlyDemand = vehicles.reduce(
    (sum, v) =>
      sum +
      v.average_energy_consumption *
        v.vehicle_range *
        (Number(v.no_of_ev) || 1),
    0,
  );

  const stats = [
    {
      label: "Total Vehicles",
      value: String(totalVehicles),
      sub: "",
      icon: Car,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Total Battery",
      value: String(totalBattery),
      sub: "kWh capacity",
      icon: Battery,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "Monthly Demand",
      value: String(Math.round(monthlyDemand)),
      sub: "kWh",
      icon: Zap,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ];

  const chargingStats = [
    {
      label: "Monthly Charging Cost",
      value: `$${(monthlyDemand * 0.15).toFixed(0)}`,
      des: "at $0.15/kWh",
      valueClass: "text-primary",
    },
    {
      label: "Average Charging Time",
      value: vehicles.length
        ? `${(
            vehicles.reduce((sum, v) => sum + Number(v.charging_hours), 0) /
            vehicles.length
          ).toFixed(0)} Hours`
        : "0 Hours",
      des: "Per Charging Session",
      valueClass: "text-primary",
    },
    {
      label: "Building Energy Impact",
      value: "+36%",
      des: "increase in monthly usage",
      valueClass: "text-orange-500",
    },
  ];

  return (
    <div className=" space-y-6">
      <BackButton />

      <CommonBorderWrapper isShadow className="">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
          <div>
            <SectionHeader
              title="Added Electric Vehicles"
              description="Manage electric vehicles for this building"
            />
          </div>
          <CommonButton
            to={`/basic-consumer/building/add-ev-database/${buildingId}/${roomId}`}
            showDefaultIcon
          >
            Add More
          </CommonButton>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {stats.map((s) => (
            <BMiniCard
              key={s.label}
              icon={s.icon}
              label={s.label}
              value={s.value}
              des={s.sub}
            />
          ))}
        </div>
      </CommonBorderWrapper>

      <CommonBorderWrapper isShadow className="">
        <SectionHeader size="xl" title="Vehicle List" />

        {isLoading ? (
          <Spinner text={"Vehicle loading..."} size="lg" />
        ) : vehicles.length > 0 ? (
          <div className="space-y-4">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="flex flex-col md:flex-row sm:items-center justify-between bg-[#EAF7E6]/30 border border-[#E7E9E8] rounded-xl p-4 w-full gap-4 "
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="text-4xl">🚗</div>
                  <div className="flex-1 flex flex-col gap-1 w-full ">
                    <CommonHeader className="font-bold!">
                      {v.title}
                    </CommonHeader>

                    <div className="w-full flex flex-col md:flex-row justify-between ">
                      <div className="flex">
                        <CommonHeader size="sm">Battery:</CommonHeader>
                        <CommonHeader
                          size="sm"
                          className="font-bold! text-[#112518]!"
                        >
                          {v.battery_capacity} kWh
                        </CommonHeader>
                      </div>
                      <div className="flex">
                        <CommonHeader size="sm">Range:</CommonHeader>
                        <CommonHeader
                          size="sm"
                          className="font-bold! text-primary!"
                        >
                          {v.vehicle_range} mi
                        </CommonHeader>
                      </div>
                      <div className="flex mr-10">
                        <CommonHeader size="sm">Charging:</CommonHeader>
                        <CommonHeader
                          size="sm"
                          className="font-bold! text-[#112518]!"
                        >
                          {v.chargerModel.name}
                        </CommonHeader>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Counter
                    value={quantities[v.id] ?? 1}
                    onChange={(value) =>
                      changeQty(v, value - (quantities[v.id] ?? 1))
                    }
                    min={1}
                    max={10}
                  />
                  <ActionButton
                    type="delete"
                    onClick={() => handleDelete(v.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No vehicles found." />
        )}
      </CommonBorderWrapper>

      <CommonBorderWrapper isShadow className="">
        <SectionHeader size="xl" title="Charging Impact Summary" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {chargingStats.map((stat) => (
            <BMiniCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              des={stat.des}
              valueClass={stat.valueClass}
            />
          ))}
        </div>

        <CommonBorderWrapper className="bg-[#EFF6FF]! border-[#BEDBFF]!">
          <CommonHeader size="md" className="font-bold! text-[#112518]! mb-2">
            Charging Recommendations
          </CommonHeader>
          {RECOMMENDATIONS.map((r, i) => (
            <CommonHeader key={i} size="sm" className=" mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#155DFC] shrink-0" />
              {r}
            </CommonHeader>
          ))}
        </CommonBorderWrapper>

        <div className="flex flex-col sm:flex-row gap-3">
          <CommonButton
            variant="outline"
            to={`/basic-consumer/building/add-ev-database/${buildingId}/${roomId}`}
            className="w-full"
          >
            Add More Vehicles
          </CommonButton>
        </div>
      </CommonBorderWrapper>
    </div>
  );
};

export default EVManagement;
