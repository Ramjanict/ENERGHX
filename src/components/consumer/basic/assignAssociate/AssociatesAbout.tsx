import SectionHeader from "@/common/header/SectionHeader";

const AssociatesAbout = () => {
  return (
    <div className="rounded-2xl  p-6  bg-primary/5 border border-primary/20 ">
      <SectionHeader
        size="lg"
        title="About Our Associates"
        description=" All EnerghxPLUS associates are certified professionals with extensive
        experience in renewable energy systems. They will guide you through
        every step of your energy transformation journey, from initial
        assessment to final installation and beyond."
        className="mb-4"
      />

      <button
        type="button"
        className="cursor-pointer text-sm font-semibold text-primary hover:text-green-800 transition-colors"
      >
        Learn More About Our Certification Process
      </button>
    </div>
  );
};

export default AssociatesAbout;
