import SectionHeader from "@/common/header/SectionHeader";
import { cn } from "@/lib/utils";

interface ConsiderationCardProps {
  title: string;
  items: string[];
  className?: string;
  dotColor?: string;
}

const ConsiderationCard = ({
  title,
  items,
  className,
  dotColor,
}: ConsiderationCardProps) => {
  return (
    <div
      className={cn(
        "space-y-6 rounded-3xl border border-[#FFF085] bg-[#FEFCE8] p-6",
        className,
      )}
    >
      <SectionHeader size="lg" title={title} />

      <ul className="space-y-1.5">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            <span
              className={` h-2 w-2 shrink-0 rounded-full  ${dotColor ? dotColor : "bg-[#D68A00]"}`}
            />
            <p className="text-base leading-6 text-[#758179]">{item}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConsiderationCard;
