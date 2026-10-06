import { createBrowserRouter } from "react-router-dom";
import NotFound from "../pages/NotFound";
import basicConsumerRoutes from "./BasicConsumerRoutes";
import dashboardRoutes from "./DashboardRoutes";
import homeRoutes from "./HomeRoutes";
import standardConsumerRoutes from "./StandardConsumerRoutes";
import userRoutes from "./UserRoutes";

const routes = createBrowserRouter([
  homeRoutes,
  dashboardRoutes,
  basicConsumerRoutes,
  standardConsumerRoutes,
  userRoutes,
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
