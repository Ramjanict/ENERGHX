import { useEffect, useState } from "react";

import CommonButton from "@/common/button/CommonButton";
import { useLocation } from "react-router-dom";
import image1 from "../../../assets/wordpress/C1.jpg";
import image10 from "../../../assets/wordpress/C10.jpg";
import image11 from "../../../assets/wordpress/C11.jpg";
import image12 from "../../../assets/wordpress/C12.jpg";
import image14 from "../../../assets/wordpress/C13.jpg";
import image2 from "../../../assets/wordpress/C2.jpg";
import image3 from "../../../assets/wordpress/C3.jpg";
import image4 from "../../../assets/wordpress/C4.jpg";
import image5 from "../../../assets/wordpress/C5.jpg";
import image6 from "../../../assets/wordpress/C6.jpg";
import image7 from "../../../assets/wordpress/C7.jpg";
import image8 from "../../../assets/wordpress/C8.jpg";
import image9 from "../../../assets/wordpress/C9.jpg";
import image13 from "../../../assets/wordpress/consulting-energy.jpg";
const images = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  image10,
  image11,
  image12,
  image13,
  image14,
];

interface MotionImages {
  title: string;
}
const MotionImages: React.FC<MotionImages> = ({ title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { pathname } = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const hideUI = ["/energhxplus", "/consulting"].includes(pathname);

  console.log("hideUI", hideUI);

  return (
    <div>
      <div className="relative w-full h-[400px] overflow-hidden">
        <img
          className="w-full h-full  object-cover transition-opacity duration-500 ease-in-out"
          src={images[currentIndex]}
          alt="About Us"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 w-full ">
          <h1 className="text-2xl md:text-5xl font-bold text-white font-secondary text-center">
            {title}
          </h1>
          {hideUI && (
            <div className="flex   gap-4">
              <CommonButton variant="outline" to="/">
                Sign up
              </CommonButton>
              <CommonButton variant="outline" to="/login">
                Sign in
              </CommonButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MotionImages;
