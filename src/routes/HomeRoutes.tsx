import Cancel from "@/common/LMS/Cancel";
import Success from "@/common/LMS/Success";
import CreatePassword from "@/common/password/CreatePassword";
import ForgotPassword from "@/common/password/ForgotPassword";
import Register from "@/components/register/Register";
import Login from "@/pages/Login";
import AboutUs from "@/pages/wordpress/about/AboutUs";
import Consulting from "@/pages/wordpress/consulting/Consulting";
import ContactUs from "@/pages/wordpress/contact/ContactUs";
import Energhxplus from "@/pages/wordpress/energhxplus/Energhxplus";
import WhomePage from "@/pages/wordpress/home/WhomePage";
import Research from "@/pages/wordpress/research/Research";
import ResearchDetails from "@/pages/wordpress/research/ResearchDetails";
import App from "../App";
import Home from "../pages/Home";
import GuestRoute from "./GuestRoute";

const homeRoutes = {
  path: "/",
  element: <App />,
  children: [
    {
      path: "/",
      element: (
        <GuestRoute>
          <Home />
        </GuestRoute>
      ),
    },

    {
      path: "/home",
      element: <WhomePage />,
    },
    {
      path: "/about-us",
      element: <AboutUs />,
    },
    {
      path: "/consulting",
      element: <Consulting />,
    },
    {
      path: "/research",
      element: <Research />,
    },
    {
      path: "/research/:title",
      element: <ResearchDetails />,
    },
    {
      path: "/energhxplus",
      element: <Energhxplus />,
    },
    {
      path: "/contact-us",
      element: <ContactUs />,
    },

    {
      path: "/create-password",
      element: <CreatePassword />,
    },

    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "register",
      element: (
        <GuestRoute>
          <Register />
        </GuestRoute>
      ),
    },
    {
      path: "/login",
      element: (
        <GuestRoute>
          <Login />
        </GuestRoute>
      ),
    },
    {
      path: "/payment/success",
      element: <Success />,
    },
    {
      path: "/payment/cancel",
      element: <Cancel />,
    },
  ],
};

export default homeRoutes;
