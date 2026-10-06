import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import SectionHeader from "@/common/header/SectionHeader";
import { AlertTriangle } from "lucide-react";
import CheckboxRow from "./CheckboxRow";
import { AcknowledgementState } from "./types";

interface AcceptanceSectionProps {
  allDocumentsReviewed: boolean;
  remainingCount: number;
  acknowledgement: AcknowledgementState;
  onChange: (key: keyof AcknowledgementState, value: boolean) => void;
}

const AcceptanceSection: React.FC<AcceptanceSectionProps> = ({
  allDocumentsReviewed,
  remainingCount,
  acknowledgement,
  onChange,
}) => {
  return (
    <CommonBorderWrapper isShadow>
      <SectionHeader
        size="xl"
        title="Acceptance & Acknowledgement"
        description="All documents must be reviewed before you can proceed with contract execution."
      />

      {!allDocumentsReviewed && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-amber-800 font-medium text-sm">
            Please review all {remainingCount + 0} required documents before
            accepting. ({remainingCount} remaining)
          </p>
        </div>
      )}

      <div className="space-y-3">
        <CheckboxRow
          checked={acknowledgement.reviewedAllDocuments}
          disabled={!allDocumentsReviewed}
          label="I have reviewed all required contract documents."
          onChange={() =>
            onChange(
              "reviewedAllDocuments",
              !acknowledgement.reviewedAllDocuments,
            )
          }
        />
        <CheckboxRow
          checked={acknowledgement.acknowledgedDisclosures}
          disabled={!allDocumentsReviewed}
          label="I acknowledge all disclosures and regulatory requirements applicable to my jurisdiction."
          onChange={() =>
            onChange(
              "acknowledgedDisclosures",
              !acknowledgement.acknowledgedDisclosures,
            )
          }
        />
        <CheckboxRow
          checked={acknowledgement.agreedToProceed}
          disabled={!allDocumentsReviewed}
          label="I agree to proceed with contract execution."
          onChange={() =>
            onChange("agreedToProceed", !acknowledgement.agreedToProceed)
          }
        />
      </div>
    </CommonBorderWrapper>
  );
};

export default AcceptanceSection;
