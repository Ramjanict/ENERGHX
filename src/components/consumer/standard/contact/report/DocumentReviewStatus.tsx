import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import SectionHeader from "@/common/header/SectionHeader";
import { CheckCircle2, Circle } from "lucide-react";
import { RequiredDocument } from "./types";

interface DocumentReviewStatusProps {
  documents: RequiredDocument[];
  reviewedIds: Set<string>;
}

const DocumentReviewStatus: React.FC<DocumentReviewStatusProps> = ({
  documents,
  reviewedIds,
}) => {
  const reviewedCount = reviewedIds.size;
  const total = documents.length;
  const progressPct = total > 0 ? (reviewedCount / total) * 100 : 0;

  return (
    <CommonBorderWrapper isShadow>
      <div className="flex items-center justify-between mb-1">
        <SectionHeader size="xl" title="Document Review Status" />
      </div>

      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-[#758179]">Documents Reviewed</span>
        <span className="font-bold text-[#112518]">
          {reviewedCount}/{total}
        </span>
      </div>

      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {documents.map((doc) => {
          const isReviewed = reviewedIds.has(doc.id);
          return (
            <div
              key={doc.id}
              className="flex items-center gap-3 bg-[#EAF7E6]/30 border border-[#E7E9E8] rounded-xl px-4 py-3"
            >
              {isReviewed ? (
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300 shrink-0" />
              )}
              <div>
                <p className="font-semibold text-[#112518] text-sm">
                  {doc.title}
                </p>
                <p
                  className={`text-xs ${
                    isReviewed ? "text-primary" : "text-[#758179]"
                  }`}
                >
                  {isReviewed ? "Reviewed" : "Not Yet Reviewed"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </CommonBorderWrapper>
  );
};

export default DocumentReviewStatus;
