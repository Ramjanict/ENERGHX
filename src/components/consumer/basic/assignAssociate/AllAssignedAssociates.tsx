import BackButton from "@/common/button/BackButton";
import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import CommonTabs from "@/common/button/CommonTabs";
import SearchInput from "@/common/form/SearchInput";
import SectionHeader from "@/common/header/SectionHeader";
import EmptyState from "@/common/loading/EmptyState";
import Spinner from "@/common/loading/Spinner";
import useDebounce from "@/common/useDebounce";
import AssociateCard, {
  Associate,
} from "@/components/consumer/basic/assignAssociate/AssociateCard";
import AssociateProfileModal from "@/components/consumer/basic/assignAssociate/AssociateProfileModal";
import AssociatesAbout from "@/components/consumer/basic/assignAssociate/AssociatesAbout";
import {
  useGetAssociatesQuery,
  useSelectAssociatesMutation,
} from "@/store/consumer/basic/associates/associatesApi";
import {
  Associate as ApiAssociate,
  AssociateType,
} from "@/store/consumer/basic/associates/types/associates";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const CATEGORY_TABS: { label: string; value: AssociateType }[] = [
  { label: "Server", value: "server" },
  { label: "Developer", value: "developer" },
];

const toCardAssociate = (a: ApiAssociate): Associate => ({
  id: a.associateId,
  name: a.fullName,
  role: a.serviceType || a.type,
  type: (a.type?.toLowerCase() === "developer" ? "developer" : "server") as AssociateType,
  status: a.isAssigned || a.status === "ASSIGNED" ? "Assigned" : "Available",
  serviceType: a.serviceType,
  experience: `${a.experienceYears} years`,
  experienceYears: a.experienceYears,
  location: a.location,
  associateId: a.associateId || a.associateCode,
  email: a.email,
  phone: a.phoneNumber ?? "",
  rawAssociate: a,
});

interface AllAssignedAssociatesProps {
  setIsAssociateOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AllAssignedAssociates: React.FC<AllAssignedAssociatesProps> = ({
  setIsAssociateOpen,
}) => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") as AssociateType | null;

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [filter, setFilter] = useState<AssociateType | null>(initialType || null);

  const [profileModalAssociate, setProfileModalAssociate] =
    useState<Associate | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const { data, isLoading } = useGetAssociatesQuery({
    type: filter || undefined,
    search: debouncedSearch,
    page: 1,
    limit: 10,
  });

  const [selectAssociates] = useSelectAssociatesMutation();

  const associates = useMemo(
    () => (data?.data?.items ?? []).map(toCardAssociate),
    [data],
  );

  const handleViewProfile = (associate: Associate) => {
    setProfileModalAssociate(associate);
    setIsProfileModalOpen(true);
  };

  const handleSecondaryAction = async (associate: Associate) => {
    if (associate.status === "Assigned") {
      handleViewProfile(associate);
      return;
    }

    const associateType: AssociateType =
      associate.type ||
      filter ||
      (associate.role?.toLowerCase().includes("dev") ? "developer" : "server");

    try {
      setAssigningId(associate.id);
      await selectAssociates({
        type: associateType,
        associateId: associate.id,
      }).unwrap();
      toast.success(
        `Successfully assigned ${associate.name} as your ${associateType}!`,
      );
    } catch (error) {
      console.error("Failed to select associate:", error);
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <div className="space-y-6">
      <BackButton
        label="Back to associates"
        onClick={() => setIsAssociateOpen(false)}
      />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeader
          title="Assigned Associates"
          description="Certified energy consultants and specialists for your project"
        />

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search"
          className="w-full sm:w-64"
        />
      </div>

      <CommonBorderWrapper isShadow>
        <CommonTabs
          tabs={CATEGORY_TABS}
          activeTab={filter as string}
          onChange={(value) =>
            setFilter(filter === value ? null : (value as AssociateType))
          }
          className="flex-wrap gap-2"
        />
      </CommonBorderWrapper>

      {isLoading ? (
        <Spinner text="Loading associates..." size="xl" />
      ) : associates.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {associates.map((associate) => (
            <AssociateCard
              key={associate.id}
              associate={associate}
              onViewProfile={handleViewProfile}
              onSecondaryAction={handleSecondaryAction}
              isAssigning={assigningId === associate.id}
            />
          ))}
        </div>
      ) : (
        <EmptyState message="No associates assigned yet." />
      )}

      <AssociatesAbout />

      <CommonButton variant="outline" className="w-full" to="../settings">
        Back to Settings
      </CommonButton>

      {/* Full Profile Modal */}
      <AssociateProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        associate={profileModalAssociate}
        onAssign={handleSecondaryAction}
        isAssigning={assigningId === profileModalAssociate?.id}
      />
    </div>
  );
};

export default AllAssignedAssociates;
