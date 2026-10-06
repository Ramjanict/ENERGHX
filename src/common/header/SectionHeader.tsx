import CommonHeader from "./CommonHeader";

interface SectionHeaderProps {
  title: string | number;
  description?: string;
  className?: string;
  size?: "md" | "lg" | "xl" | "2xl";
  direction?: "col" | "col-reverse";
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  className,
  size = "2xl",
  direction = "col",
}) => {
  return (
    <div
      className={`flex ${
        direction === "col" ? "flex-col" : "flex-col-reverse"
      } ${className ?? ""}`}
    >
      <CommonHeader
        size={size}
        className={`font-bold! text-[#112518]! ${className} ${size === "2xl" ? " md:mb-1" : ""}`}
      >
        {title}
      </CommonHeader>

      {description && <CommonHeader size="md">{description}</CommonHeader>}
    </div>
  );
};

export default SectionHeader;
