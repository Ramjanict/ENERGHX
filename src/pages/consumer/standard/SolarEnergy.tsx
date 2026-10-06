import SolarSystemDesign from "@/components/consumer/standard/commodity/solar/SolarSystemDesign";
import { useNavigate } from "react-router-dom";

const SolarEnergy = () => {
  const navigate = useNavigate();

  return (
    <div>
      <SolarSystemDesign
        isUtilityConnected={false}
        onRequestPermission={() => undefined}
        onBackToCommoditySetup={() => navigate("../energy-commodity-setup")}
        onContinueToWindSizing={() => navigate("../wind-energy")}
        onGenerateDesign={() => undefined}
      />
    </div>
  );
};

export default SolarEnergy;
