import SectionHeader from "@/common/header/SectionHeader";
import { Upload } from "lucide-react";
import React, { useRef, useState } from "react";

interface ImageDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
  buttonLabel?: string;
  className?: string;
  description?: string;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  onFileSelect,
  accept = "image/*",
  label = "Drag and drop an image, or click to browse",
  buttonLabel = "Choose File",
  className,
  description,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl py-12 px-6 cursor-pointer transition-colors ${
        isDragging
          ? "border-green-400 bg-green-50"
          : "border-gray-200 bg-white hover:border-gray-300"
      } ${className ?? ""}`}
    >
      <Upload className="w-8 h-8 text-gray-400" />

      <SectionHeader
        size="lg"
        title={description ?? "Upload Recent Utility Bills"}
      />
      <p className="text-base text-gray-400">{label}</p>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.click();
        }}
        className="px-4 py-2 cursor-pointer rounded-lg bg-primary-green text-white  hover:opacity-90 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)]"
      >
        {buttonLabel}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
    </div>
  );
};

export default ImageDropzone;
