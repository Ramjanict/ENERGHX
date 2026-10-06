import CommonButton from "@/common/button/CommonButton";
import Modal from "@/common/form/Modal";
import SectionHeader from "@/common/header/SectionHeader";
import { FileText, Upload } from "lucide-react";
import React, { useRef, useState } from "react";

interface EmailAuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: { file: File; email: string }) => void;
  isLoading: boolean;
  defaultEmail?: string;
}

const EmailAuditReportModal: React.FC<EmailAuditReportModalProps> = ({
  isOpen,
  onClose,
  onSend,
  isLoading,
  defaultEmail = "",
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState(defaultEmail);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setFile(null);
    setEmail(defaultEmail);
    setError("");
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setError("");
    setFile(selected);
  };

  const handleSend = () => {
    if (!file) {
      setError("Please attach the audit report PDF.");
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    onSend({ file, email });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-lg">
      <div className="flex items-center justify-between mb-6">
        <SectionHeader title="Email Audit Report" />
      </div>

      <div className="mb-5">
        <label className="block text-sm text-muted-foreground mb-2">
          Audit Report (PDF) <span className="text-red-500">*</span>
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {file ? (
          <div className="flex items-center justify-between border border-[#E7E9E8] rounded-xl px-4 py-3 bg-[#EAF7E6]/30">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="w-4 h-4 text-[#2DAD00] shrink-0" />
              <span className="text-sm text-[#112518] truncate">
                {file.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-[#2DAD00] hover:underline shrink-0 ml-3"
            >
              Change
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#E7E9E8] rounded-xl px-4 py-8 text-muted-foreground hover:border-[#2DAD00] hover:text-[#2DAD00] transition-colors cursor-pointer"
          >
            <Upload className="w-5 h-5" />
            <span className="text-sm">Click to upload PDF</span>
          </button>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm text-muted-foreground mb-2">
          Recipient Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          className="w-full rounded-xl border border-[#E7E9E8] px-4 py-2.5 text-sm text-[#112518] focus:outline-none focus:ring-2 focus:ring-[#2DAD00]/30 focus:border-[#2DAD00]"
        />
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-2 gap-4">
        <CommonButton variant="outline" onClick={handleClose}>
          Cancel
        </CommonButton>
        <CommonButton
          onClick={handleSend}
          disabled={!file || !email}
          isLoading={isLoading}
          loadingText="Sending..."
        >
          Send Report
        </CommonButton>
      </div>
    </Modal>
  );
};

export default EmailAuditReportModal;
