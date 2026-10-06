import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import CommonTabs from "@/common/button/CommonTabs";
import SearchInput from "@/common/form/SearchInput";
import SectionHeader from "@/common/header/SectionHeader";
import { BuildingApplianceReport } from "@/store/consumer/basic/appliance/types/appliance";
import {
  Filter,
  Laptop,
  Lightbulb,
  Plug,
  Snowflake,
  Tv,
  UtensilsCrossed,
} from "lucide-react";
import { useMemo, useState } from "react";
import ManagementCard, { Appliance, Category } from "./ManagementCard";

interface Room {
  id: string;
  name: string;
  subtitle: string;
  appliances: Appliance[];
}

interface ApplianceInventoryProps {
  report?: BuildingApplianceReport;
  isLoading?: boolean;
}

// One representative icon per API category_key
const CATEGORY_ICONS: Record<string, typeof Lightbulb> = {
  lighting: Lightbulb,
  cooling: Snowflake,
  kitchen: UtensilsCrossed,
  entertainment: Tv,
  office: Laptop,
};

const ApplianceInventory = ({ report, isLoading }: ApplianceInventoryProps) => {
  const [activeFilter, setActiveFilter] = useState<"All" | Category>("All");
  const [search, setSearch] = useState("");

  const rooms: Room[] = useMemo(() => {
    return (report?.inventory ?? []).map((roomInv) => ({
      id: roomInv.roomId,
      name: roomInv.roomName,
      subtitle: `${roomInv.roomName} • ${roomInv.totalAppliances} appliances`,
      appliances: roomInv.appliances.map((a) => ({
        id: a.id,
        name: a.name,
        category: a.category as Category,
        watts: a.powerRating,
        qty: a.quantity,
        usageKwhDay: a.dailyUsageKwh,
        icon: CATEGORY_ICONS[a.category_key] ?? Plug,
      })),
    }));
  }, [report]);

  const filterOptions: Array<"All" | Category> = useMemo(() => {
    const categories = Array.from(
      new Set(rooms.flatMap((room) => room.appliances.map((a) => a.category))),
    ) as Category[];
    return ["All", ...categories];
  }, [rooms]);

  const filterTabs = filterOptions.map((tab) => ({ label: tab, value: tab }));

  const filteredRooms = useMemo(() => {
    return rooms
      .map((room) => ({
        ...room,
        appliances: room.appliances.filter((a) => {
          const matchesFilter =
            activeFilter === "All" || a.category === activeFilter;
          const matchesSearch = a.name
            .toLowerCase()
            .includes(search.toLowerCase());
          return matchesFilter && matchesSearch;
        }),
      }))
      .filter((room) => room.appliances.length > 0);
  }, [activeFilter, search, rooms]);

  return (
    <CommonBorderWrapper isShadow className="">
      <div className=" flex flex-col sm:flex-row items-center justify-between">
        <SectionHeader title="Appliance Inventory" />

        <CommonButton
          variant="ghost"
          showDefaultIcon={false}
          className="text-[#758179]! hover:text-white!"
        >
          <Filter className="w-4 h-4 " />
          Filters
        </CommonButton>
      </div>

      <div className="">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search appliances..."
        />

        <CommonTabs
          tabs={filterTabs}
          activeTab={activeFilter}
          onChange={(value) => setActiveFilter(value as "All" | Category)}
          className="flex-wrap gap-2 mt-4"
        />
      </div>

      <div className=" space-y-4">
        {!isLoading && filteredRooms.length === 0 && (
          <p className="text-sm text-slate-400 py-6 text-center">
            No appliances match your search.
          </p>
        )}
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="bg-[#EAF7E6]/30 border border-[#E7E9E8] rounded-xl p-5"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-3">
              <div>
                <SectionHeader
                  size="xl"
                  title={room.name}
                  description={room.subtitle}
                />
              </div>
              <CommonButton
                showDefaultIcon
                to={`../add-appliance/${report?.buildingId}/${room.id}`}
              >
                Add Appliances
              </CommonButton>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {room.appliances.map((a) => (
                <ManagementCard key={a.id} appliance={a} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </CommonBorderWrapper>
  );
};

export default ApplianceInventory;
