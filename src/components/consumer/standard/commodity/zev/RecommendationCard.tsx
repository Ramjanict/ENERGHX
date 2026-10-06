import SectionHeader from "@/common/header/SectionHeader";
import { cn } from "@/lib/utils";

interface RecommendationCardProps {
  number?: number;
  title: string;
  description: string;
  /** Call-to-action text. The button is omitted when this is not provided. */
  footer?: string;
  onFooterClick?: () => void;
  wrapperClassName?: string;
  borderClassName?: string;
  badgeClassName?: string;
  footerClassName?: string;
  className?: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  number,
  title,
  description,
  footer,
  onFooterClick,
  wrapperClassName,
  borderClassName,
  badgeClassName,
  footerClassName,
  className,
}) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#E7E9E8] p-5 flex gap-3 ",
        wrapperClassName,
        borderClassName,
        className,
      )}
    >
      {number && (
        <span
          className={cn(
            "w-7 h-7 rounded-full text-white text-sm font-bold flex items-center justify-center shrink-0",
            badgeClassName,
          )}
        >
          {number}
        </span>
      )}
      <div className="space-y-2">
        <SectionHeader size="md" title={title} description={description} />
        {footer && (
          <button
            type="button"
            onClick={onFooterClick}
            className={cn(
              "text-sm font-bold",
              onFooterClick && "cursor-pointer hover:underline",
              footerClassName,
            )}
          >
            {footer}
          </button>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;
