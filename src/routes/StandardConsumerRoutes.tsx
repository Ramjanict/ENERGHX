import LayoutStandardConsumer from "@/Layout/LayoutStandardConsumer";
import AssignedAssociates from "@/pages/consumer/basic/AssignedAssociates";
import Settings from "@/pages/consumer/basic/Settings";
import AddEngineeringServices from "@/pages/consumer/standard/AddEngineeringServices";
import BatteryStorage from "@/pages/consumer/standard/BatteryStorage";
import BiomassEnergy from "@/pages/consumer/standard/BiomassEnergy";
import CheckoutReport from "@/pages/consumer/standard/CheckoutReport";
import CommodityContract from "@/pages/consumer/standard/CommodityContract";
import CommoditySetup from "@/pages/consumer/standard/CommoditySetup";
import ContractDocuments from "@/pages/consumer/standard/ContractDocuments";
import ContractProcess from "@/pages/consumer/standard/ContractProcess";
import EngineeringReviewApproval from "@/pages/consumer/standard/EngineeringReviewApproval";
import EvCharging from "@/pages/consumer/standard/EvCharging";
import HvacModelling from "@/pages/consumer/standard/HvacModelling";
import NetZeroEnergyBuilding from "@/pages/consumer/standard/NetZeroEnergyBuilding";
import ResSequenceValidation from "@/pages/consumer/standard/ResSequenceValidation";
import SDashboard from "@/pages/consumer/standard/SDashboard";
import SolarEnergy from "@/pages/consumer/standard/SolarEnergy";
import ThermalComfortSimulation from "@/pages/consumer/standard/ThermalComfortSimulation";
import WindEnergy from "@/pages/consumer/standard/WindEnergy";
import ZeroEmissionVehicle from "@/pages/consumer/standard/ZeroEmissionVehicle";
import ProjectProposalContract from "./ProjectProposalContract";
import ProtectedRoute from "./ProtectedRoute";

const standardConsumerRoutes = {
  path: "standard-consumer",
  element: (
    <ProtectedRoute allowedRoles={["CONSUMER"]}>
      <LayoutStandardConsumer />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <SDashboard /> },
    { path: "dashboard", element: <SDashboard /> },

    // Energy Commodity Setup
    { path: "energy-commodity-setup", element: <CommoditySetup /> },
    { path: "zev", element: <ZeroEmissionVehicle /> },
    { path: "nzeb", element: <NetZeroEnergyBuilding /> },
    {
      path: "thermal-comfort-simulation",
      element: <ThermalComfortSimulation />,
    },
    { path: "engineering-services", element: <AddEngineeringServices /> },
    { path: "solar-energy", element: <SolarEnergy /> },
    { path: "wind-energy", element: <WindEnergy /> },
    { path: "biomass-energy", element: <BiomassEnergy /> },
    { path: "hvac-modelling", element: <HvacModelling /> },
    { path: "battery-storage", element: <BatteryStorage /> },
    { path: "ev-charging", element: <EvCharging /> },

    // Validation & Approval
    { path: "res-sequence-validation", element: <ResSequenceValidation /> },
    { path: "engineering-review", element: <EngineeringReviewApproval /> },

    // Contracts & Reports
    { path: "project-proposal", element: <ProjectProposalContract /> },
    { path: "contract-documents", element: <ContractDocuments /> },
    {
      path: "contract-process",
      element: <ContractProcess />,
    },
    {
      path: "commodity-contract",
      element: <CommodityContract />,
    },

    { path: "checkout-report", element: <CheckoutReport /> },

    // Settings
    { path: "profile-settings", element: <Settings /> },
    { path: "assigned-associates", element: <AssignedAssociates /> },
  ],
};

export default standardConsumerRoutes;
