import { ReactNode } from "react";

type HeaderTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

interface CommonHeaderProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";

  as?: HeaderTag;
}

const sizeStyle = {
  sm: "text-xs sm:text-sm leading-normal",
  md: "text-sm sm:text-base leading-normal",
  lg: "text-base sm:text-lg leading-snug",
  xl: "text-lg sm:text-xl leading-snug",
  "2xl": "text-xl sm:text-2xl leading-snug",
  "3xl": "text-2xl sm:text-3xl leading-tight",
  "4xl": "text-2xl sm:text-3xl md:text-4xl leading-tight",
  "5xl": "text-3xl sm:text-4xl md:text-5xl leading-tight",
  "6xl": "text-4xl sm:text-5xl md:text-6xl leading-tight",
};
// Default semantic tag per size, only used when `as` isn't passed.
const defaultTag: Record<keyof typeof sizeStyle, HeaderTag> = {
  sm: "p",
  md: "h4",
  lg: "h3",
  xl: "h3",
  "2xl": "h2",
  "3xl": "h2",
  "4xl": "h1",
  "5xl": "h1",
  "6xl": "h1",
};

const textStyle: Record<keyof typeof sizeStyle, string> = {
  sm: "text-[#758179] font-normal",
  md: "text-[#758179] font-normal",
  lg: "text-[#112518] font-semibold",
  xl: "text-[#112518] font-bold",
  "2xl": "text-[#112518] font-semibold",
  "3xl": "text-[#112518] font-bold",
  "4xl": "text-[#112518] font-bold",
  "5xl": "text-[#112518] font-bold",
  "6xl": "text-[#112518] font-bold",
};

const CommonHeader: React.FC<CommonHeaderProps> = ({
  children,
  className = "",
  size = "lg",
  as,
}) => {
  const Tag = as ?? defaultTag[size];

  return (
    <Tag
      className={` flex items-center gap-2 ${textStyle[size]} ${sizeStyle[size]} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
};

export default CommonHeader;
