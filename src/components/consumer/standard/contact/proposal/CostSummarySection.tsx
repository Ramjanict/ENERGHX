import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import SectionHeader from "@/common/header/SectionHeader";
import { formatCurrency } from "@/lib/utils";
import { CostSummary } from "./types";

interface CostSummarySectionProps {
  summary: CostSummary;
}

const CostSummarySection: React.FC<CostSummarySectionProps> = ({ summary }) => {
  return (
    <CommonBorderWrapper isShadow>
      <SectionHeader size="xl" title="Cost Summary" />

      <div className="divide-y divide-[#E7E9E8]">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between py-4">
          <p className="text-[#112518]">Renewable Energy Systems</p>
          <p className="font-bold text-[#112518]">
            {formatCurrency(summary.renewableEnergySystems)}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between py-4">
          <p className="text-[#112518]">Engineering Services</p>
          <p className="font-bold text-[#112518]">
            {formatCurrency(summary.engineeringServices)}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between py-4">
          <p className="text-[#112518]">Subtotal</p>
          <p className="font-bold text-[#112518]">
            {formatCurrency(summary.subtotal)}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between py-4">
          <p className="text-[#112518]">
            Federal Tax Credit ({summary.federalTaxCreditPct}%)
          </p>
          <p className="font-bold text-green-600">
            -{formatCurrency(summary.federalTaxCreditAmount)}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between bg-[#EAF7E6]/50 rounded-xl px-5 py-5 mt-2 border border-[#E5E7EB]">
        <p className="font-bold text-[#112518] text-sm sm:text-lg">
          Net Project Investment
        </p>
        <p className="font-extrabold text-primary text-base sm:text-2xl  ">
          {formatCurrency(summary.netProjectInvestment)}
        </p>
      </div>
    </CommonBorderWrapper>
  );
};

export default CostSummarySection;
