import WindSystemDesign from "@/components/consumer/standard/commodity/wind/WindSystemDesign";
import { useNavigate } from "react-router-dom";

const WindEnergy = () => {
  const navigate = useNavigate();

  return (
    <div>
      <WindSystemDesign
        isUtilityConnected={false}
        onRequestPermission={() => undefined}
        onBackToSolarSizing={() => navigate("../solar-energy")}
        onContinueToBiomassSizing={() => navigate("../biomass-energy")}
        onGenerateDesign={() => undefined}
      />
    </div>
  );
};

export default WindEnergy;
