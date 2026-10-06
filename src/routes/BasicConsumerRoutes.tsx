import ApplianceDatabase from "@/components/consumer/basic/building/ApplianceDatabase";
import AppliancesManagement from "@/components/consumer/basic/building/AppliancesManagement";
import BuildingDetails from "@/components/consumer/basic/building/BuildingDetails";
import BuildingList from "@/components/consumer/basic/building/BuildingList ";
import CustomAppliance from "@/components/consumer/basic/building/CustomAppliance";
import EVDatabase from "@/components/consumer/basic/building/EVDatabase";
import EVManagement from "@/components/consumer/basic/building/EVManagement";
import AddRoom from "@/components/consumer/basic/building/room/AddRoom";
import LayoutBasicConsumer from "@/Layout/LayoutBasicConsumer";
import AssignedAssociates from "@/pages/consumer/basic/AssignedAssociates";
import BAnalysis from "@/pages/consumer/basic/BAnalysis";
import BBiomassEnergy from "@/pages/consumer/basic/BBiomassEnergy";
import BDashboard from "@/pages/consumer/basic/BDashboard";
import BSolarEnergy from "@/pages/consumer/basic/BSolarEnergy";
import Building from "@/pages/consumer/basic/Building";
import BWindEnergy from "@/pages/consumer/basic/BWindEnergy";
import CreateBuilding from "@/pages/consumer/basic/CreateBuilding";
import Settings from "@/pages/consumer/basic/Settings";
import ProtectedRoute from "./ProtectedRoute";

const basicConsumerRoutes = {
  path: "basic-consumer",
  element: (
    <ProtectedRoute allowedRoles={["CONSUMER"]}>
      <LayoutBasicConsumer />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <BDashboard /> },
    { path: "dashboard", element: <BDashboard /> },
    {
      path: "building",
      element: <Building />,

      children: [
        { index: true, element: <BuildingList /> },
        { path: "create-building", element: <CreateBuilding /> },
        { path: "building-details/:id", element: <BuildingDetails /> },
        { path: "add-room/:id", element: <AddRoom /> },
        {
          path: "add-appliance/:buildingId/:roomId",
          element: <ApplianceDatabase />,
        },
        {
          path: "custom-appliance/:buildingId/:roomId",
          element: <CustomAppliance />,
        },
        { path: "add-ev/:buildingId/:roomId", element: <EVManagement /> },
        {
          path: "add-ev-database/:buildingId/:roomId",
          element: <EVDatabase />,
        },
        {
          path: "manage-all-appliances/:buildingId",
          element: <AppliancesManagement />,
        },
      ],
    },

    { path: "solar-energy", element: <BSolarEnergy /> },
    { path: "wind-energy", element: <BWindEnergy /> },
    { path: "biomass-energy", element: <BBiomassEnergy /> },
    { path: "analysis", element: <BAnalysis /> },
    { path: "settings", element: <Settings /> },
    { path: "assigned-associates", element: <AssignedAssociates /> },
  ],
};

export default basicConsumerRoutes;
