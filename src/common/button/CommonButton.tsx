import clsx from "clsx";
import { Plus } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import ButtonWithLoading from "../loading/ButtonWithLoading";

const BASE_STYLE =
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-full sm:w-auto";

const SHAPE_STYLE = {
  pill: "rounded-full",
  rounded: "rounded-2xl",
} as const;

const SIZE_STYLE = {
  sm: "px-4 py-2 text-sm [&_svg]:size-4",
  md: "px-5 py-2.5 text-base [&_svg]:size-5",
  lg: "px-6 py-3.5 text-lg [&_svg]:size-5",
  xl: "px-8 py-4 text-xl [&_svg]:size-6",
} as const;

const VARIANT_STYLE = {
  primary:
    "bg-primary-green text-white hover:opacity-90 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] ",
  primaryBlue: "bg-[#155DFC] text-white hover:opacity-90 ",
  outline: "text-primary-green border-2 border-primary-green hover:bg-green-50",
  outlineBlue: "text-[#155DFC] border-2 border-[#155DFC] hover:bg-[#155DFC]/10",
  destructive: "bg-red-500 text-white shadow-sm hover:opacity-90",
  secondary: "bg-[#6A7282] text-white hover:bg-[#6A7282]/90",
  ghost: "text-primary-green hover:bg-primary-green hover:text-white",
} as const;

interface CommonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  size?: keyof typeof SIZE_STYLE;
  variant?: keyof typeof VARIANT_STYLE;
  shape?: keyof typeof SHAPE_STYLE;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showDefaultIcon?: boolean;
  to?: string;
  isLoading?: boolean;
  loadingText?: string;
}

const CommonButton: React.FC<CommonButtonProps> = ({
  children,
  className,
  size = "md",
  variant = "primary",
  shape = "rounded",
  leftIcon,
  rightIcon,
  showDefaultIcon = false,
  type = "button",
  to,
  disabled,
  isLoading = false,
  loadingText = "Loading...",
  ...props
}) => {
  const classes = clsx(
    BASE_STYLE,
    SHAPE_STYLE[shape],
    SIZE_STYLE[size],
    VARIANT_STYLE[variant],
    className,
  );

  const isDisabled = disabled || isLoading;

  const content = isLoading ? (
    <ButtonWithLoading title={loadingText} />
  ) : (
    <>
      {leftIcon ?? (showDefaultIcon && <Plus />)}
      {children}
      {rightIcon}
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={clsx(
          classes,
          isDisabled && "pointer-events-none opacity-50",
        )}
      >
        {content}
      </Link>
    );
  }

  return (
    <button disabled={isDisabled} type={type} className={classes} {...props}>
      {content}
    </button>
  );
};

export default CommonButton;
