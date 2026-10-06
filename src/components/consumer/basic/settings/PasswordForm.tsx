import CommonButton from "@/common/button/CommonButton";
import SectionHeader from "@/common/header/SectionHeader";
import ButtonWithLoading from "@/common/loading/ButtonWithLoading";
import { inputClass } from "@/pages/Login";
import { useChangePasswordMutation } from "@/store/auth/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { z } from "zod";

const formSchema = z.object({
  oldPassword: z
    .string()
    .nonempty("Current password is required")
    .min(8, "Password must be at least 8 characters"),
  newPassword: z
    .string()
    .nonempty("New password is required")
    .min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof formSchema>;

const PasswordForm = () => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await changePassword({
        newPassword: data.newPassword,
        oldPassword: data.oldPassword,
      }).unwrap();

      reset();
    } catch (error) {
      console.error("Password update failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 ">
      <SectionHeader
        size="xl"
        title="Change Password"
        description="Update your password"
      />

      <div className="relative">
        <label htmlFor="oldPassword" className={inputClass.label}>
          Current Password
        </label>
        <input
          id="oldPassword"
          type={showOldPassword ? "text" : "password"}
          placeholder="Type here"
          {...register("oldPassword")}
          className={`${inputClass.input} pr-10`}
        />
        <button
          type="button"
          className="absolute right-3 top-[40px] text-primary-gray cursor-pointer"
          onClick={() => setShowOldPassword((prev) => !prev)}
          tabIndex={-1}
          aria-label={showOldPassword ? "Hide password" : "Show password"}
        >
          {showOldPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
        {errors.oldPassword && (
          <p className={inputClass.error}>{errors.oldPassword.message}</p>
        )}
      </div>

      <div className="relative">
        <label htmlFor="newPassword" className={inputClass.label}>
          New Password
        </label>
        <input
          id="newPassword"
          type={showNewPassword ? "text" : "password"}
          placeholder="Type here"
          {...register("newPassword")}
          className={`${inputClass.input} pr-10`}
        />
        <button
          type="button"
          className="absolute right-3 top-[40px] text-primary-gray cursor-pointer"
          onClick={() => setShowNewPassword((prev) => !prev)}
          tabIndex={-1}
          aria-label={showNewPassword ? "Hide password" : "Show password"}
        >
          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
        {errors.newPassword && (
          <p className={inputClass.error}>{errors.newPassword.message}</p>
        )}
      </div>

      <CommonButton type="submit" disabled={isLoading}>
        {isLoading ? (
          <ButtonWithLoading title={"Updating..."} />
        ) : (
          "Change Password"
        )}
      </CommonButton>
    </form>
  );
};

export default PasswordForm;
