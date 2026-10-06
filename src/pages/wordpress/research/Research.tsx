import DownloadBanner from "../Common/DownloadBanner";
import Footer from "../Common/Footer";
import MotionImages from "../Common/MotionImages";
import ResearchAndConsulting from "../Common/ResearchAndConsulting";
import WordPressWrapper from "../Common/WordPressWrapper";
import ResearchGroup from "./ResearchGroup";

const Research = () => {
  return (
    <div>
      <MotionImages title="RESEARCHERS" />
      <WordPressWrapper>
        <ResearchGroup />
      </WordPressWrapper>
      <ResearchAndConsulting />
      <DownloadBanner />

      <Footer />
    </div>
  );
};

export default Research;
