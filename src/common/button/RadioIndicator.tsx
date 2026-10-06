import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface RadioIndicatorProps {
  selected?: boolean;
  className?: string;
  activeBorderClassName?: string;
  inactiveBorderClassName?: string;
  dotClassName?: string;
  variant?: "dot" | "check";
}

const RadioIndicator: React.FC<RadioIndicatorProps> = ({
  selected = false,
  className,
  activeBorderClassName = "border-primary",
  inactiveBorderClassName = "border-[#E7E9E8]",
  dotClassName = "bg-primary",
  variant = "dot",
}) => {
  if (variant === "check") {
    return (
      <span
        className={cn(
          "mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
          selected
            ? `${dotClassName} ${activeBorderClassName}`
            : `bg-transparent ${inactiveBorderClassName}`,
          className,
        )}
      >
        {selected && (
          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
        )}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
        selected ? activeBorderClassName : inactiveBorderClassName,
        className,
      )}
    >
      {selected && (
        <span className={cn("w-2.5 h-2.5 rounded-full", dotClassName)} />
      )}
    </span>
  );
};

export default RadioIndicator;
