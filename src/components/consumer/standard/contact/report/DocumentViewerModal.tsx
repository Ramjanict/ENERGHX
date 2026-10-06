import CommonButton from "@/common/button/CommonButton";
import { isWordDocument, openOrDownloadDocument } from "@/lib/utils";
import {
  CheckCircle2,
  Download,
  FileText,
  Info,
  PenTool,
  Type,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "./SignatureCanvas";
import { RequiredDocument, SignatoryInfo, SignatureMethod } from "./types";

interface DocumentViewerModalProps {
  document: RequiredDocument;
  utilityProvider: string;
  onClose: () => void;
  onMarkAsReviewed: (
    signatoryInfo: SignatoryInfo,
    signature: { type: SignatureMethod; value: string },
  ) => void;
  isSubmitting?: boolean;
  isAlreadyReviewed?: boolean;
}

const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  utilityProvider,
  onClose,
  onMarkAsReviewed,
  isSubmitting = false,
  isAlreadyReviewed = false,
}) => {
  const [signatureMethod, setSignatureMethod] =
    useState<SignatureMethod>("draw");
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [typedSignature, setTypedSignature] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSigned =
    isAlreadyReviewed ||
    document.reviewed ||
    document.signatureCompleted ||
    document.status === "SIGNED" ||
    document.status === "REVIEWED" ||
    document.status === "COMPLETED";

  const requiresSignature = document.requiresSignature !== false;

  const isWord = isWordDocument(
    document.fileName || document.downloadUrl || document.title,
    document.mimeType,
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSignatureDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const hasSignature =
    signatureMethod === "draw"
      ? !!signatureDataUrl
      : signatureMethod === "type"
        ? typedSignature.trim().length > 0
        : !!signatureDataUrl;

  const canMarkReviewed = requiresSignature
    ? Boolean(fullName.trim() && email.trim() && date && hasSignature)
    : true;

  const handleMarkAsReviewed = () => {
    if (!canMarkReviewed) return;

    const value =
      signatureMethod === "type"
        ? typedSignature.trim()
        : (signatureDataUrl ?? "");

    onMarkAsReviewed(
      {
        fullName: fullName.trim(),
        email: email.trim(),
        date: date || new Date().toISOString().split("T")[0],
      },
      { type: signatureMethod, value },
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E7E9E8]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-[#112518] text-lg">
                {document.title}
              </h2>
              <p className="text-sm text-[#758179]">{utilityProvider}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto">
          {isSigned && (
            <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                {requiresSignature
                  ? "This document has already been signed and reviewed."
                  : "This document has already been reviewed."}
              </span>
            </div>
          )}

          <div className="flex items-start gap-3 bg-blue-50 rounded-xl px-4 py-3.5">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900">
              This document was automatically retrieved based on your selected
              Utility Provider, Jurisdiction, and Engineering Services. Content
              is dynamically generated from backend regulatory data sources.
            </p>
          </div>

          {document.downloadUrl && (
            <div className="flex items-center justify-between bg-slate-50 border border-[#E7E9E8] rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[#112518]">
                    {document.fileName || document.title}
                  </p>
                  <p className="text-xs text-[#758179]">
                    {isWord
                      ? "Microsoft Word Document (.docx)"
                      : "Regulatory Document (.pdf)"}
                  </p>
                </div>
              </div>
              <CommonButton
                variant="outline"
                onClick={() =>
                  openOrDownloadDocument(
                    document.downloadUrl,
                    document.fileName || document.title,
                    document.mimeType,
                  )
                }
              >
                <Download className="w-4 h-4 mr-1.5" />
                {isWord ? "Download Document" : "Download PDF"}
              </CommonButton>
            </div>
          )}

          <div>
            <h3 className="font-bold text-[#112518] mb-1.5">
              Document Overview
            </h3>
            <p className="text-sm text-[#758179]">{document.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#EAF7E6]/30 rounded-xl px-4 py-3">
              <p className="text-xs text-[#758179]">Total Pages</p>
              <p className="font-bold text-[#112518]">
                {document.pageCount} pages
              </p>
            </div>
            <div className="bg-[#EAF7E6]/30 rounded-xl px-4 py-3">
              <p className="text-xs text-[#758179]">Last Updated</p>
              <p className="font-bold text-[#112518]">{document.lastUpdated}</p>
            </div>
          </div>

          <div className="border border-[#E7E9E8] rounded-xl divide-y divide-[#E7E9E8]">
            {document.sections.map((section) => (
              <div
                key={section.order}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#EAF7E6] text-primary text-sm font-bold flex items-center justify-center">
                    {section.order}
                  </span>
                  <span className="font-medium text-[#112518]">
                    {section.title}
                  </span>
                </div>
                <span className="text-sm text-[#758179]">
                  {section.sectionLabel}
                </span>
              </div>
            ))}
          </div>

          {requiresSignature && (
            <>
              <div className="border border-[#E7E9E8] rounded-xl">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-[#E7E9E8]">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-bold text-[#112518]">
                    Signatory Information
                  </h3>
                </div>
                {isSigned && !fullName ? (
                  <div className="p-4 bg-[#EAF7E6]/40 rounded-xl border border-[#E5E7EB] flex items-center justify-between m-4">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#008236] shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-[#112518]">
                          Signatory Information Verified
                        </p>
                        <p className="text-xs text-[#758179]">
                          Completed and verified on the server
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#008236] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
                      Completed
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
                    <div>
                      <label className="block text-sm font-medium text-[#112518] mb-1.5">
                        Full Legal Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        disabled={isSigned}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full name"
                        className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                          isSigned ? "bg-gray-50 text-[#112518] cursor-not-allowed" : ""
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#112518] mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        disabled={isSigned}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Legal email address"
                        className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                          isSigned ? "bg-gray-50 text-[#112518] cursor-not-allowed" : ""
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#112518] mb-1.5">
                        Date
                      </label>
                      <input
                        type="date"
                        value={date}
                        disabled={isSigned}
                        onChange={(e) => setDate(e.target.value)}
                        className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                          isSigned ? "bg-gray-50 text-[#112518] cursor-not-allowed" : ""
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="border border-[#E7E9E8] rounded-xl">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-[#E7E9E8]">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
                    3
                  </span>
                  <h3 className="font-bold text-[#112518]">Digital Signature</h3>
                </div>

                {isSigned && !signatureDataUrl && !typedSignature ? (
                  <div className="p-6 m-4 bg-[#EAF7E6]/40 rounded-xl border border-dashed border-[#B9F8CF] text-center">
                    <CheckCircle2 className="w-8 h-8 text-[#008236] mx-auto mb-2" />
                    <p className="font-bold text-[#112518] text-base">
                      Digital Signature Verified
                    </p>
                    <p className="text-xs text-[#758179] mt-1">
                      This document has been digitally signed and registered on the
                      server (Status: REVIEWED & SIGNED).
                    </p>
                  </div>
                ) : isSigned && (signatureDataUrl || typedSignature) ? (
                  <div className="p-4 m-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
                    {signatureMethod === "type" ? (
                      <div
                        className="text-3xl italic text-gray-800 py-4"
                        style={{ fontFamily: "cursive" }}
                      >
                        {typedSignature}
                      </div>
                    ) : (
                      <img
                        src={signatureDataUrl!}
                        alt="Signed signature"
                        className="h-16 mx-auto object-contain"
                      />
                    )}
                    <p className="text-xs text-[#008236] font-semibold mt-2 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#008236]" /> Digital
                      Signature on File
                    </p>
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="flex gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => setSignatureMethod("draw")}
                        className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                          signatureMethod === "draw"
                            ? "bg-white border border-gray-300"
                            : "bg-[#EAF7E6]/40 text-[#758179]"
                        }`}
                      >
                        <PenTool className="w-4 h-4" />
                        Draw Signature
                      </button>
                      <button
                        type="button"
                        onClick={() => setSignatureMethod("type")}
                        className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                          signatureMethod === "type"
                            ? "bg-white border border-gray-300"
                            : "bg-[#EAF7E6]/40 text-[#758179]"
                        }`}
                      >
                        <Type className="w-4 h-4" />
                        Type Signature
                      </button>
                      <button
                        type="button"
                        onClick={() => setSignatureMethod("upload")}
                        className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                          signatureMethod === "upload"
                            ? "bg-white border border-gray-300"
                            : "bg-[#EAF7E6]/40 text-[#758179]"
                        }`}
                      >
                        <Upload className="w-4 h-4" />
                        Upload Signature
                      </button>
                    </div>

                    {signatureMethod === "draw" && (
                      <SignatureCanvas onSignatureChange={setSignatureDataUrl} />
                    )}

                    {signatureMethod === "type" && (
                      <div>
                        <input
                          type="text"
                          value={typedSignature}
                          onChange={(e) => setTypedSignature(e.target.value)}
                          placeholder="Type your full name"
                          className="w-full h-24 rounded-lg border border-dashed border-gray-300 px-4 text-3xl italic text-center focus:outline-none focus:ring-2 focus:ring-primary"
                          style={{ fontFamily: "cursive" }}
                        />
                        <p className="text-xs text-[#758179] mt-2">
                          Your typed name will be used as your signature
                        </p>
                      </div>
                    )}

                    {signatureMethod === "upload" && (
                      <div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-40 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-[#758179] hover:bg-gray-50"
                        >
                          <Upload className="w-6 h-6" />
                          <span className="text-sm">
                            Click to upload a signature image
                          </span>
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                        {signatureDataUrl && (
                          <img
                            src={signatureDataUrl}
                            alt="Uploaded signature"
                            className="h-16 mt-3 mx-auto"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-5 border-t border-[#E7E9E8]">
          <CommonButton variant="outline" onClick={onClose}>
            Close
          </CommonButton>
          {isSigned ? (
            <CommonButton
              disabled
              className="bg-emerald-600/70 text-white cursor-not-allowed hover:bg-emerald-600/70"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              {requiresSignature
                ? "Already Signed & Reviewed"
                : "Already Reviewed"}
            </CommonButton>
          ) : (
            <CommonButton
              onClick={handleMarkAsReviewed}
              disabled={!canMarkReviewed}
              isLoading={isSubmitting}
              loadingText="Saving..."
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Mark as Reviewed
            </CommonButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerModal;
