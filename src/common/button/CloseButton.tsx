import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
  iconClassName?: string;
  ariaLabel?: string;
}

const CloseButton: React.FC<CloseButtonProps> = ({
  onClick,
  className,
  iconClassName,
  ariaLabel = "Close",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "text-gray-400 transition-colors hover:text-gray-600 cursor-pointer",
        className,
      )}
    >
      <X className={cn("w-5 h-5", iconClassName)} />
    </button>
  );
};

export default CloseButton;
