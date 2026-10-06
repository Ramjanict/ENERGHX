import { Trash2 } from "lucide-react";
import React, { ReactNode } from "react";

interface AdminCommonButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

const DeleteButton: React.FC<AdminCommonButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div>
      <button
        className={`disabled:bg-red-300 disabled:text-white disabled:cursor-not-allowed  flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-white border border-red-600 rounded-lg hover:bg-red-600 transition  cursor-pointer ${className}`}
        {...props}
      >
        <Trash2 size={16} />
        {children}
      </button>
    </div>
  );
};

export default DeleteButton;
