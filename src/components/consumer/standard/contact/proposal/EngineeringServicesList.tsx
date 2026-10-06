import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import SectionHeader from "@/common/header/SectionHeader";
import { formatCurrency, parseNumericValue } from "@/lib/utils";
import { EngineeringServiceItem } from "./types";

interface EngineeringServicesListProps {
  items: EngineeringServiceItem[];
}

const EngineeringServicesList: React.FC<EngineeringServicesListProps> = ({
  items,
}) => {
  const total = items.reduce((sum, item) => sum + parseNumericValue(item.cost), 0);

  return (
    <CommonBorderWrapper isShadow>
      <SectionHeader size="xl" title="Selected Engineering Services" />

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#EAF7E6]/30 border border-[#E5E7EB] rounded-xl px-5 py-4"
          >
            <div className="flex items-center gap-4">
              <span className="w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0">
                {item.order}
              </span>
              <div>
                <p className="font-bold text-[#112518]">{item.title}</p>
                <p className="text-sm text-[#758179]">{item.durationLabel}</p>
              </div>
            </div>
            <p className="font-bold text-[#112518] shrink-0">
              {formatCurrency(item.cost)}
            </p>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between bg-[#EAF7E6]/50 rounded-xl px-5 py-4 border border-[#E5E7EB]">
          <p className="font-bold text-[#112518]">Total Engineering Services</p>
          <p className="font-bold text-primary text-lg">
            {formatCurrency(total)}
          </p>
        </div>
      </div>
    </CommonBorderWrapper>
  );
};

export default EngineeringServicesList;
