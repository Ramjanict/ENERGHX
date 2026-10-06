import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import React from "react";

interface CountryCardProps {
  name: string;
  code?: string;
}

const CountryCard: React.FC<CountryCardProps> = ({ name, code }) => {
  return (
    <CommonBorderWrapper variant="xs">
      <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
      {code && <p className="text-sm text-gray-500 mt-1">Code: {code}</p>}
    </CommonBorderWrapper>
  );
};

export default CountryCard;
