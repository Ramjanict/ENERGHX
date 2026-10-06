import CommonHeader from "@/common/header/CommonHeader";
import { FaRegCircleCheck } from "react-icons/fa6";

interface JourneyStepProps {
  num: number;
  title: string;
  desc: string;
  items: string[];
  color?: string;
}

const JourneyStep = ({
  num,
  title,
  desc,
  items,
  color = "bg-primary",
}: JourneyStepProps) => {
  return (
    <div className="flex gap-3">
      <div
        className={`${color} text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5`}
      >
        {num}
      </div>
      <div>
        <CommonHeader size="lg" className="font-semibold! mb-1">
          {title}
        </CommonHeader>
        <CommonHeader size="sm" className="">
          {desc}
        </CommonHeader>
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5  mb-0.5 ml-4 mt-2">
            <FaRegCircleCheck
              className={` ${color === "bg-blue-500" ? "text-blue-500" : "text-green-500"} text-md shrink-0`}
            />
            <CommonHeader size="sm" className="">
              {item}
            </CommonHeader>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JourneyStep;
