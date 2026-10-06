import { FaCircleCheck } from "react-icons/fa6";
import { ResValidationChecklistItem } from "@/store/consumer/standard/Simulations/types/dashboard";
import { statusToneClass } from "../formatMetricCard";

interface ValidationChecklistCardProps {
  item: ResValidationChecklistItem;
}

const ValidationChecklistCard: React.FC<ValidationChecklistCardProps> = ({
  item,
}) => {
  const tone = statusToneClass(item.status);

  return (
    <div className="bg-[#EAF7E6]/30 border border-[#E7E9E8] rounded-xl p-4 sm:p-6 space-y-3">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-1">
        <div className="flex items-center gap-2 ">
          <div className="sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full  hidden ">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-4 border-[#0BAA43] bg-white">
              <FaCircleCheck className={`h-4 w-4 ${tone}`} />
            </div>
          </div>

          <h4 className="font-bold text-sm sm:text-xl text-[#112518]">
            {item.label}
          </h4>
        </div>
        <span
          className={`text-sm font-semibold shrink-0 bg-primary/10 px-3 py-1 rounded-full ${tone}`}
        >
          {item.status}
        </span>
      </div>

      <div className="md:pl-7 space-y-0.5">
        <p className="text-sm text-primary">
          Validated By: {item.validatedBy || "--"}
        </p>
        <p className="text-sm text-primary">
          Associate ID: {item.associateId || "--"}
        </p>
        <p className="text-sm text-primary">{item.role || "--"}</p>
      </div>
    </div>
  );
};

export default ValidationChecklistCard;
