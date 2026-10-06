import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectOption<T extends string> {
  label: string;
  value: T;
}

interface SelectProps<T extends string> {
  value: T | undefined;
  item: readonly SelectOption<T>[];
  w?: number;
  onValueChange: (val: T) => void;
  className?: string;
  arrow?: string;
  placeholder?: string;
  disabled?: boolean;
}

const CommonSelect = <T extends string>({
  value,
  item,
  w = 200,
  onValueChange,
  disabled = false,
  className,
  placeholder,
}: SelectProps<T>) => {
  return (
    <Select value={value || undefined} onValueChange={onValueChange}>
      <SelectTrigger
        style={{ minWidth: w }}
        className={` ${className} bg-white border border-gray-200 px-4 py-5.5 cursor-pointer rounded-xl text-sm font-medium text-gray-700 shadow-sm hover:border-gray-300 hover:shadow-md  transition-all duration-200 ease-in-out outline-none ${
          disabled &&
          "opacity-50 cursor-not-allowed hover:shadow-sm hover:border-gray-200"
        } `}
      >
        <SelectValue placeholder={placeholder || "Select an option"} />
      </SelectTrigger>

      <SelectContent className="bg-white border border-gray-100 rounded-xl shadow-lg py-1 overflow-hidden">
        {item.map((option, index) => (
          <SelectItem
            key={option.value + index}
            value={option.value}
            className="cursor-pointer px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 data-[state=checked]:bg-primary/5 data-[state=checked]:text-primary data-[state=checked]:font-medium rounded-lg mx-1 my-0.5 transition-colors duration-150"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CommonSelect;
