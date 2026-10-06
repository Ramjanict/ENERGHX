import { Minus, Plus } from "lucide-react";
import React from "react";

interface CounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

const Counter: React.FC<CounterProps> = ({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  className,
}) => {
  const handleDecrement = () => {
    if (value - step >= min) onChange(value - step);
  };

  const handleIncrement = () => {
    if (value + step <= max) onChange(value + step);
  };

  return (
    <div
      className={`inline-flex items-center gap-4 border border-gray-200 rounded-lg px-4 py-2 bg-white ${className ?? ""}`}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className="text-green-600 hover:text-green-700 cursor-pointer disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease"
      >
        <Minus className="w-4 h-4" />
      </button>

      <span className="font-bold text-foreground text-base min-w-[1ch] text-center">
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className="text-green-600 hover:text-green-700 cursor-pointer disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Counter;
