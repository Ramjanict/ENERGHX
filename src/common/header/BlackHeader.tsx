import { ReactNode } from "react";

interface BlackHeader {
  children: ReactNode;
  className?: string;
}

const BlackHeader: React.FC<BlackHeader> = ({ children, className }) => {
  return (
    <h2
      className={` font-extrabold text-[#121212] font-secondary text-base sm:text-xl md:text-2xl ${className}`}
    >
      {children}
    </h2>
  );
};

export default BlackHeader;
