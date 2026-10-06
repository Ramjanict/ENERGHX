import CommonHeader from "@/common/header/CommonHeader";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { IconType } from "react-icons";

interface WelcomeProps {
  title: string;
  Icons?: LucideIcon | IconType;
  iconColor?: string;
  iconBg?: string;
  description?: string;
  className?: string;
  actions?: ReactNode;
  variant?: "primary" | "secondary";
  isConnected?: boolean;
  statusLabel?: string;
  statusClassName?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
}

const variants = {
  primary:
    "border-2 border-[rgba(45,173,0,0.20)] bg-[linear-gradient(135deg,_#EAF7E6_0%,_#ECF8E8_8.33%,_#EDF8EA_16.67%,_#EFF9EC_25%,_#F1FAEE_33.33%,_#F3FAF0_41.67%,_#F4FBF2_50%,_#F6FCF5_58.33%,_#F8FCF7_66.67%,_#FAFDF9_75%,_#FBFEFB_83.33%,_#FDFEFD_91.67%,_#FFF_100%)]",

  secondary:
    "border border-[rgba(21,93,252,0.20)] bg-[linear-gradient(90deg,_rgba(21,93,252,0.10)_0%,_rgba(152,16,250,0.10)_100%)]",
} as const;

const Welcome: React.FC<WelcomeProps> = ({
  title,
  description,
  className,
  actions,
  variant = "primary",
  isConnected = false,
  statusLabel,
  statusClassName,
  Icons,
  iconColor,
  iconBg,
  size,
}) => {
  return (
    <div
      className={cn(
        " rounded-2xl p-6 md:p-8 lg:p-10",
        variants[variant],
        className,
      )}
    >
      <div className="flex justify-between">
        <div className="flex items-center justify-center gap-3 ">
          {Icons && (
            <div
              className={` h-14 w-14 mt-1 items-center justify-center rounded-full hidden lg:flex ${iconBg}`}
            >
              <Icons className={`h-6 w-6 ${iconColor}`} />
            </div>
          )}
          <div>
            <CommonHeader size={size || "4xl"} className=" mb-1 sm:mb-2">
              {title}
            </CommonHeader>

            {description && (
              <CommonHeader
                size="lg"
                className="text-[#758179]! font-normal! max-w-3xl"
              >
                {description}
              </CommonHeader>
            )}
          </div>
        </div>
        {(statusLabel || isConnected) && (
          <span
            className={cn(
              "text-sm font-semibold shrink-0 hidden sm:block",
              statusClassName ?? "text-[#D4183D]",
            )}
          >
            {statusLabel ?? "Not Connected"}
          </span>
        )}
      </div>
      {actions && (
        <div className="mt-5 flex flex-col sm:flex-row justify-between gap-3">
          {actions}
        </div>
      )}
    </div>
  );
};

export default Welcome;
