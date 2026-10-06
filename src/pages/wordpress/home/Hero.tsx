import CommonButton from "@/common/button/CommonButton";
import img from "../../../assets/wordpress/hero-banner.png";
import WordPressWrapper from "../Common/WordPressWrapper";

const Hero = () => {
  return (
    <section
      id="hero"
      className="w-full min-h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: `url(${img})` }}
    >
      <WordPressWrapper>
        {/* <Header /> */}
        <div className="flex flex-col justify-end h-[calc(100vh-100px)] py-12">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight font-secondary">
            MONITOR
            <br />
            DESIGN
            <br />
            MANAGE
          </h1>
          <p className="text-xl mt-4">Your energy consumption</p>
          <div className="flex space-x-4 mt-8">
            <CommonButton to="/" variant="outline">
              Sign up
            </CommonButton>
            <CommonButton to="/login" variant="outline">
              Sign in
            </CommonButton>
          </div>
        </div>
      </WordPressWrapper>
    </section>
  );
};

export default Hero;
