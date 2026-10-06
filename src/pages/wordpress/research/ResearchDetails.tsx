import { PiDotOutlineFill } from "react-icons/pi";
import { useParams } from "react-router-dom";
import Footer from "../Common/Footer";
import MotionImages from "../Common/MotionImages";
import WordPressWrapper from "../Common/WordPressWrapper";
import ResearchCard from "./ResearchCard";
import { dataLists } from "./ResearchGroup";
const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-");

const ResearchDetails = () => {
  const { title } = useParams();

  const researcher = dataLists.find((item) => slugify(item.title) === title);
  const recommendedResearchers = dataLists.filter(
    (item) => slugify(item.title) !== title,
  );

  return (
    <div>
      <MotionImages title="RESEARCHERS" />

      {/* Selected Researcher Details */}
      <WordPressWrapper>
        <div className=" pt-16">
          <div className=" flex flex-col lg:flex-row gap-4 ">
            <img
              className="w-[450px]  rounded-lg"
              src={researcher?.image}
              alt={researcher?.title}
            />
            <div className="text-[#818181] pt-1">
              <h1 className="text-lg sm:text-2xl font-bold text-[#161616]">
                {researcher?.title}
              </h1>
              <p className="font-bold">{researcher?.deg}</p>
              <div className="py-2 ">
                {researcher?.work?.map((item) => (
                  <p>{item}</p>
                ))}
              </div>
              <p className=" text-primary pb-5">{researcher?.web}</p>
            </div>
          </div>
          <div>
            <h2 className=" font-bold py-1 ">A. Professional Profile</h2>
            {researcher?.profile?.map((item) => (
              <div className="flex items-start max-w-5xl py-1">
                <span className="text-2xl ">
                  <PiDotOutlineFill />
                </span>
                <p className="text-[#818181] ">{item}</p>
              </div>
            ))}

            {researcher?.para && (
              <>
                <h2 className=" font-bold pb-1 pt-5">
                  B. Professional Association
                </h2>
                <p className="text-[#818181] max-w-5xl  leading-loose">
                  {researcher?.para}
                </p>
              </>
            )}
          </div>
        </div>
        {/* Recommended Researchers */}
        <div className="pt-10 pb-16">
          <h2 className="text-2xl font-semibold pb-2 ">Researchers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendedResearchers.map((item, i) => (
              <ResearchCard item={item} key={i} />
            ))}
          </div>
        </div>
      </WordPressWrapper>

      <Footer />
    </div>
  );
};

export default ResearchDetails;
