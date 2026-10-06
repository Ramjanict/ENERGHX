import CommonButton from "@/common/button/CommonButton";
import CommonHeader from "@/common/header/CommonHeader";
import { Download } from "lucide-react";

interface HeaderBannerProps {
  title: string;
  description: string;
  className?: string;
  onClick?: () => void;
  isButton?: boolean;
  isLoading?: boolean;
}
const HeaderBanner: React.FC<HeaderBannerProps> = ({
  title,
  description,
  className,
  onClick,
  isButton = false,
  isLoading = false,
}) => {
  return (
    <div
      className={`rounded-xl border border-[#2DAD0033] bg-gradient-to-r from-[#2DAD001A] to-[#EAF7E6] flex flex-col md:flex-row md:items-center justify-between gap-3 p-6 md:p-8 ${className} `}
    >
      <div>
        <CommonHeader size="4xl" className="mb-2">
          {title}
        </CommonHeader>
        <CommonHeader size="md" className="">
          {description}
        </CommonHeader>
      </div>
      {isButton && (
        <CommonButton
          disabled={isLoading}
          onClick={onClick}
          variant="outline"
          className=""
        >
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </CommonButton>
      )}
    </div>
  );
};

export default HeaderBanner;
