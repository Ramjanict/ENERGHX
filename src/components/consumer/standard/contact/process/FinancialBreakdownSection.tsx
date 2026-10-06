import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import SectionHeader from "@/common/header/SectionHeader";
import { FinancialBreakdownLine } from "./types";

interface FinancialBreakdownSectionProps {
  lines: FinancialBreakdownLine[];
  netInvestment: number;
}

const FinancialBreakdownSection: React.FC<FinancialBreakdownSectionProps> = ({
  lines,
  netInvestment,
}) => {
  return (
    <CommonBorderWrapper isShadow>
      <SectionHeader size="xl" title="Financial Breakdown" />

      <div className="space-y-3">
        {lines.map((line) => (
          <div
            key={line.id}
            className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between bg-[#EAF7E6]/30 border border-[#E5E7EB] rounded-xl px-5 py-4"
          >
            <p className="text-[#112518]">{line.label}</p>
            <p
              className={`font-bold ${
                line.isDeduction ? "text-primary" : "text-[#112518]"
              }`}
            >
              {line.isDeduction ? "-" : ""}${line.amount.toLocaleString()}
            </p>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row  sm:items-center justify-between bg-primary rounded-xl px-5 py-5">
          <p className="text-white font-medium text-base sm:text-lg">
            Net Investment
          </p>
          <p className="text-white font-extrabold text-xl sm:text-2xl ">
            ${netInvestment.toLocaleString()}
          </p>
        </div>
      </div>
    </CommonBorderWrapper>
  );
};

export default FinancialBreakdownSection;
