import React from "react";

type SpinnerSize = "sm" | "md" | "lg" | "xl";
type SpinnerVariant = "primary" | "neutral" | "success" | "danger";

interface SpinnerProps {
  text?: string;
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  vertical?: boolean;
  fullscreen?: boolean;
  className?: string;
}

const SIZE_MAP: Record<
  SpinnerSize,
  { ring: string; border: string; text: string }
> = {
  sm: { ring: "h-4 w-4", border: "border-2", text: "text-xs" },
  md: { ring: "h-6 w-6", border: "border-2", text: "text-sm" },
  lg: { ring: "h-9 w-9", border: "border-[3px]", text: "text-base" },
  xl: { ring: "h-12 w-12", border: "border-4", text: "text-lg" },
};

const VARIANT_MAP: Record<SpinnerVariant, { ring: string; text: string }> = {
  primary: {
    ring: "border-[#2dad00]/25 border-t-[#2dad00]",
    text: "text-[#2dad00]",
  },
  neutral: {
    ring: "border-slate-400/25 border-t-slate-500",
    text: "text-slate-600",
  },
  success: {
    ring: "border-emerald-500/25 border-t-emerald-500",
    text: "text-emerald-600",
  },
  danger: {
    ring: "border-rose-500/25 border-t-rose-500",
    text: "text-rose-600",
  },
};

export const Spinner: React.FC<SpinnerProps> = ({
  text,
  size = "md",
  variant = "primary",
  vertical = false,
  fullscreen = false,
  className = "",
}) => {
  const sizeCfg = SIZE_MAP[size];
  const variantCfg = VARIANT_MAP[variant];

  const content = (
    <div
      role="status"
      aria-live="polite"
      className={[
        "flex items-center gap-3",
        vertical ? "flex-col" : "flex-row",
        className,
      ].join(" ")}
    >
      <span
        className={[
          "inline-block rounded-full animate-spin",
          sizeCfg.ring,
          sizeCfg.border,
          variantCfg.ring,
        ].join(" ")}
      />
      {text && (
        <span
          className={[
            "font-medium tracking-wide select-none",
            sizeCfg.text,
            variantCfg.text,
          ].join(" ")}
        >
          {text}
        </span>
      )}
      <span className="sr-only">{text || "Loading"}</span>
    </div>
  );

  if (!fullscreen) return content;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      {content}
    </div>
  );
};

export default Spinner;
