import CommonSelect from "@/common/button/CommonSelect";
import { inputClass } from "@/pages/Login";
import { Controller } from "react-hook-form";

type SelectFieldProps = {
  label: string;
  name: string;
  control: any;
  options: { label: string; value: string }[];
  error?: string;
};

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  control,
  options,
  error,
}) => (
  <div>
    <label className={inputClass.label}>{label}</label>
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <CommonSelect
          value={field.value}
          onValueChange={field.onChange}
          item={options}
          placeholder={`Select ${label}`}
          className="w-full"
        />
      )}
    />
    {error && <p className={inputClass.error}>{error}</p>}
  </div>
);

export default SelectField;
