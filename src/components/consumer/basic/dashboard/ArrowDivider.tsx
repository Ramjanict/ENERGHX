import { FaArrowDownLong } from "react-icons/fa6";

interface ArrowDividerProps {
  className?: string;
  arrowColor?: "green" | "blue";
}
const ArrowDivider: React.FC<ArrowDividerProps> = ({
  className,
  arrowColor = "green",
}) => {
  return (
    <div
      className={`flex items-center justify-center ${arrowColor === "green" ? "text-[#2DAD00]" : "text-[#3B82F6]"} text-xl font-bold ${className}`}
    >
      <FaArrowDownLong />
    </div>
  );
};

export default ArrowDivider;
