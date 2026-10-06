import CloseButton from "@/common/button/CloseButton";
import CommonButton from "@/common/button/CommonButton";
import SectionHeader from "@/common/header/SectionHeader";
import { useGetAssociateProfileQuery } from "@/store/consumer/basic/associates/associatesApi";
import {
  Award,
  BadgeCheck,
  Check,
  CheckCircle2,
  Copy,
  Mail,
  MapPin,
  Phone,
  UserCheck,
} from "lucide-react";
import React, { useState } from "react";
import { Associate } from "./AssociateCard";

interface AssociateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  associate: Associate | null;
  onAssign?: (associate: Associate) => void;
  isAssigning?: boolean;
}

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const AssociateProfileModal: React.FC<AssociateProfileModalProps> = ({
  isOpen,
  onClose,
  associate,
  onAssign,
  isAssigning = false,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { data: profileResponse, isLoading } = useGetAssociateProfileQuery(
    associate?.id ?? "",
    { skip: !isOpen || !associate?.id },
  );

  if (!isOpen || !associate) return null;

  // Use detailed profile response if available, else fallback to associate card data
  const profile = profileResponse?.data || profileResponse || associate.rawAssociate || associate;

  const isAssigned =
    profile.isAssigned === true ||
    profile.status === "Assigned" ||
    profile.status === "ASSIGNED" ||
    associate.status === "Assigned";

  const handleCopy = (text: string, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const name = profile.fullName || associate.name;
  const role = profile.serviceType || profile.type || associate.role;
  const email = profile.email || associate.email;
  const phone = profile.phoneNumber || profile.phone || associate.phone;
  const location = profile.location || associate.location;
  const experienceYears = profile.experienceYears ?? associate.experienceYears;
  const experienceText =
    profile.experience ||
    (experienceYears != null ? `${experienceYears} years of experience` : associate.experience);
  const associateCode = profile.associateCode || profile.associateId || associate.associateId;
  const serviceTypes: string[] = profile.serviceTypes || (profile.serviceType ? [profile.serviceType] : []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-2xl shadow-xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <SectionHeader
            size="lg"
            title="Associate Profile"
            description="Verified Energhx energy specialist details"
          />
          <CloseButton onClick={onClose} />
        </div>

        {/* Profile Identity Bar */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary font-bold text-xl flex items-center justify-center shrink-0">
            {initials(name)}
          </div>
          <div className="text-center sm:text-left space-y-1 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h3 className="text-xl font-bold text-gray-900">{name}</h3>
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full w-fit mx-auto sm:mx-0 ${
                  isAssigned
                    ? "bg-[#DCFCE7] text-[#00A63E] border border-green-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}
              >
                {isAssigned ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <UserCheck className="w-3.5 h-3.5" />
                )}
                {isAssigned ? "Assigned" : "Available"}
              </span>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-sm text-gray-600 font-medium">
              <Award className="w-4 h-4 text-primary" />
              <span className="uppercase tracking-wide">{role}</span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-gray-100 bg-white space-y-1">
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>Associate Code / ID</span>
              <button
                onClick={() => handleCopy(associateCode, "code")}
                className="text-primary hover:text-green-700 flex items-center gap-1 cursor-pointer"
                title="Copy Associate ID"
              >
                {copiedField === "code" ? (
                  <Check className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span className="text-[11px]">{copiedField === "code" ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <p className="font-mono text-xs text-gray-800 break-all font-semibold">
              {associateCode || "-"}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-gray-100 bg-white space-y-1">
            <div className="text-xs text-gray-500 font-medium">Experience</div>
            <p className="text-sm font-semibold text-gray-800">
              {experienceYears != null ? `${experienceYears} years` : experienceText || "-"}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-gray-100 bg-white space-y-1">
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-gray-400" /> Email
              </span>
              <button
                onClick={() => handleCopy(email, "email")}
                className="text-primary hover:text-green-700 flex items-center gap-1 cursor-pointer"
                title="Copy Email"
              >
                {copiedField === "email" ? (
                  <Check className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span className="text-[11px]">{copiedField === "email" ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <a
              href={`mailto:${email}`}
              className="text-sm font-medium text-primary hover:underline break-all block"
            >
              {email || "-"}
            </a>
          </div>

          <div className="p-4 rounded-xl border border-gray-100 bg-white space-y-1">
            <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
              <Phone className="w-3.5 h-3.5 text-gray-400" /> Phone
            </div>
            <p className="text-sm font-semibold text-gray-800">
              {phone || "Not provided"}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-gray-100 bg-white space-y-1 sm:col-span-2">
            <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
              <MapPin className="w-3.5 h-3.5 text-gray-400" /> Location
            </div>
            <p className="text-sm font-medium text-gray-800">
              {location || [profile.city, profile.state, profile.country].filter(Boolean).join(", ") || "-"}
            </p>
          </div>
        </div>

        {/* Service Types / Skills */}
        {serviceTypes.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Specialized Service Types
            </div>
            <div className="flex flex-wrap gap-2">
              {serviceTypes.map((service, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-green-50 text-green-800 border border-green-200"
                >
                  <BadgeCheck className="w-3.5 h-3.5 text-primary" />
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <CommonButton variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Close
          </CommonButton>

          {onAssign && (
            <CommonButton
              onClick={() => onAssign(associate)}
              disabled={isAssigned || isAssigning}
              isLoading={isAssigning}
              loadingText="Assigning..."
              className="w-full sm:w-auto"
            >
              {isAssigned ? "Already Assigned" : "Assign Associate"}
            </CommonButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssociateProfileModal;
