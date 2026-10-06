import EvChargingInfrastructure from "@/components/consumer/standard/commodity/ev/EvChargingInfrastructure";
import { useState } from "react";

const EvCharging = () => {
  const [isUtilityConnected, setIsUtilityConnected] = useState(false);

  return (
    <div>
      <EvChargingInfrastructure
        isUtilityConnected={isUtilityConnected}
        onRequestPermission={() => setIsUtilityConnected(true)}
        onBackToEngineeringServices={() =>
          console.log("Back to engineering services")
        }
        onContinueToBatteryStorage={() =>
          console.log("Continue to battery storage")
        }
        onRunAnalysis={(items, parameters) =>
          console.log("Running EV infrastructure analysis:", {
            items,
            parameters,
          })
        }
      />
    </div>
  );
};

export default EvCharging;
