import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import CommonHeader from "@/common/header/CommonHeader";
import SectionHeader from "@/common/header/SectionHeader";
import ButtonWithLoading from "@/common/loading/ButtonWithLoading";
import { AssociateType, Associate as ApiAssociate } from "@/store/consumer/basic/associates/types/associates";
import {
  Award,
  BadgeCheck,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  UserCheck,
} from "lucide-react";
import React from "react";

export interface Associate {
  id: string;
  name: string;
  role: string;
  type: AssociateType;
  status: "Assigned" | "Available";
  serviceType: string;
  experience: string;
  experienceYears?: number;
  location: string;
  associateId: string;
  email: string;
  phone: string;
  rawAssociate?: ApiAssociate;
}

interface AssociateCardProps {
  associate: Associate;
  onViewProfile: (associate: Associate) => void;
  onSecondaryAction: (associate: Associate) => void;
  isAssigning?: boolean;
}

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const AssociateCard: React.FC<AssociateCardProps> = ({
  associate,
  onViewProfile,
  onSecondaryAction,
  isAssigning = false,
}) => {
  const isAssigned = associate.status === "Assigned";

  return (
    <CommonBorderWrapper isShadow className="flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center shrink-0">
            {initials(associate.name)}
          </div>
          <div className="space-y-1 flex-1">
            <SectionHeader size="lg" title={associate.name} />

            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold uppercase">
              <Award className="w-4 h-4 text-primary" />
              <span>{associate.role}</span>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                isAssigned
                  ? "bg-[#DCFCE7] text-[#00A63E] border border-green-200"
                  : "bg-blue-100 text-blue-700 border border-blue-200"
              }`}
            >
              {isAssigned ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <UserCheck className="w-3.5 h-3.5" />
              )}
              {associate.status}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="mt-1.5">
              <Award className="w-4 h-4 text-[#758179]" />
            </div>

            <div>
              <CommonHeader size="sm">Service Type</CommonHeader>
              <CommonHeader size="md" className="font-bold! text-[#112518]!">
                {associate.serviceType || "Energy Consulting"}
              </CommonHeader>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="mt-1.5">
              <BadgeCheck className="w-4 h-4 text-[#758179]" />
            </div>

            <div>
              <CommonHeader size="sm">Experience</CommonHeader>
              <CommonHeader size="md" className="font-bold! text-[#112518]!">
                {associate.experience}
              </CommonHeader>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="mt-1.5">
              <MapPin className="w-4 h-4 text-[#758179]" />
            </div>

            <div>
              <CommonHeader size="sm">Location</CommonHeader>
              <CommonHeader size="md" className="font-bold! text-[#112518]!">
                {associate.location || "Not specified"}
              </CommonHeader>
            </div>
          </div>
        </div>
        <hr className="border-gray-100 my-4" />

        {/* Contact info */}
        <div className="space-y-2 mb-5 text-sm">
          {/* Only display friendly code if it's not a raw database UUID */}
          {associate.associateId &&
            !associate.associateId.includes("-") &&
            associate.associateId.length <= 12 && (
              <p className="flex items-center gap-2 text-primary font-mono text-xs font-medium">
                <BadgeCheck className="w-4 h-4 shrink-0" />
                Associate Code: {associate.associateId}
              </p>
            )}
          <p className="flex items-center gap-2 text-primary text-xs">
            <Mail className="w-4 h-4 shrink-0" />
            <a href={`mailto:${associate.email}`} className="hover:underline truncate">
              {associate.email}
            </a>
          </p>
          {associate.phone && (
            <p className="flex items-center gap-2 text-primary text-xs">
              <Phone className="w-4 h-4 shrink-0" />
              <span>{associate.phone}</span>
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <CommonButton onClick={() => onViewProfile(associate)}>
          View Profile
        </CommonButton>
        <CommonButton
          variant="outline"
          disabled={isAssigning}
          onClick={() => onSecondaryAction(associate)}
        >
          {isAssigning ? (
            <ButtonWithLoading
              title="Assigning..."
              textColor="text-primary!"
              borderColor="border-primary!"
            />
          ) : isAssigned ? (
            <span className="flex items-center gap-1.5 text-green-700 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              Assigned
            </span>
          ) : (
            "Assign"
          )}
        </CommonButton>
      </div>
    </CommonBorderWrapper>
  );
};

export default AssociateCard;
