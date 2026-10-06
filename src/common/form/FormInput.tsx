import { inputClass } from "@/pages/Login";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import {
  FieldErrors,
  FieldPath,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

type FormInputType = "text" | "number" | "email" | "password";

type FormInputProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  placeholder?: string;
  type?: FormInputType;
  className?: string;
};

const FormInput = <TFieldValues extends FieldValues>({
  name,
  register,
  errors,
  placeholder,
  type = "text",
  className,
}: FormInputProps<TFieldValues>) => {
  const [showPassword, setShowPassword] = useState(false);

  const error = errors[name as FieldPath<TFieldValues>] as
    | { message?: string }
    | undefined;

  // Type-specific register options
  const registerOptions: RegisterOptions<TFieldValues> = {};
  if (type === "number") {
    registerOptions.valueAsNumber = true;
  }

  const resolvedType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className={className}>
      <div className={type === "password" ? "relative" : undefined}>
        <input
          type={resolvedType}
          placeholder={placeholder}
          inputMode={type === "number" ? "numeric" : undefined}
          autoComplete={type === "password" ? "current-password" : undefined}
          className={inputClass.input}
          {...register(name, registerOptions)}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {error?.message && <p className={inputClass.error}>{error.message}</p>}
    </div>
  );
};

export default FormInput;
