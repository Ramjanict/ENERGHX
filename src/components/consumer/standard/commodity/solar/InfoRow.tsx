import { cn } from "@/lib/utils";

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  className,
  labelClassName,
  valueClassName,
}) => {
  return (
    <div
      className={cn(
        "flex justify-between items-center py-2.5 px-3 bg-[#EAF7E6]/30 rounded-lg",
        className,
      )}
    >
      <dt className={cn("text-[#758179] text-base", labelClassName)}>
        {label}
      </dt>

      <dd
        className={cn(
          "font-bold text-[#112518] line-clamp-1 text-base",
          valueClassName,
        )}
      >
        {value}
      </dd>
    </div>
  );
};

export default InfoRow;
