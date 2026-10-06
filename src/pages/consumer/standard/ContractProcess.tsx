import ContractProposalProcess from "@/components/consumer/standard/contact/process/ContractProposalProcess";
import {
  useExecuteContractMutation,
  useGetContractQuery,
} from "@/store/consumer/standard/contract/contractApi";
import {
  mapContractDocuments,
  mapFinancialBreakdown,
  mapImplementationTimeline,
  mapNetInvestment,
  mapProjectedSavings,
  mapProjectSummarySystems,
  mapTotalProjectCost,
  mapTotalProjectDuration,
} from "@/store/consumer/standard/contract/mapContractUi";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const CHECKOUT_PATH = "/standard-consumer/checkout-report";

const ContractProcess = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetContractQuery();
  const [executeContract, { isLoading: isSubmitting }] =
    useExecuteContractMutation();

  const systems = useMemo(() => mapProjectSummarySystems(data), [data]);
  const financialLines = useMemo(() => mapFinancialBreakdown(data), [data]);
  const projectedSavings = useMemo(() => mapProjectedSavings(data), [data]);
  const documents = useMemo(() => mapContractDocuments(data), [data]);
  const timelinePhases = useMemo(
    () => mapImplementationTimeline(data),
    [data],
  );
  const totalDuration = useMemo(
    () => mapTotalProjectDuration(timelinePhases),
    [timelinePhases],
  );

  const handleProceed = async () => {
    try {
      const res = await executeContract({
        status: "EXECUTED",
        acknowledgement: true,
      }).unwrap();
      const payload = res as {
        success?: boolean;
        status?: string;
        error?: string;
        isError?: boolean;
      };
      if (
        payload?.success === false ||
        payload?.status === "BLOCKED" ||
        payload?.status === "FAILED" ||
        payload?.isError === true
      ) {
        console.warn("Contract execution blocked by backend:", payload);
        return;
      }
      navigate(CHECKOUT_PATH);
    } catch (err) {
      console.error("Failed to execute contract:", err);
    }
  };

  return (
    <div>
      <ContractProposalProcess
        loading={isLoading}
        systems={systems}
        totalCost={mapTotalProjectCost(data)}
        financialLines={financialLines}
        netInvestment={mapNetInvestment(data)}
        projectedSavings={projectedSavings}
        documents={documents}
        timelinePhases={timelinePhases}
        totalDuration={totalDuration}
        initiallyAgreed={data?.agreement?.accepted ?? false}
        isSubmitting={isSubmitting}
        onBack={() => navigate("../contract-documents")}
        onProceedToCheckout={handleProceed}
      />
    </div>
  );
};

export default ContractProcess;
