import { ReactNode } from "react";

interface BlackHeader {
  children: ReactNode;
  className?: string;
}

const FormSubheader: React.FC<BlackHeader> = ({ children, className }) => {
  return (
    <div
      className={`text-primary-gray text-base font-semibold pb-4 ${className} `}
    >
      {children}
    </div>
  );
};

export default FormSubheader;
