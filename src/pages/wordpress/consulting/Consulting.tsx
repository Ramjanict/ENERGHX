import DownloadBanner from "../Common/DownloadBanner";
import EnergyHome from "../Common/EnergyHome";
import Footer from "../Common/Footer";
import InternshipSection from "../Common/InternshipSection";
import MotionImages from "../Common/MotionImages";
import NewFlash from "../Common/NewFlash";
import ResearchAndConsulting from "../Common/ResearchAndConsulting";
const data = {
  title: "ENERGHX HOME",
  des: "  ENERGHX™ releases a new platform for thermal comfort modelling, indoor air quality analysis, and smart energy management of energyconsumption in every built environment. Its EnerghxPlus software isa mobile or web app that promotes energy transition and the adoptionof electric mobility with a net-zero energy management system.",
  link: true,
};
const Consulting = () => {
  return (
    <>
      <MotionImages title="ENERGHX CONSULTING" />
      <EnergyHome data={data} />

      <ResearchAndConsulting />

      <DownloadBanner />
      <InternshipSection />
      <NewFlash />
      <Footer />
    </>
  );
};

export default Consulting;
