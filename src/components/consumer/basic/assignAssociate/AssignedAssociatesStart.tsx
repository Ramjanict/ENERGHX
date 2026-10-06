import CommonButton from "@/common/button/CommonButton";
import SectionHeader from "@/common/header/SectionHeader";
import EmptyState from "@/common/loading/EmptyState";
import Spinner from "@/common/loading/Spinner";
import AssociateProfileModal from "@/components/consumer/basic/assignAssociate/AssociateProfileModal";
import { Associate } from "@/components/consumer/basic/assignAssociate/AssociateCard";
import { useGetAssociatesQuery } from "@/store/consumer/basic/associates/associatesApi";
import { AssociateType } from "@/store/consumer/basic/associates/types/associates";
import { Mail, UserPlus } from "lucide-react";
import React, { useMemo, useState } from "react";

interface AssignedAssociatesStartProps {
  setIsAssociateOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const getInitials = (firstname: string, lastname: string) =>
  `${firstname?.charAt(0) || ""}${lastname?.charAt(0) || ""}`.toUpperCase() || "AS";

const AssignedAssociatesStart: React.FC<AssignedAssociatesStartProps> = ({
  setIsAssociateOpen,
}) => {
  const { data, isLoading } = useGetAssociatesQuery({
    page: 1,
    limit: 50,
  });

  const [selectedAssociate, setSelectedAssociate] = useState<Associate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allItems = data?.data?.items ?? [];
  const assignedAssociates = useMemo(
    () => allItems.filter((a) => a.isAssigned || a.status === "ASSIGNED"),
    [allItems],
  );

  const handleOpenProfile = (apiAssociate: any) => {
    const cardAssociate: Associate = {
      id: apiAssociate.associateId,
      name: apiAssociate.fullName,
      role: apiAssociate.serviceType || apiAssociate.type,
      type: (apiAssociate.type?.toLowerCase() === "developer"
        ? "developer"
        : "server") as AssociateType,
      status: "Assigned",
      serviceType: apiAssociate.serviceType,
      experience: `${apiAssociate.experienceYears} years`,
      experienceYears: apiAssociate.experienceYears,
      location: apiAssociate.location,
      associateId: apiAssociate.associateId || apiAssociate.associateCode,
      email: apiAssociate.email,
      phone: apiAssociate.phoneNumber ?? "",
      rawAssociate: apiAssociate,
    };
    setSelectedAssociate(cardAssociate);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row gap-3 items-start justify-between">
        <SectionHeader
          title="Assigned Associates"
          description="Energy consultants and specialists assigned to your account"
        />

        <CommonButton
          variant="outline"
          onClick={() => setIsAssociateOpen(true)}
        >
          Browse All Associates
        </CommonButton>
      </div>

      {isLoading ? (
        <Spinner text="Loading associates..." size="xl" />
      ) : assignedAssociates.length > 0 ? (
        <div className="flex flex-col gap-4">
          {assignedAssociates.map((associate) => (
            <div
              key={associate.associateId}
              className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl bg-white border border-gray-200 p-5 gap-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-100">
                  <span className="text-lg font-medium text-green-700">
                    {getInitials(associate.firstname, associate.lastname)}
                  </span>
                </div>
                <div>
                  <SectionHeader
                    size="lg"
                    title={associate.fullName}
                    description={`${associate.serviceType || associate.type} • ${associate.location || "Remote"}`}
                  />
                  {associate.associateCode &&
                    !associate.associateCode.includes("-") && (
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        Code: {associate.associateCode}
                      </p>
                    )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CommonButton
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenProfile(associate)}
                >
                  View Profile
                </CommonButton>
                {associate.email && (
                  <a
                    href={`mailto:${associate.email}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-green-700 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Contact
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center bg-gray-50/50 space-y-4">
          <EmptyState message="No associates currently assigned to your account." />
          <CommonButton
            shape="rounded"
            size="md"
            onClick={() => setIsAssociateOpen(true)}
            className="mx-auto"
          >
            <UserPlus className="w-4 h-4 mr-1.5" />
            Browse & Assign Associate
          </CommonButton>
        </div>
      )}

      <AssociateProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        associate={selectedAssociate}
      />
    </div>
  );
};

export default AssignedAssociatesStart;
