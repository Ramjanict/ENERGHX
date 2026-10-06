import { cn } from "@/lib/utils";
import { Loader2, Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  isLoading?: boolean;
}

const ColorSearch: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search",
  className,
  inputClassName,
  isLoading = false,
}) => {
  return (
    <div className={cn("relative w-full sm:w-64 shrink-0", className)}>
      {isLoading ? (
        <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
      ) : (
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      )}

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full rounded-full border border-[#E2E2E2] bg-primary/5 py-2 pr-4 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary",
          inputClassName,
        )}
      />
    </div>
  );
};

export default ColorSearch;
