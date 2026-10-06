import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import CloseButton from "@/common/button/CloseButton";
import SectionHeader from "@/common/header/SectionHeader";
import AssociateProfileModal from "@/components/consumer/basic/assignAssociate/AssociateProfileModal";
import { Associate } from "@/components/consumer/basic/assignAssociate/AssociateCard";
import {
  useGetAssociatesQuery,
  useSelectAssociatesMutation,
} from "@/store/consumer/basic/associates/associatesApi";
import {
  Associate as ApiAssociate,
  AssociateType,
} from "@/store/consumer/basic/associates/types/associates";
import {
  Award,
  BadgeCheck,
  CheckCircle2,
  Mail,
  MapPin,
  UserCheck,
  UserPlus,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

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

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "DE";

const DeveloperAssignmentSection: React.FC = () => {
  const { data, isLoading } = useGetAssociatesQuery({
    type: "developer",
    limit: 50,
  });

  const [selectAssociates] = useSelectAssociatesMutation();

  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [profileModalAssociate, setProfileModalAssociate] =
    useState<Associate | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const developers = useMemo(
    () => (data?.data?.items ?? []).map(toCardAssociate),
    [data],
  );

  const assignedDeveloper = useMemo(
    () => developers.find((d) => d.status === "Assigned"),
    [developers],
  );

  const handleOpenProfile = (associate: Associate) => {
    setProfileModalAssociate(associate);
    setIsProfileModalOpen(true);
  };

  const handleAssign = async (associate: Associate) => {
    try {
      setAssigningId(associate.id);
      await selectAssociates({
        type: "developer",
        associateId: associate.id,
      }).unwrap();
      toast.success(
        `Successfully assigned ${associate.name} as your certified developer!`,
      );
      setIsSelectModalOpen(false);
      setIsProfileModalOpen(false);
    } catch (err) {
      console.error("Failed to assign developer:", err);
    } finally {
      setAssigningId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 animate-pulse">
        <div className="h-5 bg-slate-200 rounded w-1/4 mb-2" />
        <div className="h-4 bg-slate-100 rounded w-1/2" />
      </div>
    );
  }

  return (
    <>
      {!assignedDeveloper ? (
        /* Alert banner for users who upgraded without assigning a developer */
        <CommonBorderWrapper
          isShadow
          className="bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-white border-2 border-amber-200/80! p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <UserPlus className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                    Action Recommended
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    Assign a Certified Developer to Your Account
                  </h3>
                </div>
                <p className="text-sm text-gray-600 max-w-3xl">
                  You recently upgraded to the Standard Plan. To begin your
                  advanced engineering reviews, thermal comfort simulations, and
                  system sizing approval, assign a certified developer.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <CommonButton
                onClick={() => setIsSelectModalOpen(true)}
                shape="rounded"
                size="md"
              >
                Assign Developer Now
              </CommonButton>
              <CommonButton
                variant="outline"
                shape="rounded"
                size="md"
                to="/standard-consumer/assigned-associates?type=developer"
              >
                Browse All
              </CommonButton>
            </div>
          </div>
        </CommonBorderWrapper>
      ) : (
        /* Card displaying the assigned developer */
        <CommonBorderWrapper isShadow className="bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
            <div>
              <SectionHeader
                size="lg"
                title="Assigned Engineering Developer"
                description="Certified developer managing your building engineering validations and review"
              />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Assigned to Your Account
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center shrink-0">
                {initials(assignedDeveloper.name)}
              </div>
              <div className="space-y-1">
                <h4 className="text-base sm:text-lg font-bold text-gray-900">
                  {assignedDeveloper.name}
                </h4>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                  <span className="flex items-center gap-1 font-medium">
                    <Award className="w-3.5 h-3.5 text-primary" />
                    {assignedDeveloper.serviceType || "Energy Engineering Developer"}
                  </span>
                  <span className="flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5 text-slate-400" />
                    {assignedDeveloper.experience}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {assignedDeveloper.location || "Remote"}
                  </span>
                </div>
                <div className="flex items-center gap-3 pt-1 text-xs text-primary">
                  <a
                    href={`mailto:${assignedDeveloper.email}`}
                    className="flex items-center gap-1 hover:underline"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {assignedDeveloper.email}
                  </a>
                  {assignedDeveloper.associateId &&
                    !assignedDeveloper.associateId.includes("-") &&
                    assignedDeveloper.associateId.length <= 12 && (
                      <span className="font-mono text-gray-400">
                        Code: {assignedDeveloper.associateId}
                      </span>
                    )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <CommonButton
                variant="outline"
                size="sm"
                shape="rounded"
                onClick={() => handleOpenProfile(assignedDeveloper)}
              >
                View Profile
              </CommonButton>
              <CommonButton
                variant="outline"
                size="sm"
                shape="rounded"
                onClick={() => setIsSelectModalOpen(true)}
              >
                Change Developer
              </CommonButton>
            </div>
          </div>
        </CommonBorderWrapper>
      )}

      {/* Developer Selection Modal */}
      {isSelectModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-3xl shadow-xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <SectionHeader
                size="lg"
                title="Select a Certified Developer"
                description="Choose an energy developer to assign to your building for engineering reviews"
              />
              <CloseButton onClick={() => setIsSelectModalOpen(false)} />
            </div>

            <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
              {developers.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  No certified developers available at this moment.
                </div>
              ) : (
                developers.map((dev) => {
                  const isCurrent = dev.id === assignedDeveloper?.id;
                  const isBusy = assigningId === dev.id;

                  return (
                    <div
                      key={dev.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all ${
                        isCurrent
                          ? "border-emerald-300 bg-emerald-50/40"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      } gap-4`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-base flex items-center justify-center shrink-0">
                          {initials(dev.name)}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-gray-900 text-sm sm:text-base">
                              {dev.name}
                            </h5>
                            {isCurrent && (
                              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                Currently Assigned
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 font-medium">
                            {dev.serviceType || "Energy Systems Specialist"} • {dev.experience}
                          </p>
                          <p className="text-xs text-gray-500">
                            {dev.location || "Remote"} • <span className="font-mono">{dev.associateId}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <CommonButton
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenProfile(dev)}
                        >
                          View Profile
                        </CommonButton>
                        <CommonButton
                          size="sm"
                          disabled={isCurrent || isBusy}
                          isLoading={isBusy}
                          loadingText="Assigning..."
                          onClick={() => handleAssign(dev)}
                        >
                          {isCurrent ? "Assigned" : "Assign"}
                        </CommonButton>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <Link
                to="/standard-consumer/assigned-associates?type=developer"
                className="text-xs text-primary font-semibold hover:underline"
                onClick={() => setIsSelectModalOpen(false)}
              >
                Go to Assigned Associates page →
              </Link>
              <CommonButton
                variant="outline"
                onClick={() => setIsSelectModalOpen(false)}
              >
                Cancel
              </CommonButton>
            </div>
          </div>
        </div>
      )}

      {/* Associate Profile Modal */}
      <AssociateProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        associate={profileModalAssociate}
        onAssign={handleAssign}
        isAssigning={assigningId === profileModalAssociate?.id}
      />
    </>
  );
};

export default DeveloperAssignmentSection;
