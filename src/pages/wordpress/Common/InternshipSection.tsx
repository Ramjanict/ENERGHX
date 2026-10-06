import CommonButton from "@/common/button/CommonButton";
import WordPressWrapper from "./WordPressWrapper";

const InternshipSection = () => {
  return (
    <WordPressWrapper>
      <section className="py-16  text-white">
        <div className="p-12 bg-[#112518] rounded-md">
          <h2 className="text-xl sm:text-3xl  font-bold mb-6 font-secondary">
            Energhx Internship Programme
          </h2>
          <p className="mb-6 max-w-3xl text-[#c7ccc9] text-sm leading-7">
            ENERGHX™ is an energy management consortium of energy experts,
            industry professionals, and experienced installers/technicians.
            Through our continuous engagement in developing green energy
            solutions, ENERGHX™ is offering internship opportunities to
            prospective energy ambassadors.
          </p>

          <CommonButton to="/"> Enrol now</CommonButton>
        </div>
      </section>
    </WordPressWrapper>
  );
};

export default InternshipSection;
