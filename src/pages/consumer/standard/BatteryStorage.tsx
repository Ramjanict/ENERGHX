import BatteryStorageDesign from "@/components/consumer/standard/commodity/battery/BatteryStorageDesign";
import { useState } from "react";

const BatteryStorage = () => {
  const [isUtilityConnected, setIsUtilityConnected] = useState(false);

  return (
    <div>
      <BatteryStorageDesign
        isUtilityConnected={isUtilityConnected}
        onRequestPermission={() => setIsUtilityConnected(true)}
        onBackToHvacModelling={() => console.log("Back to HVAC modelling")}
        onContinueToEvCharging={() => console.log("Continue to EV charging")}
        onGenerateDesign={(items, parameters) =>
          console.log("Generated battery design:", { items, parameters })
        }
      />
    </div>
  );
};

export default BatteryStorage;
