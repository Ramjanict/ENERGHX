import CommonButton from "@/common/button/CommonButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { PasswordFormData, passwordSchema } from "./validationSchema";

const Password = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const toggleVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: PasswordFormData) => {
    setLoading(true);
    try {
      // if (consumer?.userType === "CONSUMER") {
      //   await updatePassword(data);
      // } else {
      //   // await changePassword(data);
      // }
    } catch (error) {
      console.error("Password update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = {
    input: "w-full  border border-primary-gray p-2 ",
    label: "text-primary-gray block mb-1",
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full sm:w-[50%] pb-10 text-primary-gray text-sm sm:text-lg"
      >
        <div className="pt-6">
          <label htmlFor="oldPassword" className={inputClass.label}>
            New Password
          </label>
          <div className="border border-[#9DA6A0] flex items-center">
            <input
              {...register("password")}
              id="oldPassword"
              type={showPassword.old ? "text" : "password"}
              placeholder="Type here"
              className="w-full outline-none  bg-transparent p-2"
            />
            <div
              className="px-2 cursor-pointer"
              onClick={() => toggleVisibility("old")}
            >
              {showPassword.old ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="pt-6">
          <label htmlFor="confirmPassword" className={inputClass.label}>
            Confirm Password
          </label>
          <div className="border border-[#9DA6A0] flex items-center">
            <input
              {...register("confirmPassword")}
              id="confirmPassword"
              type={showPassword.new ? "text" : "password"}
              placeholder="Type here"
              className={"w-full outline-none p-2"}
            />
            <div
              className="px-2 cursor-pointer"
              onClick={() => toggleVisibility("new")}
            >
              {showPassword.new ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="pt-8">
          <CommonButton disabled={loading}>
            {loading ? "Saving..." : "Update Password "}
          </CommonButton>
        </div>
      </form>
    </div>
  );
};

export default Password;
