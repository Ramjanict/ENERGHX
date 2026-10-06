import { Check } from "lucide-react";
import React from "react";

export type WorkflowStepStatus = "complete" | "current" | "upcoming";

interface WorkflowStepProps {
  stepNumber: number;
  title: string;
  description: string;
  status: WorkflowStepStatus;
  onStart?: () => void;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({
  stepNumber,
  title,
  description,
  status,
  onStart,
}) => {
  const isComplete = status === "complete";
  const isCurrent = status === "current";
  const isUpcoming = status === "upcoming";

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-2xl border p-5 ${
        isUpcoming
          ? "border-gray-100 bg-gray-50/40"
          : "border-green-100 bg-green-50/40"
      }`}
    >
      <div className="flex items-center gap-4">
        <span
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${
            isUpcoming ? "bg-gray-200 text-gray-400" : "bg-green-600 text-white"
          }`}
        >
          {isComplete ? <Check className="w-5 h-5" /> : stepNumber}
        </span>

        <div>
          <p
            className={`font-bold ${
              isUpcoming ? "text-gray-400" : "text-foreground"
            }`}
          >
            {title}
          </p>
          <p
            className={`text-sm ${
              isUpcoming ? "text-gray-300" : "text-muted-foreground"
            }`}
          >
            {description}
          </p>
        </div>
      </div>

      {isCurrent && (
        <button
          type="button"
          onClick={onStart}
          className="font-semibold text-green-600 hover:text-green-700 transition-colors shrink-0"
        >
          Start
        </button>
      )}
    </div>
  );
};

export default WorkflowStep;
