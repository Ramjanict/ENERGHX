import BuildingHvacModelling from "@/components/consumer/standard/commodity/buildingHVAC/BuildingHvacModelling";
import { useState } from "react";

const HvacModelling = () => {
  const [isUtilityConnected, setIsUtilityConnected] = useState(false);

  return (
    <div>
      <BuildingHvacModelling
        isUtilityConnected={isUtilityConnected}
        onRequestPermission={() => setIsUtilityConnected(true)}
        onBackToEngineeringServices={() =>
          console.log("Back to engineering services")
        }
        onContinueToBatteryStorage={() =>
          console.log("Continue to battery storage")
        }
        onGenerateConfiguration={(items, parameters) =>
          console.log("Generated HVAC configuration:", { items, parameters })
        }
      />
    </div>
  );
};

export default HvacModelling;
