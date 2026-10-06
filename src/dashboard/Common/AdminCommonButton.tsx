import React, { ReactNode } from "react";

interface AdminCommonButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

const AdminCommonButton: React.FC<AdminCommonButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div>
      <button
        className={`w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-green-700 transition cursor-pointer  disabled:bg-green-500 disabled:cursor-not-allowed ${className}`}
        {...props}
      >
        {children}
      </button>
    </div>
  );
};

export default AdminCommonButton;
