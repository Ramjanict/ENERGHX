import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import SectionHeader from "@/common/header/SectionHeader";
import { ImplementationWorkflowResponse } from "@/store/consumer/standard/POTENTIALLY OBSOLETE/types/potentiall";
import React from "react";
import WorkflowStep, { WorkflowStepStatus } from "./WorkflowStep";

interface Step {
  title: string;
  description: string;
  status: WorkflowStepStatus;
}

const DEFAULT_STEPS: Step[] = [
  {
    title: "Basic Audit Complete",
    description: "Building analysis and renewable recommendations generated",
    status: "complete",
  },
  {
    title: "Service Configuration",
    description: "Select and configure engineering services",
    status: "current",
  },
  {
    title: "System Sizing",
    description: "Complete renewable energy system specifications",
    status: "upcoming",
  },
  {
    title: "Contract & Implementation",
    description: "Review proposal and finalize agreement",
    status: "upcoming",
  },
];

interface ImplementationWorkflowProps {
  workflowData?: ImplementationWorkflowResponse;
}

const mapStepStatus = (status?: string): WorkflowStepStatus => {
  const s = status?.toUpperCase();
  if (s === "COMPLETED" || s === "EXECUTED" || s === "COMPLETE") return "complete";
  if (s === "IN_PROGRESS" || s === "CURRENT") return "current";
  return "upcoming";
};

const ImplementationWorkflow: React.FC<ImplementationWorkflowProps> = ({
  workflowData,
}) => {
  const handleStart = (title: string) => {
    console.log("Start step →", title);
    // TODO: navigate to the relevant step
  };

  const stepsToRender: Step[] = workflowData?.steps?.length
    ? workflowData.steps.map((s) => ({
        title: s.title,
        description: s.description,
        status: mapStepStatus(s.status),
      }))
    : DEFAULT_STEPS;

  return (
    <CommonBorderWrapper isShadow>
      <SectionHeader size="xl" title="Implementation Workflow" />
      <div className="space-y-4">
        {stepsToRender.map((step, index) => (
          <WorkflowStep
            key={step.title}
            stepNumber={index + 1}
            title={step.title}
            description={step.description}
            status={step.status}
            onStart={() => handleStart(step.title)}
          />
        ))}
      </div>
    </CommonBorderWrapper>
  );
};

export default ImplementationWorkflow;
