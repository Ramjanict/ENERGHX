import React from "react";

interface InsightStatProps {
  label: string;
  value: string;
  valueClass?: string;
}

const InsightStat: React.FC<InsightStatProps> = ({
  label,
  value,
  valueClass = "text-foreground",
}) => {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
    </div>
  );
};

export default InsightStat;
