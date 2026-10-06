import SectionHeader from "@/common/header/SectionHeader";
import Spinner from "@/common/loading/Spinner";
import ServiceCard from "@/components/consumer/standard/commodity/addServices/ServiceCard";
import ServiceSummary from "@/components/consumer/standard/commodity/addServices/ServiceSummary";
import RecommendationCard from "@/components/consumer/standard/commodity/zev/RecommendationCard";
import {
  useGetConsumerEngineeringServicesQuery,
  useGetEngineeringServicesCatalogQuery,
  useSaveConsumerEngineeringServicesMutation,
} from "@/store/consumer/standard/engineeringServices/engineeringServicesApi";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddEngineeringServices = () => {
  const navigate = useNavigate();

  const { data: catalogData, isLoading: isCatalogLoading } =
    useGetEngineeringServicesCatalogQuery();

  const { data: selectionData } = useGetConsumerEngineeringServicesQuery();

  const [saveSelection, { isLoading: isSaving }] =
    useSaveConsumerEngineeringServicesMutation();

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const services = useMemo(() => {
    const items = catalogData?.engineeringServices ?? [];
    return [...items]
      .filter((service) => service.active)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [catalogData]);

  useEffect(() => {
    if (hydrated || !selectionData?.engineeringServices) return;
    setSelectedKeys(
      selectionData.engineeringServices.selectedServiceKeys ?? [],
    );
    setHydrated(true);
  }, [selectionData, hydrated]);

  const toggleService = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const selectedServices = services.filter((service) =>
    selectedKeys.includes(service.key),
  );

  const totalAmount = selectedServices.reduce(
    (sum, service) => sum + service.startingCost,
    0,
  );

  const currency =
    selectionData?.engineeringServices.currency ??
    selectedServices[0]?.currency ??
    "USD";

  const handleContinue = async () => {
    if (selectedKeys.length === 0) return;

    try {
      await saveSelection({
        status: "COMPLETED",
        selectedServiceKeys: selectedKeys,
        notes:
          "User selected engineering services from Standard Consumer flow.",
      }).unwrap();
      navigate("../solar-energy");
    } catch (err) {
      console.error("Failed to save engineering services selection", err);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Add Engineering Services"
        description="Select professional services for your project"
      />

      {isCatalogLoading ? (
        <Spinner size="xl" text="Loading engineering services..." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={{
                  key: service.key,
                  title: service.title,
                  description: service.description,
                  duration: service.duration,
                  startingCost: service.startingCost,
                  currency: service.currency,
                }}
                selected={selectedKeys.includes(service.key)}
                onClick={() => toggleService(service.key)}
              />
            ))}
          </div>{" "}
          <ServiceSummary
            serviceCount={selectedServices.length}
            totalAmount={totalAmount}
            currency={currency}
            onContinue={handleContinue}
            isSaving={isSaving}
          />
          <RecommendationCard
            title="Need Help Choosing?"
            description="Our energy consultants can help you select the right services for your project goals."
            footer="Schedule Consultation"
            footerClassName="text-[#155DFC]"
            wrapperClassName="bg-blue-50"
            borderClassName="border-blue-100"
          />
        </>
      )}
    </div>
  );
};

export default AddEngineeringServices;
