// @/common/modal/Modal.tsx
import { X } from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  className,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        {title && (
          <h2 className="text-lg font-bold mb-4 text-[#112518]">{title}</h2>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
