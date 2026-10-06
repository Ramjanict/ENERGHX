import SectionHeader from "@/common/header/SectionHeader";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";

interface IconSectionHeaderProps {
  icon: LucideIcon | IconType;
  title: string;
  description?: string;
  iconBgClassName: string;
  iconClassName: string;
  className?: string;
}

const IconSectionHeader: React.FC<IconSectionHeaderProps> = ({
  icon: Icon,
  title,
  description,
  iconBgClassName,
  iconClassName,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(iconBgClassName, "p-2.5 rounded-xl hidden sm:block")}>
        <Icon className={cn("w-6 h-6", iconClassName)} />
      </div>

      <div>
        <SectionHeader
          title={title}
          description={description}
          className="mb-0!"
        />
      </div>
    </div>
  );
};

export default IconSectionHeader;
