import { FaCrown } from "react-icons/fa";
import CommonWrapper from "./CommonWrapper";
interface CoverBannerProps {
  name: string;
  role: string;
  imageUrl: string;
  onUpgrade?: () => void;
}

const CommonBanner: React.FC<CoverBannerProps> = ({
  name,
  role,
  imageUrl,
  onUpgrade,
}) => {
  return (
    <CommonWrapper>
      <div className="w-full flex items-center justify-between  rounded-lg py-10  bg-white px-4">
        <div className="flex items-center gap-1 sm:gap-4">
          <img
            src={imageUrl}
            alt={name}
            className="w-20 h-20 sm:w-32 sm:h-32 rounded-full border-2 border-gray-300"
          />
          <div>
            <h2 className="text-[10px] lg:text-2xl font-secondary font-bold text-[#112518]">
              {name}
            </h2>
            <p className="text-[10px] sm:text-lg text-primary font-primary">
              {role}
            </p>
          </div>
        </div>

        {onUpgrade && (
          <button
            onClick={onUpgrade}
            className="px-2 sm:px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary transition duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-1 text-xs sm:text-lg">
              <span>
                <FaCrown />
              </span>
              Upgrade
            </div>
          </button>
        )}
      </div>
    </CommonWrapper>
  );
};

export default CommonBanner;
