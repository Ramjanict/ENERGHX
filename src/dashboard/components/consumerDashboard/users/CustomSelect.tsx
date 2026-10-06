import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { ComponentPropsWithoutRef } from "react";

export interface SelectOption<T extends string> {
  label: string;
  value: T;
}

interface CommonSelectProps<T extends string>
  extends Omit<
    ComponentPropsWithoutRef<typeof Select>,
    "value" | "onValueChange"
  > {
  value?: T;
  item: readonly SelectOption<T>[];
  w?: number;
  onValueChange?: (val: T | undefined) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

const CustomSelect = <T extends string>({
  value,
  item,
  w = 200,
  onValueChange,
  className,
  placeholder,
  disabled = false,
  ...props
}: CommonSelectProps<T>) => {
  return (
    <Select
      value={value}
      onValueChange={(val) => onValueChange?.(val as T | undefined)}
      disabled={disabled}
      {...props}
    >
      <SelectTrigger
        style={{ minWidth: w }}
        className={` ${className} bg-white rounded-lg px-3 py-6 text-black font-normal font-playfair text-base leading-[24px] border border-[#C3BEBE]  outline-none cursor-pointer transition-all duration-200`}
      >
        <SelectValue placeholder={placeholder ?? "Select an option"} />
      </SelectTrigger>

      <SelectContent className="bg-white border border-border rounded-md shadow-md">
        {item.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="cursor-pointer px-4 py-2 !bg-white hover:!bg-gray-100 transition-colors rounded"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CustomSelect;
