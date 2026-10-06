import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import SectionHeader from "@/common/header/SectionHeader";
import { isWordDocument } from "@/lib/utils";
import { FileText, Shield } from "lucide-react";
import { ContractDocument } from "./types";

interface ContractDocumentsSectionProps {
  documents: Array<ContractDocument & { downloadUrl?: string }>;
  onViewPdf: (document: ContractDocument & { downloadUrl?: string }) => void;
}

const ICON_MAP = {
  file: FileText,
  shield: Shield,
};

const ContractDocumentsSection: React.FC<ContractDocumentsSectionProps> = ({
  documents,
  onViewPdf,
}) => {
  return (
    <CommonBorderWrapper isShadow>
      <SectionHeader size="xl" title="Contract Documents" />

      <div className="space-y-3">
        {documents.map((doc) => {
          const Icon = ICON_MAP[doc.icon];
          const isSigned =
            doc.reviewed ||
            doc.signatureCompleted ||
            doc.status === "SIGNED" ||
            doc.status === "REVIEWED" ||
            doc.status === "COMPLETED";
          const isWord = isWordDocument(
            doc.fileName || doc.downloadUrl || doc.title,
            doc.mimeType,
          );
          const buttonLabel = isWord ? "View Document" : "View PDF";

          return (
            <div
              key={doc.id}
              className="flex flex-col md:flex-row gap-3 md:items-center  justify-between bg-[#EAF7E6]/30 border border-[#E5E7EB] rounded-xl px-5 py-4"
            >
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-primary shrink-0  hidden sm:block" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-[#112518]">
                      {doc.title}
                    </h3>
                    {isSigned && (
                      <span className="text-xs font-semibold text-[#008236] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full shrink-0">
                        Signed
                      </span>
                    )}
                  </div>
                  {doc.description && (
                    <p className="text-sm text-[#758179] mt-0.5">
                      {doc.description}
                    </p>
                  )}
                </div>
              </div>

              <CommonButton onClick={() => onViewPdf(doc)}>
                {buttonLabel}
              </CommonButton>
            </div>
          );
        })}
      </div>
    </CommonBorderWrapper>
  );
};

export default ContractDocumentsSection;
