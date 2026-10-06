import CommonButton from "@/common/button/CommonButton";
import { Download, Eye, FileText } from "lucide-react";
import { RequiredDocument } from "./types";

interface DocumentCardProps {
  document: RequiredDocument;
  isReviewed: boolean;
  isDownloading?: boolean;
  onDownload: () => void;
  onView: () => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  isReviewed,
  isDownloading = false,
  onDownload,
  onView,
}) => {
  return (
    <div className=" border-t border-b border-[#E7E9E8] last:border-b-0 p-6">
      <div className="flex flex-col lg:flex-row items-start gap-6">
        <div className="flex items-start gap-2">
          <div
            className={`w-10 h-10 rounded-lg sm:flex items-center justify-center shrink-0 mt-1 ${document.iconBg} hidden `}
          >
            <FileText className={`w-5 h-5 ${document.iconColor}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-1.5">
              <h3 className="font-bold text-[#112518] text-base sm:text-lg">
                {document.title}
              </h3>
              <div className="flex items-center gap-2">
                {document.isRequired && (
                  <span className="text-xs font-semibold text-[#C10007] bg-[#FFE2E2] px-2.5 py-0.5 rounded-full shrink-0">
                    Required
                  </span>
                )}
                {isReviewed && (
                  <span className="text-xs font-semibold text-[#008236] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full shrink-0">
                    Reviewed
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-[#758179] mb-3">
              {document.description}
            </p>

            <div className="flex items-center gap-3 flex-wrap text-xs">
              <span
                className={`font-medium ${document.iconColor} px-2.5 py-1 rounded-full ${document.iconBg} `}
              >
                Source: {document.source}
              </span>
              <span className="text-[#758179]">
                {document.pageCount} pages · {document.lastUpdated}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row  sm:items-center gap-3 shrink-0 w-full sm:w-auto">
          <CommonButton
            variant="outline"
            onClick={onDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              "Downloading..."
            ) : (
              <>
                <Download className="w-4 h-4 mr-1.5" />
                Download
              </>
            )}
          </CommonButton>
          <CommonButton
            onClick={onView}
            className={isReviewed ? "bg-primary/70 hover:bg-primary/70" : ""}
          >
            <Eye className="w-4 h-4 mr-1.5" />
            View Document
          </CommonButton>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
