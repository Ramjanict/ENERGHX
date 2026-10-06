import { inputClass } from "@/pages/Login";

type TextFieldProps = {
  label: string;
  placeholder?: string;
  type?: "text" | "number";
  step?: string;
  register: any;
  name: string;
  error?: string;
};

const TextField: React.FC<TextFieldProps> = ({
  label,
  placeholder,
  type = "text",
  step,
  register,
  name,
  error,
}) => (
  <div>
    <label className={inputClass.label}>{label}</label>
    <input
      type={type}
      step={step}
      placeholder={placeholder ?? label}
      className={inputClass.input}
      {...register(name)}
    />
    {error && <p className={inputClass.error}>{error}</p>}
  </div>
);

export default TextField;
