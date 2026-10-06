import BiomassSystemDesign from "@/components/consumer/standard/commodity/biomass/BiomassSystemDesign";
import { useState } from "react";

const BiomassEnergy = () => {
  const [isUtilityConnected, setIsUtilityConnected] = useState(false);

  return (
    <div>
      <BiomassSystemDesign
        isUtilityConnected={isUtilityConnected}
        onRequestPermission={() => setIsUtilityConnected(true)}
        onBackToWindSizing={() => console.log("Back to wind sizing")}
        onContinueToValidation={() => console.log("Continue to validation")}
        onGenerateDesign={(items, parameters) =>
          console.log("Generated biomass design:", { items, parameters })
        }
      />
    </div>
  );
};

export default BiomassEnergy;
