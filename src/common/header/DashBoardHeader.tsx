import { ReactNode } from "react";

interface DashBoardHeader {
  children: ReactNode;
  className?: string;
}

const DashBoardHeader: React.FC<DashBoardHeader> = ({
  children,
  className,
}) => {
  return (
    <h2
      className={`font-extrabold font-secondary text-primary sm:text-base ${className}`}
    >
      {children}
    </h2>
  );
};

export default DashBoardHeader;
