import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

interface CommonBorderWrapperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  variant?: "xs" | "sm" | "md" | "lg" | "xl";
  isShadow?: boolean;
}

const variants = {
  xs: "p-2 md:p-3 rounded-lg border",
  sm: "p-3 md:p-4 rounded-xl border",
  md: "p-4 md:p-6 rounded-2xl border",
  lg: "p-6 md:p-8 rounded-2xl border",
  xl: "p-8 md:p-10 rounded-3xl border-2",
};

const CommonBorderWrapper: React.FC<CommonBorderWrapperProps> = ({
  children,
  className,
  variant = "md",
  isShadow = false,
  ...props
}) => {
  return (
    <div
      {...props}
      className={clsx(
        "w-full bg-white border-[#E7E9E8]",
        variants[variant],
        isShadow &&
          "shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)] space-y-4 sm:space-y-6",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default CommonBorderWrapper;
