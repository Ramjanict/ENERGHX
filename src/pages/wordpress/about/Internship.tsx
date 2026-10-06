import CommonButton from "@/common/button/CommonButton";
import CommonWordPressHeader from "../Common/CommonWordPressHeader";

const Internship = () => {
  return (
    <section className="bg-[#112518] text-white  w-full rounded-sm p-16">
      <div className=" flex flex-col gap-6 ">
        <CommonWordPressHeader className="text-white !pb-0">
          ENERGHX INTERNSHIP PROGRAMME
        </CommonWordPressHeader>
        <p className="text-sm  text-white/50 py">
          ENERGHX™ is a consortium of energy experts, researchers, industry
          professionals, and experienced installers/technicians who onboard the
          EnerghxPlus platform as either a server or a developer. Through our
          continuous engagement in developing green energy solutions, ENERGHX™
          is offering internship opportunities to prospective energy ambassadors
          as servers and developers.
        </p>
        <div className="w-full  flex flex-col sm:flex-row justify-center gap-4">
          <CommonButton to="/server-developer">Enroll as SERVER</CommonButton>
          <CommonButton to="/server-developer">
            Enroll as DEVELOPER
          </CommonButton>
        </div>
      </div>
    </section>
  );
};

export default Internship;
