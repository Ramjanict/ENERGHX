import SequenceValidation from "@/components/consumer/standard/validation/resValidation/SequenceValidation";
import {
  useGetResValidationQuery,
  useGetResValidationSummaryQuery,
} from "@/store/consumer/standard/resValidation/resValidationApi";
import { normalizeResValidation } from "@/store/consumer/standard/resValidation/unwrapResValidation";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const ResSequenceValidation = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetResValidationQuery();
  const { data: summaryData, isLoading: isSummaryLoading } =
    useGetResValidationSummaryQuery();

  const resValidation = useMemo(() => {
    const base = normalizeResValidation(data?.resValidation);
    if (!summaryData) return base;

    return {
      ...base,
      lastComputedOn: summaryData.lastComputedOn ?? base.lastComputedOn,
      renewableSystemSummary: summaryData.renewableSystemSummary,
      riskAssessment: summaryData.riskAssessment,
      summary: {
        ...base.summary,
        solarCapacityKw: summaryData.metrics.solarCapacity.value,
        windCapacityKw: summaryData.metrics.windCapacity.value,
        biomassCapacityKw: summaryData.metrics.biomassCapacity.value,
        batteryCapacityKwh: summaryData.metrics.batteryCapacity.value,
        evChargingCapacityKw: summaryData.metrics.evCapacity.value,
        totalAnnualProductionKwh:
          summaryData.metrics.totalAnnualProduction.value,
        totalProjectCost: summaryData.metrics.totalProjectCost.value,
        projectedPaybackYears: summaryData.metrics.projectedRoi.value,
      },
    };
  }, [data, summaryData]);

  const loading = isLoading || isSummaryLoading;

  return (
    <SequenceValidation
      resValidation={resValidation}
      onBackToBiomassSizing={() => navigate("../biomass-energy")}
      onContinueToEngineeringReview={() => navigate("../engineering-review")}
      loading={loading}
    />
  );
};

export default ResSequenceValidation;
