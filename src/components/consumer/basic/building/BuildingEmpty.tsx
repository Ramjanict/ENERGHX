import home from "@/assets/consumer/home.svg";
import CommonButton from "@/common/button/CommonButton";
import CommonHeader from "@/common/header/CommonHeader";

const BuildingEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center  space-y-6 ">
      <div className="w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center ">
        <img src={home} className="w-full h-full object-contain" alt="" />
      </div>

      <div className="space-y-3 flex flex-col justify-center items-center">
        <CommonHeader size="4xl">
          Enter Building Type and Specifications
        </CommonHeader>
        <CommonHeader size="sm">
          Add your building details and room information to begin the audit
          process
        </CommonHeader>
        <CommonButton to="./create-building">Create Building</CommonButton>
      </div>
    </div>
  );
};

export default BuildingEmpty;
