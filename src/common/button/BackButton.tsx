import { ArrowLeft } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  label?: string;
  to?: string;
  onClick?: () => void;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  label = "Back to Building",
  to,
  onClick,
  className,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center cursor-pointer gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors ${className ?? ""}`}
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  );
};

export default BackButton;
