import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonHeader from "@/common/header/CommonHeader";

interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color }) => {
  return (
    <CommonBorderWrapper
      variant="sm"
      className="border-2! border-[#F3F4F6]! bg-white! flex flex-col gap-3"
    >
      <CommonHeader size="3xl" className={` ${color} font-bold!`}>
        {value}
      </CommonHeader>
      <CommonHeader size="sm">{label}</CommonHeader>
    </CommonBorderWrapper>
  );
};

export default StatCard;
