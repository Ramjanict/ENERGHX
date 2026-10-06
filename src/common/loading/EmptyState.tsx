import { FC } from "react";

interface EmptyStateProps {
  message?: string;
}

const EmptyState: FC<EmptyStateProps> = ({
  message = "No data available yet.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <p className="text-lg font-medium text-neutral-500">{message}</p>
    </div>
  );
};

export default EmptyState;
