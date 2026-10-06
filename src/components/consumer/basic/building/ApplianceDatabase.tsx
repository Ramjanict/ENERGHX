import BackButton from "@/common/button/BackButton";
import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import CommonTabs from "@/common/button/CommonTabs";
import SearchInput from "@/common/form/SearchInput";
import SectionHeader from "@/common/header/SectionHeader";
import EmptyState from "@/common/loading/EmptyState";
import Spinner from "@/common/loading/Spinner";
import useDebounce from "@/common/useDebounce";
import Pagination from "@/dashboard/components/consumerDashboard/users/Pagination";
import {
  useAddApplianceMutation,
  useGetApplianceCategoryQuery,
} from "@/store/consumer/basic/appliance/applianceApi";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ApplianceCard from "./card/ApplianceCard";

const ApplianceDatabase = () => {
  const { buildingId, roomId } = useParams<{
    buildingId: string;
    roomId: string;
  }>();

  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const deBounceSearch = useDebounce(search, 500);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const { data, isLoading, isFetching } = useGetApplianceCategoryQuery(
    { category: filter, search: deBounceSearch, page, limit: 10 },
    { skip: !filter, refetchOnMountOrArgChange: true },
  );

  const categories = data?.data?.categories ?? [];
  const appliances = data?.data?.appliances ?? [];
  const totalPages = data?.data?.pagination?.totalPages ?? 1;

  const CATEGORY_TABS = categories.map((category) => ({
    label: category.name,
    value: category.key,
  }));

  const totalAdded = Object.values(quantities).reduce((a, b) => a + b, 0);

  const setQty = (id: string, value: number) =>
    setQuantities((q) => ({ ...q, [id]: value }));

  const [addAppliance, { isLoading: isAdding }] = useAddApplianceMutation();

  const handleAdd = async () => {
    if (!roomId) return;
    const selected = appliances.filter(
      (a) => (quantities[a.applianceId] ?? 0) > 0,
    );

    if (selected.length === 0) return;

    try {
      await Promise.all(
        selected.map((appliance) =>
          addAppliance({
            typeId: appliance.typeId,
            applianceId: appliance.applianceId,
            powerRating: appliance.powerRating,
            noOfAppliances: String(quantities[appliance.applianceId]),
            latentHeat: appliance.latentHeat,
            sensibleHeat: appliance.sensibleHeat,
            roomId,
          }).unwrap(),
        ),
      );
      setQuantities({});
    } catch (error) {
      console.error("Failed to add appliances:", error);
    }
  };

  return (
    <div className="space-y-6">
      <BackButton />
      <CommonBorderWrapper isShadow>
        <SectionHeader
          title="Appliance Database"
          description="Search and add appliances to your room"
        />

        {isLoading ? (
          <Spinner text={"Appliances loading..."} size="lg" />
        ) : appliances.length > 0 ? (
          <>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search appliances..."
              isFetching={isFetching}
            />
            <CommonTabs
              tabs={CATEGORY_TABS}
              activeTab={filter}
              onChange={setFilter}
              className="flex-wrap gap-2"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {appliances.map((a) => (
                <ApplianceCard
                  key={a.applianceId}
                  emoji={a.image_url ?? ""}
                  name={a.name}
                  category={a.category.name}
                  power={Number(a.powerRating)}
                  quantity={quantities[a.applianceId] ?? 0}
                  onQuantityChange={(value) => setQty(a.applianceId, value)}
                  min={Number(a.min_consumption)}
                />
              ))}
            </div>

            <Pagination
              currentPage={page}
              onPageChange={setPage}
              totalPages={totalPages}
              showText="Appliances"
              title=""
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <CommonButton
                variant="outline"
                to={`../custom-appliance/${buildingId}/${roomId}`}
              >
                Upload Custom Appliance
              </CommonButton>

              <CommonButton
                disabled={totalAdded === 0}
                isLoading={isAdding}
                loadingText="Processing..."
                onClick={handleAdd}
              >
                Save ({totalAdded} appliances)
              </CommonButton>
            </div>
          </>
        ) : (
          <EmptyState message="No appliances found." />
        )}
      </CommonBorderWrapper>
    </div>
  );
};

export default ApplianceDatabase;
